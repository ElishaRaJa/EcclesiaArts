import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut , updateProfile } from "firebase/auth";
import {  db } from "./firebaseConfig.js";
import { doc, setDoc , serverTimestamp } from "firebase/firestore";

const auth = getAuth();
const ADMIN_UID = "wl2CE5mafdcUKaoEyNpWikw4h6w2";

export async function registerCustomer(email, password, username, firstName, lastName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      await setDoc(doc(db, "users", uid), {
        user_id: uid,
        username: username,
        email: email,
        first_name: firstName,
        last_name: lastName,
        shipping_street: '',
        shipping_city: '',
        shipping_state: '',
        shipping_zip: '',
        shipping_country: '',
        billing_street: '',
        billing_city: '',
        billing_state: '',
        billing_zip: '',
        billing_country: '',
        same_billing_shipping: true,
        phone_number: null,
        registration_date: serverTimestamp(),
        order_history: [],
        current_orders: [],
      });
  
      await updateProfile(userCredential.user, {
        displayName: username,
      });
  
      return userCredential.user;
    } catch (error) {
      console.error("Error registering customer:", error);
      throw error;
    }
  }

// Admin creates an employee account
export async function registerEmployee(email, password, adminUid) {
    if (adminUid !== ADMIN_UID) {
        throw new Error("Only the admin can create employee accounts.");
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        await setDoc(doc(db, "users", uid), { role: "employee" });
        return userCredential.user;
    } catch (error) {
        console.error("Error registering employee:", error);
        throw error;
    }
}

// Login user
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

// Logout user
export async function logoutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

// Export signOut
export { signOut };
