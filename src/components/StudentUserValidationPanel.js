import React, {useState, useEffect} from "react"
import QRCode from "react-qr-code";
import { getAuth } from "firebase/auth";
import { db } from '../config/firebase';
import {doc, getDoc} from 'firebase/firestore'

export const StudentUserValidationPanel =  () => {
const [validated, setValidated] = useState(false);
const [userEmail, setUserEmail] = useState("");
const [userModule, setUserModule] = useState("");
const [userId, setUserId] = useState("");


useEffect(() => {
  getValidationStatus()
}, [validated])


const StudentDetailsComponent = () => {
  const fetchUserDetails = async () => {
    try {
      const auth = getAuth()
      setUserId(auth.currentUser.uid)
      const userDataRef = doc(db, "users", auth.currentUser.uid)
      const userSnapshot = await getDoc(userDataRef)
      const currentUserData = userSnapshot.data()
      setUserEmail(currentUserData.email)
      setUserModule(currentUserData.module)
    } catch (err) {
      console.log(err.message)
    }
  }
  fetchUserDetails()
  
  return (
    <>
    <h4>Email: {userEmail}</h4>
    <h4>Course: {userModule}</h4>
    </>
  )
  
}

const getValidationStatus = async () => {
  try {
  const auth = getAuth()
  const userDataRef = doc(db, "users", auth.currentUser.uid)
  const userSnapshot = await getDoc(userDataRef)
  const currentUserData = userSnapshot.data()
  setValidated(currentUserData.validated)
  } catch (err) {
  console.log(err.message)
  }
}

return (
  <>
  {!validated ? (
    <>
    <div>
      <h3>Please ask a demonstrator to sign you into the lab</h3>
      <QRCode value={userId}/>
    </div>
    <div>
      <StudentDetailsComponent/>
      <button onClick={getValidationStatus}>Check</button>
    </div>
    </>
    ) : (
      <>
      <h3>Your attendance has been taken</h3>
      </>          
    )}
  </> 
)
}


  

