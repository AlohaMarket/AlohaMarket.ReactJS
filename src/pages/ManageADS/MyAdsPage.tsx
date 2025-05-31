import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
// nếu bạn đã có sẵn Header/​Footer thì import vào đây
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

type AdStatus = 'active' | 'expired' | 'rejected' | 'payment' | 'draft' | 'pending' | 'hidden';

interface Ad {
  id: string;
  title: string;
  price: number;
  location: string;
  date: string;
  imageUrl: string;
  status: AdStatus;
}

const statusTabs: { key: AdStatus; label: string }[] = [
  { key: 'active', label: 'Đang hiển thị' },
  { key: 'expired', label: 'Hết hạn' },
  { key: 'rejected', label: 'Bị từ chối' },
  { key: 'payment', label: 'Cần thanh toán' },
  { key: 'draft', label: 'Tin nháp' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'hidden', label: 'Đã ẩn' },
];

// mock data
const mockAds: Ad[] = [
  // Uncomment để thử hiển thị
  // {
  //   id: '1',
  //   title: 'Xe máy Honda Vision 2019, biển HN',
  //   price: 21500000,
  //   location: 'Hà Nội',
  //   date: '2 ngày trước',
  //   imageUrl: '/images/vision.jpg',
  //   status: 'active',
  // },
];

export default function MyAdsPage() {
  const [selectedTab, setSelectedTab] = useState<AdStatus>('active');

  const filteredAds = useMemo(
    () => mockAds.filter((ad) => ad.status === selectedTab),
    [selectedTab]
  );
  const counts = useMemo(
    () =>
      statusTabs.reduce<Record<AdStatus, number>>(
        (acc, tab) => {
          acc[tab.key] = mockAds.filter((ad) => ad.status === tab.key).length;
          return acc;
        },
        {} as Record<AdStatus, number>
      ),
    []
  );

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        {/* Breadcumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link to="/">Chợ Tốt</Link> / <span>Quản lý tin</span>
        </nav>

        {/* User info */}
        <div className="mb-6 flex items-center">
          <img
            src="/images/avatar.jpg"
            alt="avatar"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <div className="font-semibold">Hoàng Quốc An</div>
            <button className="mt-1 text-sm text-blue-500 hover:underline">+ Tạo cửa hàng</button>
          </div>
        </div>

        {/* Status tabs */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {statusTabs.map((tab) => (
            <div
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`cursor-pointer rounded-lg p-3 text-center transition ${
                selectedTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-sm">{tab.label}</div>
              <div className="text-lg font-bold">{counts[tab.key] || 0}</div>
            </div>
          ))}
        </div>

        {/* Ads list or empty state */}
        {filteredAds.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAds.map((ad) => (
              <div key={ad.id} className="overflow-hidden rounded-lg bg-white shadow">
                <img src={ad.imageUrl} alt={ad.title} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h3 className="mb-1 line-clamp-2 text-lg font-semibold">{ad.title}</h3>
                  <div className="mb-2 font-bold text-red-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(ad.price)}
                  </div>
                  <div className="mb-2 text-sm text-gray-500">
                    {ad.location} &bull; {ad.date}
                  </div>
                  <Link to={`/my-ads/${ad.id}`} className="text-sm text-blue-500 hover:underline">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <img
              src="/images/empty-state.png"
              alt="empty"
              className="mx-auto mb-6 h-32 w-32 opacity-50"
            />
            <h3 className="mb-2 text-xl font-semibold">Không tìm thấy tin đăng</h3>
            <p className="mb-6 text-gray-500">
              Bạn hiện tại không có tin đăng nào cho trạng thái này
            </p>
            <Link
              to="/post"
              className="inline-block rounded-lg bg-orange-500 px-6 py-2 text-white shadow transition hover:bg-orange-600"
            >
              Đăng tin
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
