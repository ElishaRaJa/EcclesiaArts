import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteArtwork } from "../../Firebase/firestore";
import './AdminLayout.css';
import { getAllArtworks, updateArtworkStatus } from "../../Artwork/Artwork";
import { Button } from "../ui/Button";
import { Table } from "../ui/Table";
import './ArtworkManagement.css';

const ArtworkManagement = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      render: (artwork) => (
        <div className="artwork-thumbnail">
          <img 
            src={artwork.images?.[0] || "https://via.placeholder.com/80x60"} 
            alt={artwork.title || 'Artwork'}
            style={{
              maxWidth: '80px',
              maxHeight: '60px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/80x60";
            }}
          />
        </div>
      )
    },
    { 
      key: 'id', 
      label: 'ID',
      sortable: true,
      filterable: true
    },
    { 
      key: 'title', 
      label: 'Title',
      sortable: true,
      filterable: true
    },
    { 
      key: 'artist', 
      label: 'Artist',
      sortable: true,
      filterable: true
    },
    { 
      key: 'price', 
      label: 'Price',
      sortable: true,
      render: (artwork) => {
      const price = Number(artwork.price);
      return isNaN(price) ? '-' : `$${price.toFixed(2)}`;
    }
    },
    {
      key: 'dimensions',
      label: 'Dimensions (cm)',
      sortable: false,
      render: (artwork) => `${artwork.artwork_height || '-'} × ${artwork.artwork_width || '-'} × ${artwork.artwork_depth || '-'}`
    },
    {
      key: 'total_weight',
      label: 'Weight (kg)',
      sortable: true,
      render: (artwork) => {
      const weight = Number(artwork.total_weight);
      return isNaN(weight) ? '-' : weight.toFixed(1);
    }
    },
    {
      key: 'is_framed',
      label: 'Framed',
      sortable: true,
      filterable: true,
      render: (artwork) => artwork.is_framed ? 'Yes' : 'No'
    },
    { 
      key: 'status', 
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (artwork) => (
        <select
          value={artwork.status}
          onChange={(e) => handleStatusChange(artwork.id, e.target.value)}
          className="status-select"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="sold">Sold</option>
          <option value="archived">Archived</option>
        </select>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (artwork) => (
        <div className="action-buttons">
          <Button 
            variant="danger"
            size="sm"
            onClick={() => handleDelete(artwork.id)}
          >
            Delete
          </Button>
          <Button 
            variant="primary"
            size="sm"
            onClick={() => navigate(`/admin/artcrud/edit-artwork/${artwork.id}`)}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const artworksData = await getAllArtworks();
        setArtworks(artworksData);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleDelete = async (artworkId) => {
    try {
      await deleteArtwork(artworkId);
      setArtworks(prev => prev.filter(a => a.id !== artworkId));
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  };

  const handleStatusChange = async (artworkId, newStatus) => {
    try {
      await updateArtworkStatus(artworkId, newStatus);
      setArtworks(prev =>
        prev.map(a => 
          a.id === artworkId ? { ...a, status: newStatus } : a
        )
      );
    } catch (error) {
      console.error("Error updating artwork status:", error);
    }
  };

  return (
    <div className="admin-container">
      <button className="admin-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <div className="admin-header">
        <h2 className="admin-title">Artwork Management</h2>
      </div>
      <div className="admin-table-container">
        <Table
          columns={columns}
          data={artworks}
          loading={loading}
          selectable={true}
          onSelectionChange={(selected) => console.log('Selected artworks:', selected)}
        />
      </div>
    </div>
  );
};

export default ArtworkManagement;
