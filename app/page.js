'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/app/components/ProductCard';
import { getProducts } from '@/app/lib/firebase-utils';
import { colors, spacing, typography } from '@/app/theme';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products on mount
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
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Stock status filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(p => p.stockStatus === stockFilter);
    }

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      // Already sorted by createdAt from Firebase
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, priceRange, stockFilter, sortBy]);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.primary,
      color: colors.secondary,
    },
    header: {
      padding: `${spacing[12]} ${spacing[8]}`,
      textAlign: 'center',
      borderBottom: `1px solid ${colors.gray[700]}`,
    },
    title: {
      fontSize: '3rem',
      fontWeight: 700,
      marginBottom: spacing[2],
      letterSpacing: '0.05em',
    },
    subtitle: {
      fontSize: '1rem',
      color: colors.gray[400],
    },
    main: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: spacing[8],
    },
    controlsSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[6],
      marginBottom: spacing[12],
    },
    searchBar: {
      padding: spacing[4],
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[700]}`,
      borderRadius: '8px',
      color: colors.secondary,
      fontSize: '1rem',
      fontFamily: 'inherit',
      width: '100%',
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: spacing[4],
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[2],
    },
    filterLabel: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.secondary,
    },
    filterSelect: {
      padding: spacing[3],
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[600]}`,
      borderRadius: '6px',
      color: colors.secondary,
      fontFamily: 'inherit',
      fontSize: '0.875rem',
    },
    priceInputs: {
      display: 'flex',
      gap: spacing[2],
    },
    priceInput: {
      flex: 1,
      padding: spacing[2],
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[600]}`,
      borderRadius: '4px',
      color: colors.secondary,
      fontSize: '0.875rem',
    },
    resultsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[6],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.gray[700]}`,
    },
    resultCount: {
      fontSize: '0.875rem',
      color: colors.gray[400],
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: spacing[6],
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>DESKIT</h1>
        <p style={styles.subtitle}>Precision-engineered desk tools</p>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Search & Filters */}
        <div style={styles.controlsSection}>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchBar}
          />

          {/* Filters Grid */}
          <div style={styles.filtersGrid}>
            {/* Price Range */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Price Range (PKR)</label>
              <div style={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  style={styles.priceInput}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                  style={styles.priceInput}
                />
              </div>
            </div>

            {/* Stock Status Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Stock Status</label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Products</option>
                <option value="in-stock">In Stock</option>
                <option value="coming-soon">Coming Soon</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Sort By */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        {!loading && (
          <div style={styles.resultsHeader}>
            <p style={styles.resultCount}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Products Grid or Loading/Empty State */}
        {loading ? (
          <div style={styles.loadingState}>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div style={styles.productGrid}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
