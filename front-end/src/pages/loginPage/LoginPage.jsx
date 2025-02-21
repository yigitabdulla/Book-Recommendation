import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import "./loginPage.scss";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../redux/slices/toastifySlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Dispatch loginUser and await its result
      await dispatch(loginUser({ email, password })).unwrap(); // Using unwrap to get the resolved/rejected value

      // On success
      navigate('/'); // Redirect to homepage
      dispatch(showToast({ message: 'Successfully logged in!', type: 'success' }));

    } catch (error) {
      // On failure, handle the error
      console.error('Login failed:', error);

      // Display a failure toast notification
      dispatch(showToast({
        message:'Login failed. Please try again.',
        type: 'error',
      }));
    }
  };


  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
    </div>
  );
};

export default LoginPage;
