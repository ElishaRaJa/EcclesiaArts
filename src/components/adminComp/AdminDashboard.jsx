import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { auth } from "../../Firebase/firebaseConfig";
import { signOut } from "../../Firebase/auth";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../ui/Toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          users: 42,
          artworks: 127,
          recentActivity: [
            { id: 1, action: "New artwork added", time: "2 hours ago" },
            { id: 2, action: "User registered", time: "5 hours ago" }
          ]
        });
      } catch (error) {
        setMessage({ text: "Failed to load dashboard data", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showToast("Signed out successfully", { severity: "success" });
    } catch (error) {
      showToast(error);
    }
  };

  return (
    <div className="admin-dashboard">
      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {loading ? (
        <div className="loading"></div>
      ) : (
        <div className="dashboard-grid">
          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stat-value">{stats?.users || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Artworks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stat-value">{stats?.artworks || 0}</div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="quick-actions">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="actions-grid">
                <Button 
                  variant="secondary"
                  size="md"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
                <Link to="/users">
                  <Button 
                    variant="primary"
                    size="md"
                  >
                    Manage Users
                  </Button>
                </Link>
                <Button 
                  variant="primary"
                  size="md"
                  onClick={() => navigate("/admin/artworks")}
                >
                  Manage Artworks
                </Button>
                <Button 
                  variant="primary"
                  size="md"
                  onClick={() => navigate("/admin/orders")}
                >
                  Manage Orders
                </Button>
                <Button 
                  variant="primary"
                  size="md"
                  onClick={() => navigate("/admin/artist-profile")}
                >
                  Manage Artist Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="activity-list">
                {stats?.recentActivity?.map(item => (
                  <li key={item.id} className="activity-item">
                    <span>{item.action}</span>
                    <small>{item.time}</small>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
