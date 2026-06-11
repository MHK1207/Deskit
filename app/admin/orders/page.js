'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/app/lib/firebase-utils';
import { colors, spacing } from '@/app/theme';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

const handleStatusUpdate = async (orderId, newStatus) => {
  setUpdatingId(orderId);
  try {
    await updateOrderStatus(orderId, newStatus);
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // Add this line:
    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    
    alert(`Order status updated to ${newStatus}`);
  } catch (error) {
    console.error('Error updating order:', error);
    alert('Failed to update order');
  } finally {
    setUpdatingId(null);
  }
};
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.primary,
      color: colors.secondary,
      padding: spacing[8],
    },
    main: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      marginBottom: spacing[8],
    },
    title: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: spacing[2],
    },
    subtitle: {
      color: colors.gray[400],
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: spacing[4],
      marginBottom: spacing[8],
    },
    statCard: {
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[700]}`,
      borderRadius: '8px',
      padding: spacing[4],
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: 700,
      color: colors.accent,
      marginBottom: spacing[2],
    },
    statLabel: {
      fontSize: '0.875rem',
      color: colors.gray[400],
    },
    ordersGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: spacing[6],
    },
    ordersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
    },
    orderCard: {
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[700]}`,
      borderRadius: '8px',
      padding: spacing[4],
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    orderCardHover: {
      borderColor: colors.accent,
      boxShadow: `0 4px 12px rgba(255, 179, 71, 0.1)`,
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: spacing[3],
    },
    orderId: {
      fontSize: '0.875rem',
      color: colors.gray[400],
    },
    statusBadge: {
      display: 'inline-block',
      padding: `${spacing[1]} ${spacing[3]}`,
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 600,
    },
    customerName: {
      fontSize: '1rem',
      fontWeight: 600,
      marginBottom: spacing[2],
    },
    customerInfo: {
      fontSize: '0.875rem',
      color: colors.gray[400],
      marginBottom: spacing[1],
    },
    orderTotal: {
      fontSize: '1.125rem',
      fontWeight: 700,
      color: colors.accent,
      marginTop: spacing[3],
    },
    detailsPanel: {
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[700]}`,
      borderRadius: '8px',
      padding: spacing[6],
      height: 'fit-content',
      position: 'sticky',
      top: spacing[8],
    },
    detailsTitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      marginBottom: spacing[4],
    },
    detailRow: {
      marginBottom: spacing[4],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.gray[700]}`,
    },
    detailLabel: {
      fontSize: '0.875rem',
      color: colors.gray[400],
      marginBottom: spacing[1],
    },
    detailValue: {
      fontSize: '1rem',
      color: colors.secondary,
      fontWeight: 500,
    },
    itemsList: {
      marginBottom: spacing[4],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.gray[700]}`,
    },
    itemsTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.secondary,
      marginBottom: spacing[2],
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
      color: colors.gray[300],
      marginBottom: spacing[2],
    },
    actionButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[2],
    },
    button: {
      padding: spacing[3],
      backgroundColor: colors.accent,
      color: colors.primary,
      border: 'none',
      borderRadius: '6px',
      fontWeight: 600,
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    },
    buttonSecondary: {
      backgroundColor: colors.gray[700],
      color: colors.secondary,
    },
    emptyState: {
      textAlign: 'center',
      padding: spacing[12],
      color: colors.gray[400],
    },
    loadingState: {
      textAlign: 'center',
      padding: spacing[12],
      color: colors.gray[400],
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#10b981';
      case 'dispatched':
        return '#3b82f6';
      default:
        return colors.gray[500];
    }
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const dispatchedCount = orders.filter(o => o.status === 'dispatched').length;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Manage customer orders</p>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{pendingCount}</div>
            <div style={styles.statLabel}>Pending Payment</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{confirmedCount}</div>
            <div style={styles.statLabel}>Confirmed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{dispatchedCount}</div>
            <div style={styles.statLabel}>Dispatched</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{orders.length}</div>
            <div style={styles.statLabel}>Total Orders</div>
          </div>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No orders yet</p>
          </div>
        ) : (
          <div style={styles.ordersGrid}>
            {/* Orders List */}
            <div style={styles.ordersList}>
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    ...styles.orderCard,
                    ...(selectedOrder?.id === order.id && styles.orderCardHover),
                  }}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div style={styles.orderHeader}>
                    <div>
                      <div style={styles.orderId}>Order #{index + 1}</div>
                      <div style={styles.customerName}>{order.customerName}</div>
                    </div>
                    <div
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(order.status),
                        color: colors.primary,
                      }}
                    >
                      {order.status}
                    </div>
                  </div>
                  <div style={styles.customerInfo}>{order.customerPhone}</div>
                  <div style={styles.customerInfo}>{order.customerCity}</div>
                  <div style={styles.orderTotal}>PKR {order.total.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Details Panel */}
            {selectedOrder ? (
              <div style={styles.detailsPanel}>
                <h2 style={styles.detailsTitle}>Order Details</h2>

                {/* Customer Info */}
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Customer Name</div>
                  <div style={styles.detailValue}>{selectedOrder.customerName}</div>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Email</div>
                  <div style={styles.detailValue}>{selectedOrder.customerEmail}</div>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Phone</div>
                  <div style={styles.detailValue}>{selectedOrder.customerPhone}</div>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Address</div>
                  <div style={styles.detailValue}>
                    {selectedOrder.customerAddress}
                    {selectedOrder.customerCity && `, ${selectedOrder.customerCity}`}
                    {selectedOrder.customerPostalCode && ` ${selectedOrder.customerPostalCode}`}
                  </div>
                </div>

                {/* Items */}
                <div style={styles.itemsList}>
                  <div style={styles.itemsTitle}>Items Ordered</div>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={styles.item}>
                      <span>{item.name} x {item.quantity}</span>
                      <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Subtotal</div>
                  <div style={styles.detailValue}>PKR {selectedOrder.subtotal.toLocaleString()}</div>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Shipping</div>
                  <div style={styles.detailValue}>PKR {selectedOrder.shipping}</div>
                </div>

                <div style={{ marginBottom: spacing[6] }}>
                  <div style={styles.detailLabel}>Total</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.accent }}>
                    PKR {selectedOrder.total.toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div style={styles.actionButtons}>
                  {selectedOrder.status === 'pending' && (
                    <button
                      style={styles.button}
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                      disabled={updatingId === selectedOrder.id}
                    >
                      {updatingId === selectedOrder.id ? 'Updating...' : 'Confirm Payment'}
                    </button>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <button
                      style={styles.button}
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'dispatched')}
                      disabled={updatingId === selectedOrder.id}
                    >
                      {updatingId === selectedOrder.id ? 'Updating...' : 'Mark as Dispatched'}
                    </button>
                  )}
                  {selectedOrder.status === 'dispatched' && (
                    <div style={{ ...styles.button, backgroundColor: colors.gray[600], cursor: 'default' }}>
                      Order Dispatched ✓
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={styles.detailsPanel}>
                <p style={{ color: colors.gray[400] }}>Select an order to view details</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
