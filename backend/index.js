import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

// Session stuff & passport stuff
import passport from "passport";
import { buildContext } from "graphql-passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

// GraphQL stuff
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// Resolvers & TypeDefs
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

// DB connection
import connectDB from "./db/connectDB.js";

// Authentication
import { configurePassort } from "./passport/passport.config.js";

dotenv.config();
configurePassort();

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.

const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (error) => {
  console.log(error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // This option specifies whether to save the session to the store on every request or not. true = we allow multiple sessions for one user
    saveUninitialized: false, // Option specifies whether to save uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // Expire in 7 days
      httpOnly: true, // Prevents Cross-Site Scripting (XSS) attacks
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// for our httpServer.
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/`);
