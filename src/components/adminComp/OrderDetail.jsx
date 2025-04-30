import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../Order/order";
import { Button } from "../ui/Button";
import "./OrderManagement.css";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, "admin");
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-detail">
      <h2>Order #{order.id}</h2>
      
      <div className="order-section">
        <h3>Status</h3>
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="order-section">
        <h3>Customer Information</h3>
        <p>Name: {order.customerName}</p>
        <p>Email: {order.customerEmail}</p>
        <p>Phone: {order.customerPhone}</p>
      </div>

      <div className="order-section">
        <h3>Shipping Information</h3>
        <p>Address: {order.shippingAddress?.street}</p>
        <p>City: {order.shippingAddress?.city}</p>
        <p>Postal Code: {order.shippingAddress?.postalCode}</p>
        <p>Country: {order.shippingAddress?.country}</p>
      </div>

      <div className="order-section">
        <h3>Order Items</h3>
        <table className="order-items">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price?.toFixed(2)}</td>
                <td>${(item.price * item.quantity)?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-total">
          <strong>Order Total: ${order.totalAmount?.toFixed(2)}</strong>
        </div>
      </div>

      <div className="order-section">
        <h3>Order Date</h3>
        <p>{new Date(order.createdAt?.seconds * 1000).toLocaleString()}</p>
      </div>

      <div className="action-buttons">
        <Button onClick={() => navigate(-1)}>Back to Orders</Button>
      </div>
    </div>
  );
};

export default OrderDetail;
