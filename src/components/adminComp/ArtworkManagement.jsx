import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArtworks, deleteArtwork } from "../../Firebase/firestore";
import { updateArtworkStatus } from "../../Artwork/Artwork";
import { Button } from "../ui/Button";
import { Table } from "../ui/Table";

const ArtworkManagement = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
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
      render: (artwork) => `$${artwork.price.toFixed(2)}`
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
        const artworksData = await getArtworks();
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
    <div className="artwork-management">
      <h2>Artwork Management</h2>
      <Table
        columns={columns}
        data={artworks}
        loading={loading}
        selectable={true}
        onSelectionChange={(selected) => console.log('Selected artworks:', selected)}
      />
    </div>
  );
};

export default ArtworkManagement;
