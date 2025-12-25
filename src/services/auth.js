import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* SIGNUP */
export const signup = async (email, password, userType, companyName) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  
  try {
    await axios.post(`${API_URL}/register`, {
      email: email,
      userType: userType,
      companyName: userType === 'company' ? companyName : ""
    });
  } catch (error) {
    console.error("Failed to save user to database", error);
  }

  localStorage.setItem("email", userCredential.user.email);
  localStorage.setItem("userType", userType);
  
  if (userType === "company" && companyName) {
    localStorage.setItem("companyName", companyName);
  }
  
  return userCredential.user;
};

/* LOGIN */
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  let userType = "individual"; 
  
  try {
    const response = await axios.get(`${API_URL}/get-user-info`, { 
        params: { email: email } 
    });
    
    if (response.data) {
        if (response.data.userType) userType = response.data.userType;
        
        if (response.data.companyName) {
            localStorage.setItem("companyName", response.data.companyName);
        } else {
            localStorage.removeItem("companyName");
        }
    }
  } catch (error) {
    console.error("Could not fetch user details", error);
  }

  localStorage.setItem("email", email);
  localStorage.setItem("userType", userType);
  localStorage.setItem("token", user.accessToken);

  return { email, userType };
};

export const logout = async () => {
  await signOut(auth);
  localStorage.clear();
};