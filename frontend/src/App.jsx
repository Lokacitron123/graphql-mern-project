import { Navigate, Route, Routes } from "react-router-dom";

// UI
import Header from "./components/ui/Header";

// Pages
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";

// Apollo Client & Queries

import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";

function App() {
  const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER);
  if (loading) return <p>Loading...</p>;

  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path='/'
          element={data.authUser ? <HomePage /> : <Navigate to='/login' />}
        />
        <Route
          path='/login'
          element={!data.authUser ? <LoginPage /> : <Navigate to='/' />}
        />
        <Route
          path='/signup'
          element={!data.authUser ? <SignUpPage /> : <Navigate to='/' />}
        />
        <Route
          path='/transaction/:id'
          element={
            data.authUser ? <TransactionPage /> : <Navigate to='/login' />
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
export default App;
