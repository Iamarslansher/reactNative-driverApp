import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5kFpt568u8g-djYFozGLmg1TcsuRXGf4",
  authDomain: "compelete-ubercream.firebaseapp.com",
  projectId: "compelete-ubercream",
  storageBucket: "compelete-ubercream.appspot.com",
  messagingSenderId: "783330166176",
  appId: "1:783330166176:web:e9f3dfdf015fd3113290c5",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// DRIVER SIGN-UP
async function driverSignup(userInfo, navigator) {
  try {
    const { name, email, password, userType } = userInfo;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    delete userInfo.password;
    userInfo.uid = user.uid;
    await setDoc(doc(db, "users/" + user.uid), userInfo);
    navigator && navigator("Dashboard");
  } catch (error) {
    alert(error);
  }
}

// DRIVER-LOGIN
async function driverLogin(userInfo, navigator) {
  try {
    const { email, password } = userInfo;
    await signInWithEmailAndPassword(auth, email, password);
    navigator && navigator("Dashboard");
  } catch (e) {
    alert(e.message);
  }
}

// DRIVER LOCATION
async function saveDriverLocation(driverLocation) {
  try {
    const { latitude, longitude, status } = driverLocation;
    console.log(driverLocation, "driverLocation-inFB");
    await setDoc(doc(db, "location/" + "driver-location"), driverLocation);

    // await addDoc(collection(db, "DriversLocation"), {
    //   latitude,
    //   longitude,
    //   status,
    // });
  } catch (e) {
    alert(e.message);
  }
}

export {
  driverSignup,
  driverLogin,
  collection,
  db,
  query,
  onSnapshot,
  orderBy,
  saveDriverLocation,
};
