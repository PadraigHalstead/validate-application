import { auth } from '../config/firebase';
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { RoleBasedRender } from './RoleBasedRender';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSignedIn(true);
    } catch (err) {
      setErrorText(err.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setSignedIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {signedIn ? (
        <>
          <RoleBasedRender />
          <br />
          <button onClick={logOut}>Sign Out</button>
        </>
      ) : (
        <>
          <h4>Please login to continue:</h4>
          <div>
            <p>{errorText}</p>
            <label>Email:</label>
            <input onChange={(e) => setEmail(e.target.value)} />
            <label>Password:</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignIn}>Sign In</button>
          </div>
        </>
      )}
    </div>
  );
};
