import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('product.product')} {id}</h1>
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">Product detail page coming soon...</p>
        </div>
      </div>
  );
} 