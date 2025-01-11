import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import VerifyTokenPage from "./components/VerifyTokenPage";
import ResetPasswordPage from "./components/ResetPasswordPage";


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // LocalStorage'daki token'i kontrol et
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token); // Token varsa true, yoksa false
  }, []);


  return (
    <Router>
      <Routes>
        {/* Genel Sayfalar */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-token" element={<VerifyTokenPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Özel Sayfalar */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
