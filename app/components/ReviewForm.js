'use client';

import { useState } from 'react';
import { colors, spacing } from '@/app/theme';

export default function ReviewForm({ onReviewSubmit, isSubmitting }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !reviewText.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onReviewSubmit({
      name: name.trim(),
      rating: parseInt(rating),
      text: reviewText.trim(),
      createdAt: new Date(),
    });

    // Reset form
    setName('');
    setRating(5);
    setReviewText('');
  };

  const styles = {
    container: {
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[700]}`,
      borderRadius: '8px',
      padding: spacing[6],
      marginBottom: spacing[8],
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: colors.secondary,
      marginBottom: spacing[6],
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[2],
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.secondary,
    },
    input: {
      padding: spacing[3],
      backgroundColor: colors.primary,
      border: `1px solid ${colors.gray[600]}`,
      borderRadius: '6px',
      color: colors.secondary,
      fontFamily: 'inherit',
      fontSize: '0.875rem',
    },
    textarea: {
      padding: spacing[3],
      backgroundColor: colors.primary,
      border: `1px solid ${colors.gray[600]}`,
      borderRadius: '6px',
      color: colors.secondary,
      fontFamily: 'inherit',
      fontSize: '0.875rem',
      minHeight: '100px',
      resize: 'vertical',
    },
    select: {
      padding: spacing[3],
      backgroundColor: colors.primary,
      border: `1px solid ${colors.gray[600]}`,
      borderRadius: '6px',
      color: colors.secondary,
      fontFamily: 'inherit',
      fontSize: '0.875rem',
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
    ratingGroup: {
      display: 'flex',
      gap: spacing[2],
      alignItems: 'center',
    },
    ratingStars: {
      display: 'flex',
      gap: spacing[1],
    },
    star: {
      fontSize: '1.5rem',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Leave a Review</h3>
      
      <form style={styles.form} onSubmit={handleSubmit}>
        {/* Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Your Name</label>
          <input
            type="text"
            placeholder="Anonymous"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {/* Rating */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Rating</label>
          <div style={styles.ratingGroup}>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={styles.select}
            >
              <option value="1">⭐ 1 - Poor</option>
              <option value="2">⭐⭐ 2 - Fair</option>
              <option value="3">⭐⭐⭐ 3 - Good</option>
              <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
            </select>
          </div>
        </div>

        {/* Review Text */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Your Review</label>
          <textarea
            placeholder="Share your experience with this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={styles.textarea}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            ...styles.button,
            opacity: isSubmitting ? 0.6 : 1,
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

