import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { db } from "../../Firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateEditArtworkPage = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [deliveryTimeEstimate, setDeliveryTimeEstimate] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [shippingPrice, setShippingPrice] = useState("");
  const [shippingRegions, setShippingRegions] = useState([]);
  const [restrictedCountries, setRestrictedCountries] = useState([]);
  const [reserved, setReserved] = useState(false);
  const [reservedBy, setReservedBy] = useState("");
  const [status, setStatus] = useState("available");
  const [uniqueId, setUniqueId] = useState("art-" + Date.now());
  
  const { id } = useParams();
  const navigate = useNavigate();
    // Load environment variables
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  useEffect(() => {
    if (id) {
      const fetchArtwork = async () => {
        const artworkDoc = await getDoc(doc(db, "artworks", id));
        if (artworkDoc.exists()) {
          const artworkData = artworkDoc.data();
          setTitle(artworkData.title);
          setPrice(artworkData.price);
          setCurrency(artworkData.currency || "USD");
          setImage(artworkData.images?.[0] || "");
          setDescription(artworkData.description);
          setCategories(artworkData.categories || []);
          setDeliveryTimeEstimate(artworkData.deliveryTimeEstimate || "");
          setHeight(artworkData.height || "");
          setWidth(artworkData.width || "");
          setShippingPrice(artworkData.shippingPrice || "");
          setShippingRegions(artworkData.shippingRegions || []);
          setRestrictedCountries(artworkData.restrictedCountries || []);
          setReserved(artworkData.reserved || false);
          setReservedBy(artworkData.reservedBy || "");
          setStatus(artworkData.status || "available");
          setUniqueId(artworkData.uniqueId || "art-" + Date.now());
        }
      };
      fetchArtwork();
    }
  }, [id]);
    // Upload Image to Cloudinary
    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
      try {
          const response = await axios.post(
              `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
              formData
          );
          setImage(response.data.secure_url);
      } catch (error) {
          console.error("Error uploading image: ", error);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const artworkData = {
      title,
      price,
      currency,
      images: image ? [image] : [],
      description,
      categories,
      deliveryTimeEstimate,
      height: parseFloat(height),
      width: parseFloat(width),
      shippingPrice: parseFloat(shippingPrice),
      shippingRegions,
      restrictedCountries,
      reserved,
      reservedBy,
      status,
      uniqueId,
    };

    try {
      await setDoc(doc(db, "artworks", id || uniqueId), artworkData);
      navigate("/artworks");
    } catch (error) {
      console.error("Error saving artwork: ", error);
    }
  };

  return (
    <Box p={4}>
      <h2>{id ? "Edit" : "Create"} Artwork</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Price"
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="ZAR">ZAR</MenuItem>
                {/* Add more currencies as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Height (cm)"
              fullWidth
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Width (cm)"
              fullWidth
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Shipping Price"
              fullWidth
              type="number"
              value={shippingPrice}
              onChange={(e) => setShippingPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Delivery Time Estimate"
              fullWidth
              value={deliveryTimeEstimate}
              onChange={(e) => setDeliveryTimeEstimate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Categories (comma separated)"
              fullWidth
              value={categories.join(", ")}
              onChange={(e) => setCategories(e.target.value.split(",").map(cat => cat.trim()))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Shipping Regions (comma separated)"
              fullWidth
              value={shippingRegions.join(", ")}
              onChange={(e) => setShippingRegions(e.target.value.split(",").map(region => region.trim()))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Restricted Countries (comma separated)"
              fullWidth
              value={restrictedCountries.join(", ")}
              onChange={(e) => setRestrictedCountries(e.target.value.split(",").map(country => country.trim()))}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                {/* Add more statuses as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Reserved</InputLabel>
              <Select
                value={reserved ? "true" : "false"}
                onChange={(e) => setReserved(e.target.value === "true")}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Reserved By"
              fullWidth
              value={reservedBy}
              onChange={(e) => setReservedBy(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Preview" width="100" />}
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Artwork
        </Button>
      </form>
    </Box>
  );
};

export default CreateEditArtworkPage;