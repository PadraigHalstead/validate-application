import { db, auth } from '../config/firebase';
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { StudentUserValidationPanel } from '../components/StudentUserValidationPanel';
import { AdminUserValidationPanel } from '../components/AdminUserValidationPanel';

export const RoleBasedRender = () => {
  const [student, setStudent] = useState(true);

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = () => {
    const fetchRolePermissions = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDataRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDataRef);
        const currentUserData = userSnapshot.data();
        const role = currentUserData.role;
        if (role !== 'student') {
          setStudent(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchRolePermissions();
  };

  return (
    <>
      {student ? <StudentUserValidationPanel /> : <AdminUserValidationPanel />}
    </>
  );
};
