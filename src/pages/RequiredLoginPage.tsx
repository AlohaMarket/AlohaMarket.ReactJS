import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useApp';
import { Lock, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function RequiredLoginPage() {
    const { isAuthenticated, login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to saved path after login
    useEffect(() => {
        if (isAuthenticated) {
            const redirectPath = localStorage.getItem('authRedirectPath') || '/';
            localStorage.removeItem('authRedirectPath');
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = () => {
        // Save current location for redirect after login
        const currentPath = location.state?.from?.pathname || location.pathname;
        localStorage.setItem('authRedirectPath', currentPath);
        login();
    };

    const handleGoHome = () => {
        navigate('/', { replace: true });
    };

    const handleViewPosts = () => {
        navigate('/posts', { replace: true });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Icon */}
                    <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-10 h-10 text-blue-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Login Required
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        You need to be logged in to access this page.
                        Please sign in to continue with your AlohaMarket experience.
                    </p>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
                    >
                        Sign In with Keycloak
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Alternative Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleViewPosts}
                            className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Browse Posts Instead
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Go to Homepage
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <button
                                onClick={handleLogin}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Sign up here
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Secure authentication powered by Keycloak
                </p>
            </div>
        </div>
    );
}
