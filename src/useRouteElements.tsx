import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';

// Lazy load components
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetail/ProductDetailPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const HelpCenter = lazy(() => import('@/pages/Help/HelpCenter'));
const HelpSeller = lazy(() => import('@/pages/Help/HelpSeller'));
const HelpBuyer = lazy(() => import('@/pages/Help/HelpBuyer'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));

const ProPage = lazy(() => import('@/pages/Payment/ProPage'));
const CheckoutPage = lazy(() => import('@/pages/Payment/CheckoutPage'));
const SuccessPage = lazy(() => import('@/pages/Payment/SuccessPage'));
const AfterRegisterPage = lazy(() => import('@/pages/AfterRegisterPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage/ChatApp'));

export function useRouteElements() {
  return (
    <Routes>
      {/* Main layout routes */}
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <HomePage />
            </Suspense>
          }
        />

        <Route
          path="product/:id"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProductDetailPage />
            </Suspense>
          }
        />

        {/* About pages */}
        <Route
          path="profile"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </Suspense>
          }
        />        <Route
          path="about"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AboutPage />
            </Suspense>
          }
        />
        <Route
          path="privacy"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PrivacyPolicyPage />
            </Suspense>
          }
        />
        <Route
          path="terms"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <TermsOfServicePage />
            </Suspense>
          }
        />

        {/* Payment routes */}
        <Route
          path="payment/pro"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProPage />
            </Suspense>
          }
        />

        <Route
          path="payment/checkout"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <CheckoutPage />
            </Suspense>
          }
        />

        <Route
          path="payment/success"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <SuccessPage />
            </Suspense>
          }
        />

        <Route
          path="payment/failed"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <SuccessPage /> {/* Đổi thành SuccessPage vì nó handle cả success và failed */}
            </Suspense>
          }
        />

        <Route
          path="chat"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ChatPage />
            </Suspense>
          }
        />
      </Route>

      {/* Help routes - independent pages */}
      <Route
        path="help"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <HelpCenter />
          </Suspense>
        }
      />
      <Route
        path="help/seller"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <HelpSeller />
          </Suspense>
        }
      />
      <Route
        path="help/buyer"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <HelpBuyer />
          </Suspense>
        }
      />
      <Route
        path="/after-register"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <AfterRegisterPage />
          </Suspense>
        }
      />
      <Route
        path="/after-register"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <AfterRegisterPage />
          </Suspense>
        }
      />

      {/* Auth routes */}
      <Route
        path="/auth"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        }
      />

      {/* Redirect old routes */}
      <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
      <Route path="/register" element={<Navigate to="/auth?mode=register" replace />} />

      <Route
        path="*"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <NotFoundPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
