import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BarberProvider, useBarber } from './context/BarberContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useIdleTimeout } from './hooks/useIdleTimeout';

// Lazy load components to optimize initial page loading and bundle size
const Home = React.lazy(() => import('./pages/Home'));
const Booking = React.lazy(() => import('./pages/Booking'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Services = React.lazy(() => import('./pages/Services'));
const Login = React.lazy(() => import('./pages/Login'));
const About = React.lazy(() => import('./pages/About'));

// Lazy load admin pages
const AdminLayout = React.lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./admin/Dashboard'));
const ManageBookings = React.lazy(() => import('./admin/ManageBookings'));
const ManageServices = React.lazy(() => import('./admin/ManageServices'));
const ManageBarbers = React.lazy(() => import('./admin/ManageBarbers'));
const ManageModels = React.lazy(() => import('./admin/ManageModels'));
const ManageFinances = React.lazy(() => import('./admin/ManageFinances'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useBarber();
  if (!user || user.role !== 'admin') {
    // Obfuscate: Redirect to home page instead of /login to hide the login portal
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const LoadingSpinner = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl p-8">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-slate-500 font-medium animate-pulse text-sm">Memuat halaman...</p>
  </div>
);

function AppContent() {
  const { user, logout } = useBarber();
  const navigate = useNavigate();

  // Inactivity auto-logout: Logs out admin after 15 minutes of idle state
  useIdleTimeout({
    onTimeout: () => {
      logout();
      navigate('/');
      alert('Sesi Anda telah berakhir karena tidak ada aktivitas.');
    },
    timeoutMs: 900000, // 15 minutes
    enabled: !!user && user.role === 'admin'
  });

  // Keyboard shortcut listener: Ctrl + Alt + Shift + A to open admin portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin-secure-portal');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          
          {/* Obfuscated Admin Login Route */}
          <Route path="/admin-secure-portal" element={<Login />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="barbers" element={<ManageBarbers />} />
            <Route path="models" element={<ManageModels />} />
            <Route path="finances" element={<ManageFinances />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BarberProvider>
      <Router>
        <AppContent />
      </Router>
    </BarberProvider>
  );
}

