import React, { useEffect, useState } from "react";
import { useAuth } from "../../Firebase/AuthContext";
import { getUserOrders } from "../../Order/order";
import { Button } from "../ui/Button";
import { Table } from "../ui/Table";
import "./OrderManagement.css";

const UserOrderList = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { 
      key: 'id', 
      label: 'Order ID',
      sortable: true
    },
    { 
      key: 'createdAt', 
      label: 'Date',
      sortable: true,
      render: (order) => new Date(order.createdAt?.seconds * 1000).toLocaleDateString()
    },
    { 
      key: 'totalAmount', 
      label: 'Total',
      sortable: true,
      render: (order) => `$${order.totalAmount?.toFixed(2)}`
    },
    { 
      key: 'status', 
      label: 'Status',
      sortable: true,
      render: (order) => (
        <span className={`status-${order.status}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => (
        <div className="action-buttons">
          <Button 
            variant="primary"
            size="sm"
            onClick={() => window.location.href = `/my-orders/${order.id}`}
          >
            View
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser?.uid) {
        try {
          const ordersData = await getUserOrders(currentUser.uid);
          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching user orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [currentUser]);

  return (
    <div className="order-management">
      <h2>My Orders</h2>
      <Table
        columns={columns}
        data={orders}
        loading={loading}
        emptyMessage="You haven't placed any orders yet."
      />
    </div>
  );
};

export default UserOrderList;
