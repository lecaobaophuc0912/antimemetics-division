# Internationalization (i18n) Setup

Dự án này đã được cấu hình để hỗ trợ đa ngôn ngữ với `next-intl`.

## Cấu trúc

### Files cấu hình
- `src/i18n.ts` - Cấu hình chính cho i18n
- `middleware.ts` - Middleware để xử lý routing với locale
- `messages/` - Thư mục chứa các file ngôn ngữ
  - `en.json` - Tiếng Anh
  - `vi.json` - Tiếng Việt

### Hooks
- `src/hooks/useTranslations.ts` - Custom hooks để sử dụng translations

### Components
- `src/components/LanguageSwitcher.tsx` - Component chuyển đổi ngôn ngữ

## Cách sử dụng

### 1. Sử dụng translations trong components

```tsx
import { useHomeTranslations } from '../hooks/useTranslations';

export function MyComponent() {
  const t = useHomeTranslations();
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}
```

### 2. Các hooks có sẵn

- `useCommonTranslations()` - Cho các text chung
- `useNavigationTranslations()` - Cho navigation
- `useHomeTranslations()` - Cho trang chủ
- `useAuthTranslations()` - Cho authentication
- `useTodosTranslations()` - Cho todos
- `useErrorTranslations()` - Cho error messages

### 3. Thêm ngôn ngữ mới

1. Thêm locale vào `src/i18n.ts`:
```ts
export const locales = ['en', 'vi', 'ja'] as const;
```

2. Tạo file messages mới:
```json
// messages/ja.json
{
  "common": {
    "loading": "読み込み中...",
    "error": "エラー"
  }
}
```

3. Cập nhật middleware:
```ts
export const config = {
  matcher: ['/', '/(vi|en|ja)/:path*']
};
```

### 4. URL Structure

- `/en/` - Tiếng Anh
- `/vi/` - Tiếng Việt
- `/` - Redirect đến locale mặc định (en)

### 5. Chuyển đổi ngôn ngữ

Component `LanguageSwitcher` đã được tích hợp vào `Navigation` component và sẽ tự động chuyển đổi ngôn ngữ khi click.

## Cấu trúc Messages

Messages được tổ chức theo namespace:

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error"
  },
  "home": {
    "title": "ANTIMEMETICS DIVISION",
    "subtitle": "No. This is not your first day."
  },
  "auth": {
    "neuralAccess": "NEURAL ACCESS",
    "synchronizeConsciousness": "Synchronize your consciousness with the quantum network"
  }
}
```

## Best Practices

1. **Sử dụng namespace**: Tổ chức messages theo chức năng
2. **Consistent naming**: Sử dụng camelCase cho key names
3. **Reusable keys**: Tạo keys có thể tái sử dụng trong `common`
4. **Context**: Đảm bảo translations có ý nghĩa trong context

## Troubleshooting

### Lỗi "Cannot find module 'next-intl'"
Chạy lệnh cài đặt:
```bash
npm install next-intl
```

### Lỗi routing
Đảm bảo middleware được cấu hình đúng và locale được thêm vào `locales` array.

### Lỗi TypeScript
Kiểm tra file `src/i18n.ts` và đảm bảo types được export đúng cách. 