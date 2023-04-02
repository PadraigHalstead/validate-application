import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebase';
import {
  doc,
  getDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export const AdminList = () => {
  const [currentUserId, setCurrentUserId] = useState('');
  const [canRemoveLecturer, setCanRemoveLecturer] = useState(false);
  const [canRemoveHeadDemonstrator, setCanRemoveHeadDemonstrator] =
    useState(false);
  const [canRemoveDemonstrator, setCanRemoveDemonstrator] = useState(false);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchRolePermissions();
    const uid = auth.currentUser.uid;
    setCurrentUserId(uid);
    const fetchAdminsList = async () => {
      const userCollectionRef = collection(db, 'users');
      try {
        const q = query(userCollectionRef, where('role', '!=', 'student'));
        const querySnapshot = await getDocs(q);
        const admins = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAdmins(admins);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAdminsList();
  }, [admins]);

  const handleRemoveAdmin = (id) => {
    const remove = async (id) => {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, { role: 'student' });
    };
    remove(id);
  };

  const fetchRolePermissions = () => {
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
        setCanRemoveDemonstrator(roleData.permissions.canRemoveDemonstrator);
        setCanRemoveHeadDemonstrator(
          roleData.permissions.canRemoveHeadDemonstrator
        );
        setCanRemoveLecturer(roleData.permissions.canRemoveLecturer);
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name:</th>
            <th>Email:</th>
            <th>Role:</th>
            <th>Options:</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>
                {(canRemoveDemonstrator && admin.role == 'demonstrator') ||
                (canRemoveHeadDemonstrator &&
                  admin.role == 'headDemonstrator') ||
                (canRemoveLecturer &&
                  admin.role == 'lecturer' &&
                  admin.id != currentUserId) ? (
                  <button onClick={() => handleRemoveAdmin(admin.id)}>
                    Remove -
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
