'use client';

import { useState, useEffect } from 'react';
import ProductForm from '@/app/components/ProductForm';
import { getProducts, deleteProduct } from '@/app/lib/firebase-utils';
import { colors, spacing } from '@/app/theme';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Fetch products on page load
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.primary,
      color: colors.secondary,
      padding: spacing[8],
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      marginBottom: spacing[12],
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 700,
      marginBottom: spacing[2],
      color: colors.secondary,
    },
    subtitle: {
      fontSize: '1rem',
      color: colors.gray[400],
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: spacing[8],
      marginTop: spacing[8],
    },
    formSection: {
      backgroundColor: colors.dark,
      borderRadius: '8px',
      padding: spacing[6],
      border: `1px solid ${colors.gray[700]}`,
    },
    productsSection: {
      backgroundColor: colors.dark,
      borderRadius: '8px',
      padding: spacing[6],
      border: `1px solid ${colors.gray[700]}`,
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: spacing[6],
      color: colors.secondary,
    },
    productList: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
    },
    productCard: {
      display: 'flex',
      gap: spacing[4],
      padding: spacing[4],
      backgroundColor: colors.primary,
      borderRadius: '6px',
      border: `1px solid ${colors.gray[600]}`,
      alignItems: 'flex-start',
    },
    productImage: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '4px',
      flexShrink: 0,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: '1rem',
      fontWeight: 600,
      marginBottom: spacing[1],
      color: colors.secondary,
    },
    productPrice: {
      fontSize: '0.875rem',
      color: colors.accent,
      marginBottom: spacing[2],
      fontWeight: 600,
    },
    productStatus: {
      fontSize: '0.75rem',
      padding: `${spacing[1]} ${spacing[2]}`,
      borderRadius: '3px',
      display: 'inline-block',
      marginBottom: spacing[2],
    },
    deleteBtn: {
      padding: `${spacing[2]} ${spacing[3]}`,
      backgroundColor: '#dc2626',
      color: colors.secondary,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 600,
      transition: 'opacity 0.3s',
    },
    emptyState: {
      textAlign: 'center',
      padding: spacing[8],
      color: colors.gray[400],
    },
    loadingText: {
      color: colors.gray[400],
      fontSize: '0.875rem',
    },
    responsiveGrid: {
      '@media (max-width: 1024px)': {
        gridTemplateColumns: '1fr',
      },
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
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>DESKIT Admin</h1>
          <p style={styles.subtitle}>Manage your products</p>
        </div>

        {/* Main Grid */}
        <div style={styles.grid}>
          {/* Form Section */}
          <div style={styles.formSection}>
            <ProductForm onProductAdded={loadProducts} />
          </div>

          {/* Products List Section */}
          <div style={styles.productsSection}>
            <h2 style={styles.sectionTitle}>Products</h2>

            {loading ? (
              <p style={styles.loadingText}>Loading products...</p>
            ) : products.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No products yet. Add your first one!</p>
              </div>
            ) : (
              <div style={styles.productList}>
                {products.map(product => (
                  <div key={product.id} style={styles.productCard}>
                    {/* Product Image */}
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        style={styles.productImage}
                      />
                    )}

                    {/* Product Details */}
                    <div style={styles.productInfo}>
                      <div style={styles.productName}>{product.name}</div>
                      <div style={styles.productPrice}>PKR {product.price.toLocaleString()}</div>
                      <div
                        style={{
                          ...styles.productStatus,
                          backgroundColor: getStatusColor(product.stockStatus),
                          color: colors.primary,
                        }}
                      >
                        {product.stockStatus}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      style={{
                        ...styles.deleteBtn,
                        opacity: deleting === product.id ? 0.5 : 1,
                      }}
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                    >
                      {deleting === product.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

