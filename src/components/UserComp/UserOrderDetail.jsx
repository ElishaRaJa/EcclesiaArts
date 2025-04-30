import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, getTrackingInfo } from "../../Order/order";
import { Button } from "../ui/Button";
import "./OrderManagement.css";
import { useAuth } from "../../Firebase/AuthContext";

const UserOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        
        // Verify order belongs to current user
        if (orderData.customerId !== currentUser?.uid) {
          throw new Error("You don't have permission to view this order");
        }

        setOrder(orderData);
        
        // Get tracking info if available
        const trackingData = await getTrackingInfo(orderId);
        setTracking(trackingData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, currentUser]);

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-detail">
      <h2>Order #{order.id}</h2>
      
      <div className="order-section">
        <h3>Status</h3>
        <div className="status-display">
          <span className={`status-${order.status}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      {tracking && (
        <div className="order-section">
          <h3>Tracking Information</h3>
          <p>Carrier: {tracking.carrier}</p>
          <p>Tracking Number: {tracking.trackingNumber}</p>
          <p>Status: {tracking.status}</p>
          {tracking.estimatedDelivery && (
            <p>Estimated Delivery: {new Date(tracking.estimatedDelivery).toLocaleDateString()}</p>
          )}
          {tracking.link && (
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => window.open(tracking.link, '_blank')}
            >
              Track Package
            </Button>
          )}
        </div>
      )}

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

      <div className="action-buttons">
        <Button onClick={() => navigate(-1)}>Back to My Orders</Button>
      </div>
    </div>
  );
};

export default UserOrderDetail;
