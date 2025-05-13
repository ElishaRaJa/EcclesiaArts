import { db } from '../Firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { query, orderBy, limit, where } from "firebase/firestore";
import BobGoService from './bobgoService';

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

async function createOrder(orderData, artistId) {
    try {
        // Get artist pickup details
        const artistRef = doc(db, "users", artistId);
        const artistSnap = await getDoc(artistRef);
        if (!artistSnap.exists()) throw new Error("Artist not found");
        
        const artistData = artistSnap.data();
        const pickupAddress = artistData.bobgo_address;
        
        if (!pickupAddress) {
            throw new Error("Artist pickup location not configured");
        }

        // Log address details for validation
        console.log("Validating addresses for Bob Go API:");
        console.log("Customer Delivery Address:", {
            ...orderData.shippingAddress,
            validations: {
                phone: orderData.customer.phone?.startsWith('+27') ? 'Valid' : 'Invalid - must start with +27',
                province: PROVINCES.includes(orderData.shippingAddress.state) ? 'Valid' : `Invalid - must be one of: ${PROVINCES.join(', ')}`,
                country: orderData.shippingAddress.country === 'South Africa' ? 'Valid' : 'Invalid - must be South Africa'
            }
        });
        console.log("Artist Pickup Address:", {
            ...pickupAddress,
            validations: {
                phone: pickupAddress.phone?.startsWith('+27') ? 'Valid' : 'Invalid - must start with +27',
                province: PROVINCES.includes(pickupAddress.zone) ? 'Valid' : `Invalid - must be one of: ${PROVINCES.join(', ')}`,
                country: pickupAddress.country === 'ZA' ? 'Valid' : 'Invalid - must be ZA'
            }
        });

        // Prepare Bob Go order payload
        const bobGoOrder = {
            channel_order_number: `ECCLESIA-${Date.now()}`,
            customer_name: orderData.customer.firstName,
            customer_surname: orderData.customer.lastName,
            customer_email: orderData.customer.email,
            customer_phone: orderData.customer.phone,
            currency: 'ZAR',
            buyer_selected_shipping_cost: orderData.shippingCost,
            buyer_selected_shipping_method: orderData.shippingMethod,
            payment_status: orderData.paymentStatus || 'pending',
            delivery_address: {
                ...orderData.shippingAddress,
                country: 'South Africa' // Ensure country is set
            },
            pickup_address: pickupAddress,
            order_items: orderData.items.map(item => ({
                description: item.title,
                sku: item.id,
                unit_price: item.price,
                qty: item.quantity,
                unit_weight_kg: item.weight || 0.5 // Default weight
            }))
        };

        // Create order in Bob Go
        const bobGoResponse = await BobGoService.createOrder(bobGoOrder);
        
        // Store in Firebase with Bob Go reference
        const ordersCollectionRef = collection(db, "orders");
        const newOrderRef = await addDoc(ordersCollectionRef, {
            ...orderData,
            bobGoOrderId: bobGoResponse.id,
            status: "pending",
            artistId: artistId,
            createdAt: serverTimestamp(),
        });

        return {
            firebaseId: newOrderRef.id,
            bobGoId: bobGoResponse.id
        };
    } catch (error) {
        console.error("Error creating order:", error);
        throw error; // Re-throw to handle in calling component
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
        }
        throw new Error("Order not found");
    } catch (error) {
        console.error("Error getting order:", error);
        throw new Error("Could not retrieve order. Please try again later.");
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
        throw new Error("Could not retrieve orders. Please try again later.");
    }
}

async function getTrackingInfo(orderId) {
    try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        return orderSnap.exists() ? orderSnap.data().trackingInfo : null;
    } catch (error) {
        console.error("Error getting tracking info:", error);
        throw new Error("Could not retrieve tracking information.");
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
    } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Could not update order status.");
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

// Verify all exported functions exist
const availableFunctions = {
    getUserOrders,
    getTrackingInfo,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    getAllOrders,
    getOrders
};

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
