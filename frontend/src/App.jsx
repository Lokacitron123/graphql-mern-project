import { Route, Routes } from "react-router-dom";

// UI
import Header from "./components/ui/Header";

// Pages
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";

function App() {
  const authUser = true;
  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/transaction/:id' element={<TransactionPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;