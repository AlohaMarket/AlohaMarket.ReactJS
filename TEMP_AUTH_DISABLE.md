# Tạm thời tắt Authentication cho Payment Routes

## Những thay đổi đã thực hiện:

### 1. useRouteElements.tsx

- Loại bỏ `<ProtectedRoute>` wrapper khỏi các payment routes:
  - `/payment/pro`
  - `/payment/checkout`
  - `/payment/success`
  - `/payment/failed`

### 2. Pro Components

Đã cập nhật các components sau để bỏ yêu cầu đăng nhập:

- `ProUpgradeButton.tsx`
- `ProFloatingButton.tsx`
- `ProBadge.tsx`
- `ProPromotionCard.tsx`
- `ProPromotionBanner.tsx`

## Để khôi phục authentication sau này:

### 1. Thêm lại ProtectedRoute wrapper:

```tsx
<Route
  path="payment/pro"
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner />}>
        <ProPage />
      </Suspense>
    </ProtectedRoute>
  }
/>
```

### 2. Cập nhật lại Pro components:

```tsx
const handleUpgradeClick = () => {
  if (!isAuthenticated) {
    login();
    return;
  }
  navigate('/payment/pro');
};
```

## Lý do thay đổi:

- Để test payment flow mà không bị chặn bởi authentication
- User báo không vào được trang payment sau khi đã vào được trước đó

## Note:

Nhớ restore lại authentication khi deploy production!
