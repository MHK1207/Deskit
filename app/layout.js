import './globals.css';
import CursorLight from '@/app/components/CursorLight';
import CartSidebar from '@/app/components/CartSidebar';
import { CartProvider } from '@/app/lib/CartContext';

export const metadata = {
  title: 'Deskit — Precision Desk Tools',
  description: 'Digital atelier providing precision-engineered desk tools.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <CursorLight />
          {children}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
