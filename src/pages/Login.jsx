import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import "./login.scss";
import * as Config from "../constants/Config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
    const [remember, setRemember] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [savedGoogleAccounts, setSavedGoogleAccounts] = useState([]);
  const [newGoogleEmail, setNewGoogleEmail] = useState("");
  const [showAddGoogle, setShowAddGoogle] = useState(false);
  const history = useHistory();


  const loadSavedGoogleAccounts = () => {
    try {
      const saved = localStorage.getItem("googleAccounts");
      const accounts = saved ? JSON.parse(saved) : [];
      setSavedGoogleAccounts(accounts);
      return accounts;
    } catch (err) {
      console.error("Failed to load saved accounts", err);
      setSavedGoogleAccounts([]);
      return [];
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if ( !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    else if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    else if (password.length > 20) {
      setError("Password must be less than 20 characters long");
      return;
    }
    else if (/\s/.test(password)) {
      setError("Password cannot contain spaces");
      return;
    }
    else if (!/[A-Z]/.test(password)){
      return setError("Pasword must container at least one uppercase letter");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify({ email, password }));
    storage.setItem("isLoggedIn", "true");

    setError("");
    history.push(`/${Config.HOME_PAGE}`);
  };

  const handleSocialLogin = (provider, accountData) => {
    const storage = localStorage;
    const userData = {
      email: accountData.email || accountData.id,
      provider,
    };
    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("isLoggedIn", "true");
    setShowGoogleModal(false);
    history.push(`/${Config.HOME_PAGE}`);
  };

  const openGoogleModal = () => {
    loadSavedGoogleAccounts();
    setShowGoogleModal(true);
  };


  const closeModals = () => {
    setShowGoogleModal(false);
    setShowAddGoogle(false);
    setNewGoogleEmail("");
  };

  const handleAddGoogleAccount = () => {
    if (!newGoogleEmail.trim()) {
      alert("Please enter an email");
      return;
    }

    const newAccount = { email: newGoogleEmail, name: newGoogleEmail.split("@")[0] };
    const updated = [...savedGoogleAccounts, newAccount];
    setSavedGoogleAccounts(updated);
    localStorage.setItem("googleAccounts", JSON.stringify(updated));
    setNewGoogleEmail("");
    setShowAddGoogle(false);
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__card">
          <div className="login__aside">
            <h2 style={{ color: "#007bff" }}>Welcome Back!</h2>
            <p>Sign in and continue your journey with us.</p>
          </div>
          <div className="login__form-wrapper">
            <div className="login__header">
              <h1>Login</h1>
              <p>Sign in to access your account</p>
            </div>

            {error && <div className="login__error">{error}</div>}

            <form className="login__form" onSubmit={handleSubmit}>

              <div className="login__form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="login__form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="login__forgot">
                <Link to="/forgot">Forgot password?</Link>
              </div>

              <div className="login__social">
                <button
                  type="button"
                  className="login__social-btn google"
                  onClick={openGoogleModal}
                >
                  <i className="bx bxl-google"></i> Continue with Google
                </button>
              </div>

              <button type="submit" className="login__button">
                Sign In
              </button>
            </form>

            <div className="login__footer">
              <p>
                Don't have an account?{" "}
                <Link to={`/${Config.HOME_PAGE}`}>Go to Home</Link>
              </p>
            </div>
          </div>
        </div>
        {showGoogleModal && (
          <div className="login__modal-overlay" onClick={closeModals}>
            <div className="login__modal" onClick={(e) => e.stopPropagation()}>
              <div className="login__modal-header">
                <h3>
                  <i className="bx bxl-google"></i> Choose a Google Account
                </h3>
                <button className="login__modal-close" onClick={closeModals}>
                  ×
                </button>
              </div>
              <div className="login__modal-body">
                {savedGoogleAccounts.length > 0 ? (
                  savedGoogleAccounts.map((account, idx) => (
                    <button
                      key={idx}
                      className="login__account-option"
                      onClick={() => handleSocialLogin("Google", account)}
                    >
                      <i className="bx bx-user-circle"></i>
                      <div>
                        <p className="login__account-email">{account.email}</p>
                        <p className="login__account-name">{account.name}</p>
                        <p className="login__account-provider">Google</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="login__no-accounts">No saved accounts. Add one below.</p>
                )}

                {!showAddGoogle ? (
                  <button
                    className="login__add-account-btn"
                    onClick={() => setShowAddGoogle(true)}
                  >
                    <i className="bx bx-plus"></i> Add Another Account
                  </button>
                ) : (
                  <div className="login__add-google-form">
                    <input
                      type="email"
                      placeholder="Enter Google email"
                      value={newGoogleEmail}
                      onChange={(e) => setNewGoogleEmail(e.target.value)}
                      className="login__add-email-input"
                    />
                    <input
                      type="text"
                      placeholder="Name (optional)"
                        value={newGoogleEmail.split("@")[0]}
                        onChange={(e) => setNewGoogleEmail(e.target.value + "@example.com")}
                        className="login__add-name-input"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="login__add-password-input"
                    />
                    <button
                      className="login__add-confirm-btn"
                      onClick={handleAddGoogleAccount}
                    >
                      Continue
                    </button>
                    <button
                      className="login__add-cancel-btn"
                      onClick={() => {
                        setShowAddGoogle(false);
                        setNewGoogleEmail("");
                      }}
                    >
                      terminer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
