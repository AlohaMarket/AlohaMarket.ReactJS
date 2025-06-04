import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate(); // ← thêm useNavigate
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Lấy mode từ URL params, mặc định là login
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  // Effect để set state dựa trên URL params
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login attempt:', formData);
    } else {
      console.log('Register attempt:', formData);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${isLogin ? 'Login' : 'Register'} with ${provider}`);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      phone: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    });
    // Cập nhật URL khi toggle
    const newMode = !isLogin ? 'login' : 'register';
    window.history.replaceState({}, '', `/auth?mode=${newMode}`);
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700">
      {/* ← nút về Home với icon lớn */}
      <button
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 p-1 text-white hover:opacity-80"
        aria-label="Về trang chủ"
      >
        <Home size={32} />
      </button>

      {/* Left side - Illustration */}
      <div className="hidden items-center justify-center p-8 lg:flex lg:w-1/2">
        <div className="max-w-md text-center">
          {/* Illustration */}
          <div className="relative mx-auto mb-6 flex h-56 w-72 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-sm">
            {/* Checkmark */}
            <div className="absolute left-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
              <Check size={14} className="text-white" />
            </div>

            {/* Phone illustration */}
            <div className="flex h-40 w-24 items-end justify-center rounded-xl bg-white/20 pb-3 shadow-md backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/80">
                <div className="text-xl">📱</div>
              </div>
            </div>

            {/* Star decoration */}
            <div className="absolute right-4 top-4 text-yellow-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>

          <div className="text-white">
            <h2 className="mb-3 text-2xl font-bold">
              {isLogin ? 'Chào mừng trở lại!' : 'Tham gia cùng chúng tôi!'}
            </h2>
            <p className="text-sm text-blue-100">
              {isLogin ? 'Đăng nhập để tiếp tục mua sắm' : 'Tạo tài khoản để bắt đầu mua sắm'}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login/Register form */}
      <div className="flex w-full items-center justify-center p-4 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl bg-white p-6 shadow-2xl backdrop-blur-sm">
            {/* Logo and title */}
            <div className="mb-5 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                <span className="text-lg font-bold text-white">🛒</span>
              </div>
              <h1 className="mb-1 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent">
                ALOHA MARKET
              </h1>
              <h2 className="text-lg font-semibold text-gray-800">
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full name input - chỉ hiện khi register */}
              {!isLogin && (
                <div>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              )}

              {/* Phone input */}
              <div>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* Password input */}
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Confirm password input - chỉ hiện khi register */}
              {!isLogin && (
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              )}

              {/* Remember me and forgot password - chỉ hiện khi login */}
              {isLogin && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div
                      className={`flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded border-2 ${
                        rememberMe ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      {rememberMe && <Check size={10} className="text-white" />}
                    </div>
                    <span
                      className="ml-1.5 cursor-pointer text-gray-600"
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      Ghi nhớ
                    </span>
                  </div>
                  <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600">
                    Quên mật khẩu?
                  </Link>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="mt-4 w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
              >
                {isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-2 text-xs text-gray-500">
                {isLogin ? 'Hoặc đăng nhập bằng' : 'Hoặc đăng ký bằng'}
              </span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social login buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleSocialLogin('facebook')}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm text-white transition-all hover:bg-blue-700"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>

              <button
                onClick={() => handleSocialLogin('google')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-800 transition-all hover:bg-gray-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                onClick={() => handleSocialLogin('apple')}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm text-white transition-all hover:bg-gray-800"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                Apple ID
              </button>
            </div>

            {/* Toggle login/register */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                <button
                  onClick={toggleMode}
                  className="font-semibold text-blue-500 transition-colors hover:text-blue-600"
                >
                  {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                </button>
              </p>
            </div>

            {/* Footer links */}
            <div className="mt-3 space-x-2 text-center text-xs text-gray-500">
              <Link to="/privacy" className="hover:text-gray-700">
                Quy chế
              </Link>
              <span>•</span>
              <Link to="/policy" className="hover:text-gray-700">
                Bảo mật
              </Link>
              <span>•</span>
              <Link to="/support" className="hover:text-gray-700">
                Hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
