"use client"
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {firebaseApp} from '../firebase/config_firebase'
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState<string | null>(null);

  const auth = getAuth(firebaseApp); // Initialize auth inside the component

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, handle user data or navigate to the next page
      setLoginStatus('Login successful');
    } catch (error) {
      // Handle login errors
      console.error(error);
      setLoginStatus('Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Handle the user data after Google Sign-In
      // For example, you can save user info to the database, etc.

      // Login successful, handle user data or navigate to the next page
      setLoginStatus('Login successful with Google');
    } catch (error) {
      // Handle errors
      console.error(error);
      setLoginStatus('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4">Login</h2>
              {loginStatus && (
                <div className={`alert ${loginStatus.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
                  {loginStatus}
                </div>
              )}
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" onClick={handleLogin}>
                Login
              </button>
              <button className="btn btn-primary mt-3" onClick={handleGoogleLogin}>
                Login with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
