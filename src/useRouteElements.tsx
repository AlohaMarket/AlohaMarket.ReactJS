import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ROLES } from '@/utils/role';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PostDetailPage from './pages/PostDetailPage/PostDetailPage';
import AuthCallback from './pages/AuthCallback';
import CreatePostPage from './pages/CreatePostPage/CreatePostPage';
import PostStatusPage from './pages/PostStatusPage/PostStatusPage';
import MyPostsPage from './pages/ProfilePage/MyPostsPage';

// Add RequiredLoginPage import
const RequiredLoginPage = lazy(() => import('@/pages/RequiredLoginPage'));

// Lazy load components
const HomePage = lazy(() => import('@/pages/HomePage'));
const PostListPage = lazy(() => import('@/pages/PostListPage/PostListPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
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
const PostsManagement = lazy(() => import('@/pages/admin/PostsManagement'));
const OrdersManagement = lazy(() => import('@/pages/admin/OrdersManagement'));
const UserPlansManagement = lazy(() => import('@/pages/admin/UserPlansManagement'));
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

// Thêm import

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

      {/* Unauthorized route */}
      <Route
        path="/unauthorized"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <UnauthorizedPage />
          </Suspense>
        }
      />

      {/* Required login route */}
      <Route
        path="/required-login"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <RequiredLoginPage />
          </Suspense>
        }
      />

      {/* Main layout routes */}
      <Route path="/" element={<MainLayout />}>
        {/* Public routes - no protection needed */}
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <HomePage />
            </Suspense>
          }
        />

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

        <Route
          path="seller/:id"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <SellerProfilePage />
            </Suspense>
          }
        />

        {/* Protected routes - require authentication */}
        <Route
          path="post/:id/status"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <PostStatusPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="create-post"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <CreatePostPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="my-posts"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <MyPostsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Payment routes - require authentication */}
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
              <SuccessPage />
            </Suspense>
          }
        />

        {/* Chat route - no protection needed, can be accessed with userId/postId from URL */}
        <Route
          path="chat"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ChatPage />
            </Suspense>
          }
        />
      </Route>

      {/* Admin routes - protected by role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole={ROLES.ADMIN} allowAutoLogin={false} fallbackPath="/required-login">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

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
              <PostsManagement />
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
          path="user-plans"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <UserPlansManagement />
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

      {/* Help routes - public pages */}
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

      {/* 404 route */}
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
