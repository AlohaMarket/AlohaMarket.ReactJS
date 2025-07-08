import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PostDetailPage from './pages/PostDetailPage/PostDetailPage';
import AuthCallback from './pages/AuthCallback';
import CreatePostPage from './pages/CreatePostPage/CreatePostPage';
import PostStatusPage from './pages/PostStatusPage/PostStatusPage';
import MyPostsPage from './pages/ProfilePage/MyPostsPage';

// Lazy load components
const HomePage = lazy(() => import('@/pages/HomePage'));
const PostListPage = lazy(() => import('@/pages/PostListPage/PostListPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const SellerProfilePage = lazy(() => import('@/pages/SellerProfilePage/SellerProfilePage'));
const HelpCenter = lazy(() => import('@/pages/Help/HelpCenter'));
const HelpSeller = lazy(() => import('@/pages/Help/HelpSeller'));
const HelpBuyer = lazy(() => import('@/pages/Help/HelpBuyer'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));

const ProPage = lazy(() => import('@/pages/Payment/ProPage'));
const CheckoutPage = lazy(() => import('@/pages/Payment/CheckoutPage'));
const SuccessPage = lazy(() => import('@/pages/Payment/SuccessPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage/ChatApp'));

// Admin components
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const UsersManagement = lazy(() => import('@/pages/admin/UsersManagement'));
const ProductsManagement = lazy(() => import('@/pages/admin/ProductsManagement'));
const OrdersManagement = lazy(() => import('@/pages/admin/OrdersManagement'));
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

export function useRouteElements() {
  return (
    <Routes>
      {/* Auth callback route */}
      <Route
        path="/auth/callback"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <AuthCallback />
          </Suspense>
        }
      />

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

        {/* Search/Posts listing route */}
        <Route
          path="posts"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PostListPage />
            </Suspense>
          }
        />

        <Route
          path="post/:id"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PostDetailPage />
            </Suspense>
          }
        />

        <Route
          path="post/:id/status"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PostStatusPage />
            </Suspense>
          }
        />

        <Route
          path="create-post"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <CreatePostPage />
            </Suspense>
          }
        />

        <Route
          path="post-status"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PostStatusPage />
            </Suspense>
          }
        />

        {/* About pages */}
        <Route
          path="profile"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProfilePage />
            </Suspense>
          }
        />

        <Route
          path="my-posts"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <MyPostsPage />
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

        <Route
          path="seller/:id"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <SellerProfilePage />
            </Suspense>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Navigate to="/admin/dashboard" replace />
            </Suspense>
          }
        />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <UsersManagement />
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProductsManagement />
            </Suspense>
          }
        />
        <Route
          path="orders"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <OrdersManagement />
            </Suspense>
          }
        />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminSettings />
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
