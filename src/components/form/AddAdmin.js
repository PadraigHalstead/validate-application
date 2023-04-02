import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase';
import {
  collection,
  updateDoc,
  doc,
  getDoc,
  query,
  onSnapshot,
  where,
} from 'firebase/firestore';

export const AddAdminForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const [canAddLecturer, setCanAddLecturer] = useState(false);
  const [canAddHeadDemonstrator, setCanAddHeadDemonstrator] = useState(false);
  const [canAddDemonstrator, setCanAddDemonstrator] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [newAdminId, setNewAdminId] = useState('');

  const [validEmail, setValidEmail] = useState(false);

  useEffect(() => {
    checkEnableSubmit();
    checkEmail();
  }, [adminName, adminEmail, adminRole]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const checkEnableSubmit = () => {
    if (adminName !== '' && validEmail && adminRole !== '') {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  };

  const checkEmail = async () => {
    const checkEmailExists = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('email', '==', adminEmail));

        onSnapshot(q, (snapshot) => {
          let user = [];
          snapshot.docs.forEach((doc) => {
            user.push({ ...doc.data(), id: doc.id });
            setNewAdminId(doc.id);
          });

          if (user.length > 0) {
            setValidEmail(true);
          } else {
            setValidEmail(false);
          }
        });
      } catch (err) {
        console.log(err.message);
        setValidEmail(false);
      }
    };
    checkEmailExists();
  };

  const handleAddAdmin = () => {
    const add = async () => {
      try {
        const userRef = doc(db, 'users', newAdminId);
        await updateDoc(userRef, { name: adminName }, { role: adminRole });
      } catch (err) {
        console.log(err);
      }
    };
    add();
  };

  const RoleList = () => {
    const fetchRolePermissions = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDoc = doc(db, 'users', uid);
        const snap = await getDoc(userDoc);
        const role = snap.data().role;
        const userDocRef = doc(db, 'roles', role);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        setCanAddDemonstrator(userData.permissions.canAddDemonstrator);
        setCanAddHeadDemonstrator(userData.permissions.canAddHeadDemonstrator);
        setCanAddLecturer(userData.permissions.canAddLecturer);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRolePermissions();
    let roles = [];

    if (canAddDemonstrator) {
      roles.push('demonstrator');
    }

    if (canAddHeadDemonstrator) {
      roles.push('headDemonstrator');
    }

    if (canAddLecturer) {
      roles.push('lecturer');
    }
    return (
      <>
        <select
          required
          value={adminRole}
          onChange={(e) => setAdminRole(e.target.value)}
        >
          {roles.map((role) => (
            <option value={role}>{role}</option>
          ))}
        </select>
      </>
    );
  };

  return (
    <>
      <button onClick={toggleForm}>{showForm ? 'Cancel' : 'Add +'}</button>
      {showForm && (
        <form>
          <br />
          <label> Name: </label>
          <input required onChange={(e) => setAdminName(e.target.value)} />

          <label> Email: </label>
          <input
            type="email"
            required
            onChange={(e) => setAdminEmail(e.target.value)}
          />

          <label> Role: </label>
          <RoleList />

          <button
            type="submit"
            disabled={submitDisabled}
            onClick={handleAddAdmin}
          >
            Submit
          </button>
        </form>
      )}
    </>
  );
};
