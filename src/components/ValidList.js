import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

export const ValidList = () => {
  const [students, setStudents] = useState([]);
  const [canRevokeAccess, setCanRevokeAccess] = useState(false);

  useEffect(() => {
    fetchPermissions();
    const fetchStudentsList = async () => {
      const userCollectionRef = collection(db, 'users');
      try {
        const q = query(userCollectionRef, where('validated', '==', true));
        const querySnapshot = await getDocs(q);
        const students = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setStudents(students);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStudentsList();
  }, [students]);

  const fetchPermissions = () => {
    const fetch = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDataRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDataRef);
        const currentUserData = userSnapshot.data();
        const role = currentUserData.role;
        const roleDocRef = doc(db, 'roles', role);
        const roleDocSnapshot = await getDoc(roleDocRef);
        const roleData = roleDocSnapshot.data();
        setCanRevokeAccess(roleData.permissions.canRevokeAccess);
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  };

  const handleRevoke = (id) => {
    const revoke = async (id) => {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, { validated: false });
    };
    revoke(id);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Email:</th>
            <th>Options:</th>
          </tr>
        </thead>
        <tbody>
          {students.map((students) => (
            <tr key={students.id}>
              <td>{students.email}</td>
              <td>
                {canRevokeAccess ? (
                  <button onClick={() => handleRevoke(students.id)}>
                    Revoke -
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
