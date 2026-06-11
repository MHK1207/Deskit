'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/lib/CartContext';
import { colors, spacing } from '@/app/theme';

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, subtotal, shipping, total } = useCart();

  const styles = {
    cartIcon: {
      position: 'fixed',
      bottom: spacing[8],
      right: spacing[8],
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: colors.accent,
      color: colors.primary,
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.5rem',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(255, 179, 71, 0.3)',
      zIndex: 99,
      transition: 'transform 0.2s',
    },
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#ef4444',
      color: colors.secondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: 700,
    },
    sidebar: {
      position: 'fixed',
      right: 0,
      top: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: colors.primary,
      borderLeft: `1px solid ${colors.gray[700]}`,
      boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.5)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
    },
    header: {
      padding: spacing[6],
      borderBottom: `1px solid ${colors.gray[700]}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: colors.secondary,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: colors.secondary,
      fontSize: '1.5rem',
      cursor: 'pointer',
    },
    itemsList: {
      flex: 1,
      overflowY: 'auto',
      padding: spacing[4],
    },
    cartItem: {
      display: 'flex',
      gap: spacing[4],
      padding: spacing[4],
      backgroundColor: colors.dark,
      borderRadius: '8px',
      marginBottom: spacing[4],
      border: `1px solid ${colors.gray[700]}`,
    },
    itemImage: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '6px',
      flexShrink: 0,
    },
    itemDetails: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[2],
    },
    itemName: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.secondary,
    },
    itemPrice: {
      fontSize: '0.875rem',
      color: colors.accent,
      fontWeight: 600,
    },
    quantityControls: {
      display: 'flex',
      gap: spacing[1],
      alignItems: 'center',
    },
    quantityButton: {
      width: '24px',
      height: '24px',
      border: `1px solid ${colors.gray[600]}`,
      backgroundColor: colors.primary,
      color: colors.secondary,
      cursor: 'pointer',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 700,
    },
    quantity: {
      fontSize: '0.875rem',
      color: colors.secondary,
      minWidth: '20px',
      textAlign: 'center',
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: 600,
      padding: 0,
    },
    footer: {
      padding: spacing[6],
      borderTop: `1px solid ${colors.gray[700]}`,
      backgroundColor: colors.dark,
    },
    totals: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[3],
      marginBottom: spacing[4],
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
      color: colors.gray[300],
    },
    totalAmount: {
      color: colors.secondary,
      fontWeight: 600,
    },
    grandTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '1rem',
      fontWeight: 700,
      color: colors.secondary,
      paddingTop: spacing[3],
      borderTop: `1px solid ${colors.gray[700]}`,
    },
    checkoutButton: {
      width: '100%',
      padding: spacing[4],
      backgroundColor: colors.accent,
      color: colors.primary,
      border: 'none',
      borderRadius: '8px',
      fontWeight: 700,
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    },
    emptyCart: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: colors.gray[400],
      textAlign: 'center',
      padding: spacing[6],
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 98,
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
      transition: 'opacity 0.3s',
    },
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={styles.overlay}
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Icon Button */}
      <button
        style={styles.cartIcon}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      >
        🛒
        {cartItems.length > 0 && (
          <div style={styles.badge}>{cartItems.length}</div>
        )}
      </button>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Your Cart</h2>
          <button
            style={styles.closeButton}
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        {cartItems.length === 0 ? (
          <div style={styles.emptyCart}>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div style={styles.itemsList}>
            {cartItems.map(item => (
              <div key={item.id} style={styles.cartItem}>
                {item.images && item.images[0] && (
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    style={styles.itemImage}
                  />
                )}
                <div style={styles.itemDetails}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemPrice}>
                    PKR {item.price.toLocaleString()}
                  </div>
                  <div style={styles.quantityControls}>
                    <button
                      style={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <div style={styles.quantity}>{item.quantity}</div>
                    <button
                      style={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      style={styles.removeButton}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totals}>
              <div style={styles.totalRow}>
                <span>Subtotal:</span>
                <span style={styles.totalAmount}>
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div style={styles.totalRow}>
                <span>Shipping:</span>
                <span style={styles.totalAmount}>PKR {shipping}</span>
              </div>
            </div>

            <div style={styles.grandTotal}>
              <span>Total:</span>
              <span>PKR {total.toLocaleString()}</span>
            </div>

            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <button
                style={styles.checkoutButton}
                onClick={() => setIsOpen(false)}
              >
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

