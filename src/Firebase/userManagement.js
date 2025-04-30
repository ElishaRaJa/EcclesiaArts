import { db } from "./firebaseConfig";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const ADMIN_UID = "wl2CE5mafdcUKaoEyNpWikw4h6w2";

export async function getAllUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    return usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.log(`User ${userId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Function to lock a user account (admin-only)
export async function lockUserAccount(userId, adminUid) {
  if (adminUid !== ADMIN_UID) {
    throw new Error("Only the admin can lock user accounts.");
  }
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { accountLocked: true });
    console.log(`User account ${userId} locked successfully.`);
  } catch (error) {
    console.error("Error locking user account:", error);
    throw error;
  }
}

// Function to unlock a user account (admin-only)
export async function unlockUserAccount(userId, adminUid) {
  if (adminUid !== ADMIN_UID) {
    throw new Error("Only the admin can unlock user accounts.");
  }
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { accountLocked: false });
    console.log(`User account ${userId} unlocked successfully.`);
  } catch (error) {
    console.error("Error unlocking user account:", error);
    throw error;
  }
}

// Function to promote a user to admin (admin-only)
export async function promoteUserToAdmin(userId, adminUid) {
  if (adminUid !== ADMIN_UID) {
    throw new Error("Only the admin can promote users.");
  }
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: "admin" });
    console.log(`User ${userId} promoted to admin successfully.`);
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    throw error;
  }
}

export async function editUserDetails(userId, userData) {
  try {
    const userRef = doc(db, "users", userId);
    const updateData = {};

    // Handle shipping fields
    if (userData.shipping_street !== undefined) updateData.shipping_street = userData.shipping_street;
    if (userData.shipping_city !== undefined) updateData.shipping_city = userData.shipping_city;
    if (userData.shipping_state !== undefined) updateData.shipping_state = userData.shipping_state;
    if (userData.shipping_zip !== undefined) updateData.shipping_zip = userData.shipping_zip;
    if (userData.shipping_country !== undefined) updateData.shipping_country = userData.shipping_country;

    // Handle billing
    if (userData.same_billing_shipping) {
      // Copy shipping into billing
      if (userData.shipping_street !== undefined) updateData.billing_street = userData.shipping_street;
      if (userData.shipping_city !== undefined) updateData.billing_city = userData.shipping_city;
      if (userData.shipping_state !== undefined) updateData.billing_state = userData.shipping_state;
      if (userData.shipping_zip !== undefined) updateData.billing_zip = userData.shipping_zip;
      if (userData.shipping_country !== undefined) updateData.billing_country = userData.shipping_country;
    } else {
      // Use provided billing data
      if (userData.billing_street !== undefined) updateData.billing_street = userData.billing_street;
      if (userData.billing_city !== undefined) updateData.billing_city = userData.billing_city;
      if (userData.billing_state !== undefined) updateData.billing_state = userData.billing_state;
      if (userData.billing_zip !== undefined) updateData.billing_zip = userData.billing_zip;
      if (userData.billing_country !== undefined) updateData.billing_country = userData.billing_country;
    }

    // Other fields
    if (userData.same_billing_shipping !== undefined) updateData.same_billing_shipping = userData.same_billing_shipping;
    if (userData.phone_number !== undefined) updateData.phone_number = userData.phone_number;
    if (userData.username !== undefined) updateData.username = userData.username;
    if (userData.first_name !== undefined) updateData.first_name = userData.first_name;
    if (userData.last_name !== undefined) updateData.last_name = userData.last_name;

    if (Object.keys(updateData).length > 0) {
      await updateDoc(userRef, updateData);
      console.log("User profile updated successfully!");
    } else {
      console.log("No changes to update.");
    }

  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}