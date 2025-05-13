import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { db, } from "../../Firebase/firebaseConfig"; // Corrected import
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateEditArtworkPage = () => {
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState(""); // Added SKU
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [parcel_description, setParcelDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [deliveryTimeEstimate, setDeliveryTimeEstimate] = useState("");
  const [artwork_height, setArtworkHeight] = useState("");
  const [artwork_width, setArtworkWidth] = useState("");
  const [artwork_depth, setArtworkDepth] = useState("");
  const [packaging_height, setPackagingHeight] = useState("");
  const [packaging_width, setPackagingWidth] = useState("");
  const [packaging_depth, setPackagingDepth] = useState("");
  const [unit_weight_kg, setUnitWeightKg] = useState(""); // Renamed total_weight
  const [is_framed, setIsFramed] = useState(false);
  const [frame_type, setFrameType] = useState("");
  const [shippingPrice, setShippingPrice] = useState("");
  const [shippingRegions, setShippingRegions] = useState([]);
  const [restrictedCountries, setRestrictedCountries] = useState([]);
  const [reserved, setReserved] = useState(false);
  const [reservedBy, setReservedBy] = useState("");
  const [status, setStatus] = useState("available");
  const [artist_id, setArtistId] = useState(""); // Added artist_id
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
          setSku(artworkData.sku || ""); // Load SKU
          setPrice(artworkData.price);
          setCurrency(artworkData.currency || "USD");
          setImage(artworkData.images?.[0] || "");
          setDescription(artworkData.description);
          setParcelDescription(artworkData.parcel_description || "");
          setCategories(artworkData.categories || []);
          setDeliveryTimeEstimate(artworkData.deliveryTimeEstimate || "");
          setArtworkHeight(artworkData.artwork_height || "");
          setArtworkWidth(artworkData.artwork_width || "");
          setArtworkDepth(artworkData.artwork_depth || "");
          setPackagingHeight(artworkData.packaging_height || "");
          setPackagingWidth(artworkData.packaging_width || "");
          setPackagingDepth(artworkData.packaging_depth || "");
          setUnitWeightKg(artworkData.unit_weight_kg || ""); // Load as unit_weight_kg
          setIsFramed(artworkData.is_framed || false);
          setFrameType(artworkData.frame_type || "");
          setShippingPrice(artworkData.shippingPrice || "");
          setShippingRegions(artworkData.shippingRegions || []);
          setRestrictedCountries(artworkData.restrictedCountries || []);
          setReserved(artworkData.reserved || false);
          setReservedBy(artworkData.reservedBy || "");
          setStatus(artworkData.status || "available");
          setArtistId(artworkData.artist_id || ""); // Load artist_id
        }
      };
      fetchArtwork();
    } else {
        //set a default sku for new artworks
        setSku("art-" + Date.now());
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
      sku, // Include SKU
      price: parseFloat(price), // Ensure it's a number
      currency,
      images: image ? [image] : [],
      description,
      parcel_description,
      categories,
      deliveryTimeEstimate,
      artwork_height: parseFloat(artwork_height),
      artwork_width: parseFloat(artwork_width),
      artwork_depth: parseFloat(artwork_depth),
      packaging_height: parseFloat(packaging_height),
      packaging_width: parseFloat(packaging_width),
      packaging_depth: parseFloat(packaging_depth),
      unit_weight_kg: parseFloat(unit_weight_kg), // Use unit_weight_kg
      is_framed,
      frame_type,
      shippingPrice: parseFloat(shippingPrice),
      shippingRegions,
      restrictedCountries,
      reserved,
      reservedBy,
      status,
      artist_id, // Include artist_id
    };

    try {
      await setDoc(doc(db, "artworks", id || sku), artworkData); // Use sku as doc ID if creating
      // Check if we came from admin path
      const fromAdmin = window.location.pathname.includes('/admin');
      navigate(fromAdmin ? '/admin/artworks' : '/artworks');
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
          <Grid item xs={12}>
            <TextField
              label="SKU"
              fullWidth
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              disabled={!!id} // Disable editing SKU for existing artworks
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
              value={parcel_description}
              onChange={(e) => setParcelDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Artwork Height (cm)"
              fullWidth
              type="number"
              value={artwork_height}
              onChange={(e) => setArtworkHeight(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Artwork Width (cm)"
              fullWidth
              type="number"
              value={artwork_width}
              onChange={(e) => setArtworkWidth(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Artwork Depth (cm)"
              fullWidth
              type="number"
              value={artwork_depth}
              onChange={(e) => setArtworkDepth(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Packaging Height (cm)"
              fullWidth
              type="number"
              value={packaging_height}
              onChange={(e) => setPackagingHeight(e.target.value)}
              inputProps={{ min: 1, max: 200 }}
              required
              helperText="Required for shipping calculation"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Packaging Width (cm)"
              fullWidth
              type="number"
              value={packaging_width}
              onChange={(e) => setPackagingWidth(e.target.value)}
              inputProps={{ min: 1, max: 200 }}
              required
              helperText="Required for shipping calculation"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Packaging Depth (cm)"
              fullWidth
              type="number"
              value={packaging_depth}
              onChange={(e) => setPackagingDepth(e.target.value)}
              inputProps={{ min: 1, max: 200 }}
              required
              helperText="Required for shipping calculation"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Weight (kg)"
              fullWidth
              type="number"
              step="0.1"
              min="0.1"
              max="50"
              value={unit_weight_kg}
              onChange={(e) => setUnitWeightKg(e.target.value)}
              required
              helperText="Must be between 0.1-50kg for shipping"
              inputProps={{ 
                min: 0.1,
                max: 50
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Framed</InputLabel>
              <Select
                value={is_framed ? "true" : "false"}
                onChange={(e) => setIsFramed(e.target.value === "true")}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {is_framed && (
            <Grid item xs={12}>
              <TextField
                label="Frame Type"
                fullWidth
                value={frame_type}
                onChange={(e) => setFrameType(e.target.value)}
              />
            </Grid>
          )}
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
            <TextField
              label="Artist ID"  // Added Artist ID field
              fullWidth
              value={artist_id}
              onChange={(e) => setArtistId(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Parcel Description (For Shipping)"
              fullWidth
              multiline
              rows={2}
              value={parcel_description}
              onChange={(e) => setParcelDescription(e.target.value)}
              helperText="Description of artwork for shipping purposes"
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
