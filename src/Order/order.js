import { db } from '../Firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { query, orderBy, limit, where } from "firebase/firestore";

async function getOrders(page = 1, ordersPerPage = 10) {
    try {
        const ordersCollectionRef = collection(db, "orders");
        const q = query(ordersCollectionRef, orderBy("createdAt", "desc"), limit(ordersPerPage));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Could not fetch orders. Please try again later.");
    }
}

async function createOrder(orderData) {
    try {
        const ordersCollectionRef = collection(db, "orders");
        const newOrderRef = await addDoc(ordersCollectionRef, {
            ...orderData,
            status: "pending",
            createdAt: serverTimestamp(),
        });
        return newOrderRef.id;
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Could not create order. Please try again later.");
    }
}

async function deleteOrder(orderId, role) {
    if (role !== "admin") {
        throw new Error("You do not have permission to delete orders.");
    }

    try {
        const orderDocRef = doc(db, "orders", orderId);
        await deleteDoc(orderDocRef);
        console.log("Order deleted successfully!");
    } catch (error) {
        console.error("Error deleting order:", error);
        throw new Error("Could not delete order. Please try again later.");
    }
}

async function updateOrderStatus(orderId, newStatus, role) {
    if (role !== "admin") {
        throw new Error("You do not have permission to update orders.");
    }

    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            status: newStatus,
            updatedAt: serverTimestamp()
        });
        console.log("Order status updated successfully!");
    } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Could not update order status. Please try again later.");
    }
}

async function getOrderById(orderId) {
    try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
            return {
                id: orderSnap.id,
                ...orderSnap.data()
            };
        } else {
            throw new Error("No such order!");
        }
    } catch (error) {
        console.error("Error getting order:", error);
        throw new Error("Could not retrieve order. Please try again later.");
    }
}

async function getAllOrders() {
    try {
        const ordersCollectionRef = collection(db, "orders");
        const snapshot = await getDocs(ordersCollectionRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting orders:", error);
        throw new Error("Could not retrieve orders. Please try again later.");
    }
}

async function getUserOrders(userId) {
    try {
        const ordersCollectionRef = collection(db, "orders");
        const q = query(ordersCollectionRef, where("customerId", "==", userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting user orders:", error);
        throw new Error("Could not retrieve your orders. Please try again later.");
    }
}

async function getTrackingInfo(orderId) {
    try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
            return orderSnap.data().trackingInfo || null;
        }
        return null;
    } catch (error) {
        console.error("Error getting tracking info:", error);
        throw new Error("Could not retrieve tracking information. Please try again later.");
    }
}

export {
    getUserOrders,
    getTrackingInfo,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    getAllOrders,
    getOrders
};
