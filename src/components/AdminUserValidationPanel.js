import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';

export const AdminUserValidationPanel = () => {
  const expoURL = 'exp://192.168.15.231:19000';
  const [canScan, setCanScan] = useState(false);

  useEffect(() => {
    checkCanScan();
  }, []);

  const checkCanScan = async () => {
    try {
      const uid = auth.currentUser.uid;
      const userDataRef = doc(db, 'users', uid);
      const userSnapshot = await getDoc(userDataRef);
      const role = userSnapshot.data().role;
      const userRoleRef = doc(db, 'roles', role);
      const userDocSnapshot = await getDoc(userRoleRef);
      const userData = userDocSnapshot.data();
      setCanScan(userData.permissions.canScanStudents);
    } catch (err) {
      console.log(err.message);
    }
  };

  const AdminRender = () => {
    if (canScan) {
      return (
        <>
          <QRCode value={expoURL} />
          <br />
          <h3>
            Scan the QR code above with Expo Go (Android) or the Camera app
            (iOS)
          </h3>
        </>
      );
    } else {
      return (
        <>
          <h3>You do not have permission to validate students.</h3>
        </>
      );
    }
  };
  return (
    <>
      <AdminRender />
    </>
  );
};
