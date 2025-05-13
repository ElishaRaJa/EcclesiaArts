import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminLayout.css';
import {
  getAllUsers,
  deleteUser,
  lockUserAccount,
  unlockUserAccount,
  promoteUserToAdmin,
  editUserDetails,
} from "../../Firebase/userManagement";
import { auth } from "../../Firebase/firebaseConfig";
import { Button } from "../ui/Button";
import { Table } from "../ui/Table";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminUid = auth.currentUser?.uid;

  const columns = [
    { 
      key: 'id', 
      label: 'ID',
      sortable: true,
      filterable: true
    },
    { 
      key: 'email', 
      label: 'Email',
      sortable: true,
      filterable: true
    },
    { 
      key: 'role', 
      label: 'Role',
      sortable: true,
      filterable: true
    },
    { 
      key: 'accountLocked', 
      label: 'Status',
      render: (user) => user.accountLocked ? 'Locked' : 'Unlocked',
      sortable: true
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="action-buttons">
          <Button 
            variant="danger"
            size="sm"
            onClick={() => handleDelete(user.id)}
          >
            Delete
          </Button>
          {user.accountLocked ? (
            <Button 
              variant="success"
              size="sm"
              onClick={() => handleUnlock(user.id)}
            >
              Unlock
            </Button>
          ) : (
            <Button 
              variant="warning"
              size="sm"
              onClick={() => handleLock(user.id)}
            >
              Lock
            </Button>
          )}
          {user.role !== 'admin' && (
            <Button 
              variant="primary"
              size="sm"
              onClick={() => handlePromote(user.id)}
            >
              Promote
            </Button>
          )}
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(user.id, {role: "employee"})}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleLock = async (userId) => {
    try {
      await lockUserAccount(userId, adminUid);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, accountLocked: true } : user
        )
      );
    } catch (error) {
      console.error("Error locking user:", error);
    }
  };

  const handleUnlock = async (userId) => {
    try {
      await unlockUserAccount(userId, adminUid);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, accountLocked: false } : user
        )
      );
    } catch (error) {
      console.error("Error unlocking user:", error);
    }
  };

  const handlePromote = async (userId) => {
    try {
      await promoteUserToAdmin(userId, adminUid);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: "admin" } : user
        )
      );
    } catch (error) {
      console.error("Error promoting user:", error);
    }
  };

  const handleEdit = async(userId, userData)=>{
    try{
        await editUserDetails(userId, userData);
        setUsers((prevUsers) => prevUsers.map((user)=> user.id === userId ? {...user, ...userData} : user))
    }catch(error){
        console.error("Error editing user details", error);
    }
  }

  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <button className="admin-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <div className="admin-header">
        <h2 className="admin-title">User Management</h2>
      </div>
      <div className="admin-search-container">
        <input 
          type="text" 
          placeholder="Search users..." 
          className="admin-search"
        />
      </div>
      <div className="admin-table-container">
        <Table
          columns={columns}
          data={users}
          loading={loading}
          selectable={true}
          onSelectionChange={(selected) => console.log('Selected:', selected)}
        />
      </div>
    </div>
  );
};

export default UserManagement;
