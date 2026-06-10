'use client';

import { useState } from 'react';
import { addProduct } from '@/app/lib/firebase-utils';
import { colors, spacing } from '@/app/theme';

export default function ProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    specs: '',
    images: [],
    stockStatus: 'in-stock',
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const formDataObj = new FormData();
          formDataObj.append('file', file);
          formDataObj.append('upload_preset', 'deskit_products');

          const response = await fetch(
            'https://api.cloudinary.com/v1_1/da6abcoey/image/upload',
            {
              method: 'POST',
              body: formDataObj,
            }
          );

          const data = await response.json();
          return {
            url: data.secure_url,
            thumbnail: data.eager?.[0]?.secure_url || data.secure_url,
          };
        })
      );

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addProduct({
        ...formData,
        price: parseFloat(formData.price),
      });

      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        specs: '',
        images: [],
        stockStatus: 'in-stock',
      });

      alert('Product added successfully!');
      if (onProductAdded) onProductAdded();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: spacing[8],
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[6],
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
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[600]}`,
      color: colors.secondary,
      borderRadius: '4px',
      fontFamily: 'inherit',
      fontSize: '1rem',
    },
    textarea: {
      padding: spacing[3],
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[600]}`,
      color: colors.secondary,
      borderRadius: '4px',
      fontFamily: 'inherit',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
    },
    select: {
      padding: spacing[3],
      backgroundColor: colors.dark,
      border: `1px solid ${colors.gray[600]}`,
      color: colors.secondary,
      borderRadius: '4px',
      fontFamily: 'inherit',
      fontSize: '1rem',
    },
    button: {
      padding: spacing[3],
      backgroundColor: colors.accent,
      color: colors.primary,
      border: 'none',
      borderRadius: '4px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'opacity 0.3s',
    },
    imagePreview: {
      display: 'flex',
      gap: spacing[4],
      flexWrap: 'wrap',
      marginTop: spacing[2],
    },
    imageItem: {
      position: 'relative',
      width: '100px',
      height: '100px',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '4px',
    },
    removeBtn: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: colors.accent,
      color: colors.primary,
      border: 'none',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: colors.secondary, marginBottom: spacing[6] }}>Add New Product</h2>
      
      <form style={styles.form} onSubmit={handleSubmit}>
        {/* Product Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Magnetic Cable Organizer"
            required
          />
        </div>

        {/* Price */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Price (PKR)</label>
          <input
            style={styles.input}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="e.g., 1500"
            step="0.01"
            required
          />
        </div>

        {/* Description */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product description..."
            required
          />
        </div>

        {/* Specs */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Specifications</label>
          <textarea
            style={styles.textarea}
            name="specs"
            value={formData.specs}
            onChange={handleInputChange}
            placeholder="Dimensions, materials, etc. (comma-separated)"
          />
        </div>

        {/* Images */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Images</label>
          <input
            style={styles.input}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading && <p style={{ color: colors.accent }}>Uploading...</p>}
          
          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div style={styles.imagePreview}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={styles.imageItem}>
                  <img src={img.url} alt={`Preview ${idx}`} style={styles.image} />
                  <button
                    style={styles.removeBtn}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== idx),
                      }));
                    }}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Stock Status</label>
          <select
            style={styles.select}
            name="stockStatus"
            value={formData.stockStatus}
            onChange={handleInputChange}
          >
            <option value="in-stock">In Stock</option>
            <option value="coming-soon">Coming Soon</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

