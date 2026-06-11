'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReviewForm from '@/app/components/ReviewForm';
import { getProductById, getProductReviews, addReview } from '@/app/lib/firebase-utils';
import { colors, spacing } from '@/app/theme';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product and reviews
  useEffect(() => {
    loadProductAndReviews();
  }, [productId]);

  const loadProductAndReviews = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(productId);
      setProduct(productData);

      if (productData) {
        const reviewsData = await getProductReviews(productId);
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    setSubmittingReview(true);
    try {
      await addReview(productId, reviewData);
      await loadProductAndReviews();
      alert('Review added successfully!');
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review');
    } finally {
      setSubmittingReview(false);
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
      maxWidth: '1200px',
      margin: '0 auto',
    },
    backButton: {
      marginBottom: spacing[8],
      padding: `${spacing[2]} ${spacing[4]}`,
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[700]}`,
      color: colors.secondary,
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    productSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: spacing[8],
      marginBottom: spacing[12],
    },
    imageContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
    },
    mainImage: {
      width: '100%',
      height: 'auto',
      aspectRatio: '1',
      objectFit: 'cover',
      borderRadius: '8px',
      backgroundColor: colors.dark,
    },
    thumbnails: {
      display: 'flex',
      gap: spacing[2],
    },
    thumbnail: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '6px',
      cursor: 'pointer',
      border: `2px solid transparent`,
      transition: 'border-color 0.2s',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
    },
    productName: {
      fontSize: '2rem',
      fontWeight: 700,
      color: colors.secondary,
    },
    price: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: colors.accent,
    },
    statusBadge: {
      display: 'inline-block',
      padding: `${spacing[2]} ${spacing[3]}`,
      borderRadius: '6px',
      fontSize: '0.875rem',
      fontWeight: 600,
      width: 'fit-content',
    },
    description: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.gray[300],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.gray[700]}`,
    },
    specsSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[2],
    },
    specsTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    specs: {
      fontSize: '0.875rem',
      color: colors.gray[400],
      lineHeight: 1.6,
    },
    addToCartButton: {
      padding: spacing[4],
      backgroundColor: colors.accent,
      color: colors.primary,
      border: 'none',
      borderRadius: '8px',
      fontWeight: 700,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
      marginTop: 'auto',
    },
    reviewsSection: {
      marginTop: spacing[12],
      borderTop: `1px solid ${colors.gray[700]}`,
      paddingTop: spacing[8],
    },
    reviewsTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: colors.secondary,
      marginBottom: spacing[8],
    },
    reviewsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
      marginTop: spacing[8],
    },
    reviewCard: {
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[700]}`,
      borderRadius: '8px',
      padding: spacing[4],
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: spacing[2],
    },
    reviewName: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.secondary,
    },
    reviewRating: {
      fontSize: '0.875rem',
      color: colors.accent,
    },
    reviewText: {
      fontSize: '0.875rem',
      color: colors.gray[300],
      lineHeight: 1.5,
      marginBottom: spacing[2],
    },
    reviewDate: {
      fontSize: '0.75rem',
      color: colors.gray[500],
    },
    emptyReviews: {
      textAlign: 'center',
      padding: spacing[8],
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <p>Product not found.</p>
          <button
            style={styles.backButton}
            onClick={() => window.history.back()}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.main}>
        {/* Back Button */}
        <button
          style={styles.backButton}
          onClick={() => window.history.back()}
        >
          ← Back to Products
        </button>

        {/* Product Section */}
        <div style={styles.productSection}>
          {/* Images */}
          <div style={styles.imageContainer}>
            {product.images && product.images.length > 0 && (
              <>
                <img
                  src={product.images[selectedImageIndex].url}
                  alt={product.name}
                  style={styles.mainImage}
                />
                {product.images.length > 1 && (
                  <div style={styles.thumbnails}>
                    {product.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`${product.name} ${idx + 1}`}
                        style={{
                          ...styles.thumbnail,
                          borderColor: selectedImageIndex === idx ? colors.accent : 'transparent',
                        }}
                        onClick={() => setSelectedImageIndex(idx)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Details */}
          <div style={styles.details}>
            <div>
              <h1 style={styles.productName}>{product.name}</h1>
              <div style={styles.price}>PKR {product.price.toLocaleString()}</div>
            </div>

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
              <div style={styles.description}>{product.description}</div>
            )}

            {/* Specs */}
            {product.specs && (
              <div style={styles.specsSection}>
                <div style={styles.specsTitle}>Specifications</div>
                <div style={styles.specs}>{product.specs}</div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              style={{
                ...styles.addToCartButton,
                opacity: product.stockStatus === 'out-of-stock' ? 0.5 : 1,
              }}
              disabled={product.stockStatus === 'out-of-stock'}
            >
              {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={styles.reviewsSection}>
          <h2 style={styles.reviewsTitle}>Customer Reviews</h2>

          {/* Review Form */}
          <ReviewForm onReviewSubmit={handleReviewSubmit} isSubmitting={submittingReview} />

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div style={styles.emptyReviews}>
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div style={styles.reviewsList}>
              {reviews.map(review => (
                <div key={review.id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div>
                      <div style={styles.reviewName}>{review.name}</div>
                      <div style={styles.reviewRating}>
                        {'⭐'.repeat(review.rating)} {review.rating}/5
                      </div>
                    </div>
                  </div>
                  <div style={styles.reviewText}>{review.text}</div>
                  <div style={styles.reviewDate}>
                    {review.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Recently'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
