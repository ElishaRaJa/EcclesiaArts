import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "../../Order/order";
import { Button } from "../ui/Button";
import { Table } from "../ui/Table";
import "./OrderManagement.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { 
      key: 'id', 
      label: 'Order ID',
      sortable: true,
      filterable: true
    },
    { 
      key: 'customerName', 
      label: 'Customer',
      sortable: true,
      filterable: true
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
      filterable: true,
      render: (order) => (
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(order.id, e.target.value)}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => (
        <div className="action-buttons">
          <Button 
            variant="danger"
            size="sm"
            onClick={() => handleDelete(order.id)}
          >
            Delete
          </Button>
          <Button 
            variant="primary"
            size="sm"
            onClick={() => window.location.href = `/admin/orders/${order.id}`}
          >
            View
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId, "admin");
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, "admin");
      setOrders(prev =>
        prev.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="order-management">
      <h2>Order Management</h2>
      <Table
        columns={columns}
        data={orders}
        loading={loading}
        selectable={true}
        onSelectionChange={(selected) => console.log('Selected orders:', selected)}
      />
    </div>
  );
};

export default OrderList;
