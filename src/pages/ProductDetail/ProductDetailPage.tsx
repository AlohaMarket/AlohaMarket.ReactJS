import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

// const item = {
//   img: "/images/shoes2.jpg",
//   title: "Giày Snecker hiệu MLB, size 37,5",
//   status: "Đã sử dụng • Cả nam và nữ",
//   price: 160000,
//   location: "Quận Thanh Xuân",
//   time: "18 giờ trước",
//   count: 6,
// }
const mockProduct = {
  title: 'Quần hộp coton, Nhật, size 33',
  status: 'Đã sử dụng · Đồ nam',
  price: 70000,
  location: 'Phường Nhân Chính, Quận Thanh Xuân, Hà Nội',
  updated: 'Cập nhật 29 giây trước',
  phone: '090424****',
  images: [
    '/images/pants1.jpg',
    '/images/pants2.jpg',
    '/images/pants3.jpg',
    '/images/pants4.jpg',
    '/images/pants5.jpg',
  ],
  seller: {
    name: 'Chú Phúc',
    avatar: '/images/avatar.jpg',
    response: 92,
    sold: 15,
    rating: 4.6,
    reviews: 75,
    online: true,
  },
  questions: [
    'Sản phẩm này còn không ạ?',
    'Bạn có ship hàng không?',
    'Bạn có mặc vừa không?',
  ],
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [selectedImg, setSelectedImg] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="relative w-full">
            <img
              src={mockProduct.images[selectedImg]}
              alt="product"
              className="rounded-lg w-full object-cover max-h-[400px]"
            />
            {/* Left arrow */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-100 rounded-full p-2 shadow hover:bg-gray-200"
              onClick={() => setSelectedImg((prev) => prev > 0 ? prev - 1 : prev)}
              disabled={selectedImg === 0}
            >
              &#8592;
            </button>
            {/* Right arrow */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 rounded-full p-2 shadow hover:bg-gray-200"
              onClick={() => setSelectedImg((prev) => prev < mockProduct.images.length - 1 ? prev + 1 : prev)}
              disabled={selectedImg === mockProduct.images.length - 1}
            >
              &#8594;
            </button>
            {/* Image count */}
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {selectedImg + 1}/{mockProduct.images.length}
            </span>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 mt-4">
            {mockProduct.images.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt={`thumb-${idx}`}
                className={`w-16 h-16 object-cover rounded border-2 ${selectedImg === idx ? 'border-orange-500' : 'border-transparent'} cursor-pointer`}
                onClick={() => setSelectedImg(idx)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{mockProduct.title}</h1>
            <div className="text-gray-500 text-sm mt-1">{mockProduct.status}</div>
          </div>
          <div className="text-2xl font-bold text-red-600">{mockProduct.price.toLocaleString()} đ</div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 12.414A2 2 0 0012 12H7a2 2 0 00-2 2v5a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-.586-1.414l-4.243-4.243A8 8 0 1121 12.414l-3.343 3.243z" /></svg>
            {mockProduct.location}
          </div>
          <div className="text-gray-400 text-sm">{mockProduct.updated}</div>
          <div className="flex gap-2 mt-2">
            <button className="bg-gray-100 px-4 py-2 rounded font-semibold text-gray-700">{`Hiện số ${mockProduct.phone}`}</button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold">Chat</button>
          </div>
          {/* Seller Info */}
          <div className="flex items-center gap-4 mt-4 p-4 bg-gray-50 rounded">
            <img src={mockProduct.seller.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold">{mockProduct.seller.name}</div>
              <div className="text-gray-500 text-xs flex items-center gap-2">
                Phản hồi: {mockProduct.seller.response}% · {mockProduct.seller.sold} đã bán
                <span className={`ml-2 w-2 h-2 rounded-full ${mockProduct.seller.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span>{mockProduct.seller.online ? 'Đang hoạt động' : 'Offline'}</span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-yellow-500 font-bold text-lg">{mockProduct.seller.rating} ★</div>
              <div className="text-xs text-gray-500">{mockProduct.seller.reviews} đánh giá</div>
            </div>
          </div>
          {/* Quick Questions */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {mockProduct.questions.map((q, idx) => (
              <button key={idx} className="bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-gray-200">{q}</button>
            ))}
          </div>
        </div>
      </div>
      {/* Mô tả chi tiết & Thông tin chi tiết */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Mô tả chi tiết</h2>
        <div className="mb-4">
          Quần hộp coton, Nhật, size 33, eo 84-85cm, dài 95cm, ống chun rút, chất coton cực mát, mềm mại, thời trang;
        </div>

        <h3 className="text-base font-semibold mb-2">Thông tin chi tiết</h3>
        <table className="w-full border rounded">
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-semibold text-gray-600 w-1/3 bg-gray-100 border-r">Tình trạng:</td>
              <td className="py-2 px-4">Đã sử dụng</td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold text-gray-600 w-1/3 bg-gray-100 border-r">Loại sản phẩm:</td>
              <td className="py-2 px-4">Đồ nam</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tin rao khác của Chú Phúc */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tin rao khác của Chú Phúc</h2>
          {/* <a href="#" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
            Xem tất cả <span className="text-xl">&#8250;</span>
          </a> */}
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[{
            img: "/images/pants1.jpg",
            title: "Quần Jean - Versage, size 29 và các size",
            status: "Đã sử dụng • Đồ nam",
            price: 100000,
            location: "Quận Thanh Xuân",
            time: "22 phút trước",
            count: 4,
          },
          {
            img: "/images/shoes1.jpg",
            title: "Giày Snecker hiệu ZARA, size 41",
            status: "Đã sử dụng • Đồ nam",
            price: 80000,
            location: "Quận Thanh Xuân",
            time: "18 giờ trước",
            // count: 6,
          },
          {
            img: "/images/shoes2.jpg",
            title: "Giày Snecker hiệu MLB, size 37,5",
            status: "Đã sử dụng • Cả nam và nữ",
            price: 160000,
            location: "Quận Thanh Xuân",
            time: "18 giờ trước",
            count: 6,
          },
          {
            img: "/images/shoes3.jpg",
            title: "Giày da cao cổ , hiệu ZARA, size 39",
            status: "Đã sử dụng • Cả nam và nữ",
            price: 160000,
            location: "Quận Thanh Xuân",
            time: "18 giờ trước",
            count: 6,
          },
          {
            img: "/images/shoes4.jpg",
            title: "Giày chạy Hongkong, size 39",
            status: "Đã sử dụng • Cả nam và nữ",
            price: 100000,
            location: "Quận Thanh Xuân",
            time: "18 giờ trước",
            count: 1,
          },
          {
            img: "/images/shoes4.jpg",
            title: "Giày chạy Hongkong, size 39",
            status: "Đã sử dụng • Cả nam và nữ",
            price: 100000,
            location: "Quận Thanh Xuân",
            time: "18 giờ trước",
            count: 1,
          }
          ].map((item, idx) => (
            <div key={idx} className="w-56 flex-shrink-0 bg-white rounded border border-gray-100 shadow-sm">
              <div className="relative">
                <img src={item.img} alt={item.title} className="w-full h-36 object-cover rounded-t" />
                <span className="absolute bottom-1 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">{item.count}</span>
                <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-500">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                </button>
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</div>
                <div className="text-xs text-gray-500 mt-1">{item.status}</div>
                <div className="text-red-600 font-bold mt-1">{item.price.toLocaleString()} đ</div>
                <div className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                  <span>{item.location}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
                {/* <div className="flex items-center mt-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8z" /></svg>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}