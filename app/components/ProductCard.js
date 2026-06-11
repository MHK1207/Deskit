

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { colors, spacing } from '@/app/theme';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    card: {
      backgroundColor: colors.dark,
      borderRadius: '8px',
      overflow: 'hidden',
      border: `1px solid ${colors.gray[700]}`,
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 24px rgba(255, 179, 71, 0.2)`,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      paddingBottom: '100%',
      overflow: 'hidden',
      backgroundColor: colors.primary,
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'opacity 0.3s ease-in-out',
    },
    primaryImage: {
      opacity: isHovered ? 0 : 1,
    },
    secondaryImage: {
      opacity: isHovered ? 1 : 0,
    },
    content: {
      padding: spacing[4],
    },
    name: {
      fontSize: '1rem',
      fontWeight: 600,
      color: colors.secondary,
      marginBottom: spacing[2],
      lineHeight: 1.3,
    },
    price: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: colors.accent,
      marginBottom: spacing[2],
    },
    statusBadge: {
      display: 'inline-block',
      padding: `${spacing[1]} ${spacing[2]}`,
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 600,
      marginBottom: spacing[3],
    },
    button: {
      width: '100%',
      padding: spacing[3],
      backgroundColor: colors.accent,
      color: colors.primary,
      border: 'none',
      borderRadius: '4px',
      fontWeight: 600,
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    },
    buttonHover: {
      opacity: 0.8,
    },
    description: {
      fontSize: '0.875rem',
      color: colors.gray[400],
      marginBottom: spacing[3],
      lineHeight: 1.4,
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock':
        return '#10b981';
      case 'coming-soon':
        return '#f59e0b';
      case 'out-of-stock':
        return '#ef4444';
      default:
        return colors.gray[500];
    }
  };

return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          ...styles.card,
          ...(isHovered && styles.cardHover),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Rest of the component stays the same */}
        {/* Image Container */}
        <div style={styles.imageContainer}>
          {/* Primary Image */}
          {product.images && product.images[0] && (
            <img
              src={product.images[0].url}
              alt={product.name}
              style={{
                ...styles.image,
                ...styles.primaryImage,
              }}
            />
          )}

          {/* Secondary Image (detailed) */}
          {product.images && product.images[1] ? (
            <img
              src={product.images[1].url}
              alt={`${product.name} detailed`}
              style={{
                ...styles.image,
                ...styles.secondaryImage,
              }}
            />
          ) : product.images && product.images[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              style={{
                ...styles.image,
                ...styles.secondaryImage,
              }}
            />
          ) : null}
        </div>

        {/* Content */}
        <div style={styles.content}>
          <h3 style={styles.name}>{product.name}</h3>
          <div style={styles.price}>PKR {product.price.toLocaleString()}</div>

          {/* Status Badge */}
          <div
            style={{
              ...styles.statusBadge,
              backgroundColor: getStatusColor(product.stockStatus),
              color: colors.primary,
            }}
          >
            {product.stockStatus}
          </div>

          {/* Description */}
          {product.description && (
            <p style={styles.description}>{product.description.substring(0, 80)}...</p>
          )}

          {/* Add to Cart Button */}
          <button
            style={{
              ...styles.button,
              ...(isHovered && styles.buttonHover),
              opacity: product.stockStatus === 'out-of-stock' ? 0.5 : 1,
            }}
            disabled={product.stockStatus === 'out-of-stock'}
            onClick={(e) => e.preventDefault()}
          >
            {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}

