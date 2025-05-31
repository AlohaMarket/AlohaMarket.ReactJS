import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from '@/layouts/MainLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetail/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export function useRouteElements() {
  return (
    <Routes>
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
          path="products"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProductsPage />
            </Suspense>
          }
        />
        <Route
          path="products/:id"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProductDetailPage />
            </Suspense>
          }
        />
        <Route
          path="cart"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <CartPage />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProfilePage />
            </Suspense>
          }
        />
        <Route
          path="about"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AboutPage />
            </Suspense>
          }
        />
      </Route>

      {/* Auth routes - sử dụng LoginPage với URL params */}
      <Route
        path="/auth"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        }
      />

      {/* Redirect old routes to new auth route */}
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
