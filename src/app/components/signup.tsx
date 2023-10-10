"use client"
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {firebaseApp} from '../firebase/config_firebase'
import 'bootstrap/dist/css/bootstrap.min.css';
import { getFirestore } from 'firebase/firestore';

const SignupComponent: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupStatus, setSignupStatus] = useState<string | null>(null);

  const auth = getAuth(firebaseApp); // Initialize auth inside the component
  const db = getFirestore(firebaseApp);

  const handleSignup = async () => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Get the user ID from the userCredential object
      const userId = userCredential.user?.uid;

      // Save user's name in Firestore database
      if (userId) {
        await db.collection('users').doc(userId).set({
          name: name,
          email: email,
        });
      }

      // Signup successful, handle user data or navigate to the next page
      setSignupStatus('Signup successful. You can now log in.');
    } catch (error) {
      // Handle signup errors
      console.error(error.message);
      setSignupStatus('Signup failed. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in your database
      // If not, save the user's information in the database

      // Signup successful, handle user data or navigate to the next page
      setSignupStatus('Signup successful. You can now log in with Google.');
    } catch (error) {
      // Handle errors
      console.error(error.message);
      setSignupStatus('Google Sign Up failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4">Sign Up</h2>
              {signupStatus && (
                <div className={`alert ${signupStatus.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
                  {signupStatus}
                </div>
              )}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
              <button className="btn btn-primary" onClick={handleSignup}>
                Sign Up
              </button>
              <button className="btn btn-primary mt-3" onClick={handleGoogleSignup}>
                Sign Up with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default SignupComponent;
