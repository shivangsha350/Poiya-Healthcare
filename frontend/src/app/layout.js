import '../index.css';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import ScrollReveal from '../components/ScrollReveal';

export const metadata = {
  title: 'MediVision - Modern Healthcare Services',
  description: 'Provide state-of-the-art healthcare products and equipment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Logo.png" />
      </head>
      <body className="antialiased">
        <AdminAuthProvider>
          <ScrollReveal />
          {children}
        </AdminAuthProvider>
      </body>
    </html>
  );
}
