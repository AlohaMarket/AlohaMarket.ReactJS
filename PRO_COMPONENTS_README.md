# Pro Components

Bộ components này cung cấp giao diện đẹp mắt để quảng bá và nâng cấp lên gói Pro.

## Components có sẵn:

### 1. ProUpgradeButton

Nút nâng cấp Pro trong Header - có hiệu ứng gradient đẹp mắt với animation shimmer.

**Sử dụng:**

```tsx
import { ProUpgradeButton } from '@/components/common/pro';

<ProUpgradeButton />;
```

### 2. ProBadge

Badge nhỏ gọn để hiển thị trạng thái Pro.

**Sử dụng:**

```tsx
import { ProBadge } from '@/components/common/pro';

<ProBadge variant="small" />
<ProBadge variant="medium" />
<ProBadge variant="large" />
```

### 3. ProFloatingButton

Nút floating ở góc màn hình với animation và tooltip.

**Sử dụng:**

```tsx
import { ProFloatingButton } from '@/components/common/pro';

// Đã được thêm vào MainLayout
<ProFloatingButton />;
```

### 4. ProPromotionCard

Card quảng cáo Pro với danh sách lợi ích và giá cả.

**Sử dụng:**

```tsx
import { ProPromotionCard } from '@/components/common/pro';

<ProPromotionCard />;
```

### 5. ProPromotionBanner

Banner quảng cáo ở đầu trang với hiệu ứng gradient.

**Sử dụng:**

```tsx
import { ProPromotionBanner } from '@/components/common/pro';

// Đã được thêm vào HomePage
<ProPromotionBanner />;
```

### 6. ProStatus

Hiển thị trạng thái Pro của user (chỉ hiển thị khi user là Pro).

**Sử dụng:**

```tsx
import { ProStatus } from '@/components/common/pro';

<ProStatus variant="compact" />
<ProStatus variant="detailed" />
```

## Hiệu ứng CSS

Các animation đã được thêm vào `index.css`:

- `animate-shimmer`: Hiệu ứng ánh sáng chạy qua
- `animate-float`: Hiệu ứng bay lên xuống
- `animate-fadeIn`: Hiệu ứng xuất hiện mềm mại

## Tích hợp

- **Header**: ProUpgradeButton đã được thêm vào Header
- **MainLayout**: ProFloatingButton đã được thêm vào layout
- **HomePage**: ProPromotionBanner đã được thêm vào trang chủ

## Tùy chỉnh

Tất cả components đều sử dụng Tailwind CSS và có thể tùy chỉnh thông qua prop `className`.

Màu sắc chính: Gradient từ amber/yellow đến orange để tạo cảm giác cao cấp và thu hút.
