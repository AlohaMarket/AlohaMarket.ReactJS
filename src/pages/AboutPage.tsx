import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('navigation.about')}</h1>
      
      <div className="prose max-w-none">
        <p className="text-gray-600 text-lg mb-8">
          Welcome to Aloha Market! We are your trusted e-commerce platform providing 
          the best shopping experience with quality products and excellent service.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary-500">Our Mission</h2>
            <p className="text-gray-600">
              To provide the best e-commerce experience for our customers by offering 
              quality products, competitive prices, and exceptional customer service.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary-500">Our Vision</h2>
            <p className="text-gray-600">
              To be the leading online marketplace in the region, connecting buyers 
              and sellers in a trusted and convenient platform.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary-500">Why Choose Us?</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Wide variety of products</li>
              <li>• Secure payment options</li>
              <li>• Fast and reliable delivery</li>
              <li>• 24/7 customer support</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary-500">Contact Info</h2>
            <div className="text-gray-600 space-y-2">
              <p>📧 Email: support@alohamarket.com</p>
              <p>📞 Phone: +1 (555) 123-4567</p>
              <p>📍 Address: 123 Market St, City, Country</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 