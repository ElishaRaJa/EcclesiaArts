import { db } from '../Firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";

async function getArtworks(page = 1, artworksPerPage = 10) {
    try {
        const artworksCollectionRef = collection(db, "artworks");
        const q = query(artworksCollectionRef, orderBy("createdAt", "desc"), limit(artworksPerPage));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching artworks:", error);
        throw new Error("Could not fetch artworks. Please try again later.");
    }
}

async function addArtworkToFirestore(artworkData, role) {
    if (role !== "admin") {
        throw new Error("You do not have permission to add artworks.");
    }

    // Calculate packaging dimensions if not provided (5cm padding)
    const packaging_height = artworkData.packaging_height || artworkData.artwork_height + 5;
    const packaging_width = artworkData.packaging_width || artworkData.artwork_width + 5;
    const packaging_depth = artworkData.packaging_depth || (artworkData.artwork_depth || 0) + 5;

    try {
        const artworksCollectionRef = collection(db, "artworks");
        await addDoc(artworksCollectionRef, {
            ...artworkData,
            artwork_height: artworkData.artwork_height,
            artwork_width: artworkData.artwork_width,
            artwork_depth: artworkData.artwork_depth || 0,
            packaging_height,
            packaging_width,
            packaging_depth,
            total_weight: artworkData.total_weight || 1,
            is_framed: artworkData.is_framed || false,
            frame_type: artworkData.frame_type || '',
            createdAt: serverTimestamp(),
        });

        console.log("Artwork added successfully!");
    } catch (error) {
        console.error("Error adding artwork:", error);
        throw new Error("Could not add artwork. Please try again later.");
    }
}

async function deleteArtwork(artworkId, role) {
    if (role !== "admin") {
        throw new Error("You do not have permission to delete artworks.");
    }

    try {
        const artworkDocRef = doc(db, "artworks", artworkId);
        await deleteDoc(artworkDocRef);
        console.log("Artwork deleted successfully!");
    } catch (error) {
        console.error("Error deleting artwork:", error);
        throw new Error("Could not delete artwork. Please try again later.");
    }
}

async function updateArtworkInFirestore(artworkId, updatedData, userRole) {
    if (userRole !== "admin") {
        throw new Error("Permission denied: Only admins can update artworks.");
    }

    // Maintain packaging dimensions if not updated
    const currentArtwork = await getArtwork(artworkId);
    const packaging_height = updatedData.packaging_height || currentArtwork.packaging_height;
    const packaging_width = updatedData.packaging_width || currentArtwork.packaging_width;
    const packaging_depth = updatedData.packaging_depth || currentArtwork.packaging_depth;

    try {
        const artworkRef = doc(db, "artworks", artworkId);
        await updateDoc(artworkRef, {
            ...updatedData,
            packaging_height,
            packaging_width,
            packaging_depth
        });
        console.log("Artwork updated successfully!");
    } catch (error) {
        console.error("Error updating artwork:", error);
        throw new Error("Could not update artwork. Please try again later.");
    }
}

async function getArtwork(artworkId) {
    try {
        const artworkRef = doc(db, "artworks", artworkId);
        const artworkSnap = await getDoc(artworkRef);
        if (artworkSnap.exists()) {
            return artworkSnap.data();
        } else {
            throw new Error("No such artwork!");
        }
    } catch (error) {
        console.error("Error getting artwork:", error);
        throw new Error("Could not retrieve artwork. Please try again later.");
    }
}

async function getAllArtworks() {
    try {
        const artworksCollectionRef = collection(db, "artworks");
        const snapshot = await getDocs(artworksCollectionRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting artworks:", error);
        throw new Error("Could not retrieve artworks. Please try again later.");
    }
}

async function updateArtworkStatus(artworkId, newStatus) {
    try {
        const artworkRef = doc(db, "artworks", artworkId);
        await updateDoc(artworkRef, { status: newStatus });
        return true;
    } catch (error) {
        console.error("Error updating artwork status:", error);
        throw new Error("Could not update artwork status");
    }
}

export {
    addArtworkToFirestore,
    updateArtworkInFirestore,
    deleteArtwork,
    getArtwork,
    getAllArtworks,
    getArtworks,
    updateArtworkStatus,
};
