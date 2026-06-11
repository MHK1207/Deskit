'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/lib/CartContext';
import { colors, spacing } from '@/app/theme';
import { createOrder } from '@/app/lib/firebase-utils';


export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, subtotal, shipping, total } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: colors.primary,
            color: colors.secondary,
            padding: spacing[8],
        },
        main: {
            maxWidth: '1000px',
            margin: '0 auto',
        },
        header: {
            marginBottom: spacing[12],
            textAlign: 'center',
        },
        title: {
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: spacing[2],
        },
        subtitle: {
            color: colors.gray[400],
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing[8],
        },
        formSection: {
            backgroundColor: colors.dark,
            border: `1px solid ${colors.gray[700]}`,
            borderRadius: '8px',
            padding: spacing[6],
        },
        formTitle: {
            fontSize: '1.25rem',
            fontWeight: 700,
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
        submitButton: {
            padding: spacing[4],
            backgroundColor: colors.accent,
            color: colors.primary,
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: spacing[4],
        },
        summarySection: {
            backgroundColor: colors.dark,
            border: `1px solid ${colors.gray[700]}`,
            borderRadius: '8px',
            padding: spacing[6],
            height: 'fit-content',
            position: 'sticky',
            top: spacing[8],
        },
        summaryTitle: {
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: spacing[6],
        },
        orderItems: {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4],
            marginBottom: spacing[6],
            paddingBottom: spacing[6],
            borderBottom: `1px solid ${colors.gray[700]}`,
        },
        orderItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            gap: spacing[2],
        },
        itemName: {
            flex: 1,
        },
        itemPrice: {
            color: colors.accent,
            fontWeight: 600,
            whiteSpace: 'nowrap',
        },
        totalsSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[3],
        },
        totalRow: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            color: colors.gray[300],
        },
        grandTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.25rem',
            fontWeight: 700,
            paddingTop: spacing[3],
            borderTop: `1px solid ${colors.gray[700]}`,
        },
        emptyCart: {
            textAlign: 'center',
            padding: spacing[12],
        },
        backButton: {
            marginTop: spacing[4],
            padding: `${spacing[3]} ${spacing[6]}`,
            backgroundColor: colors.accent,
            color: colors.primary,
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
        },
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create order in Firebase
            const orderId = await createOrder({
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                customerAddress: formData.address,
                customerCity: formData.city,
                customerPostalCode: formData.postalCode,
                items: cartItems,
                subtotal,
                shipping,
                total,
            });

            alert(`Order confirmed! Order ID: ${orderId}\nWe'll contact you at ${formData.phone}`);

            // Clear cart and redirect
            // Note: You'd need to add a clearCart function to CartContext
            router.push('/');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyCart}>
                    <h2>Your cart is empty</h2>
                    <button
                        style={styles.backButton}
                        onClick={() => router.push('/')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    

    return (
        <div style={styles.container}>
            <div style={styles.main}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>Checkout</h1>
                    <p style={styles.subtitle}>Complete your order</p>
                </div>

                {/* Main Grid */}
                <div style={styles.grid}>
                    {/* Form */}
                    <div style={styles.formSection}>
                        <h2 style={styles.formTitle}>Delivery Information</h2>
                        <form style={styles.form} onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your name"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your@email.com"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+92 3xx xxxx xxx"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Street address"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Lahore"
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="54000"
                                    style={styles.input}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    ...styles.submitButton,
                                    opacity: isSubmitting ? 0.6 : 1,
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div style={styles.summarySection}>
                        <h2 style={styles.summaryTitle}>Order Summary</h2>

                        <div style={styles.orderItems}>
                            {cartItems.map(item => (
                                <div key={item.id} style={styles.orderItem}>
                                    <div style={styles.itemName}>
                                        <div>{item.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: colors.gray[400] }}>
                                            Qty: {item.quantity}
                                        </div>
                                    </div>
                                    <div style={styles.itemPrice}>
                                        PKR {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={styles.totalsSection}>
                            <div style={styles.totalRow}>
                                <span>Subtotal:</span>
                                <span>PKR {subtotal.toLocaleString()}</span>
                            </div>
                            <div style={styles.totalRow}>
                                <span>Shipping:</span>
                                <span>PKR {shipping}</span>
                            </div>
                            <div style={styles.grandTotal}>
                                <span>Total:</span>
                                <span style={{ color: colors.accent }}>PKR {total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
