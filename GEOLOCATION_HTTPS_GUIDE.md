# Hướng dẫn khắc phục vấn đề Geolocation và ARIA Accessibility

## 1. Vấn đề Geolocation trên Public Domain

### Nguyên nhân:
- Geolocation API yêu cầu HTTPS trên public domain
- Trên localhost thì HTTP được cho phép
- Trên public domain (như Vercel, Netlify, etc.) thì bắt buộc phải dùng HTTPS

### Giải pháp:

#### A. Sử dụng HTTPS trên Production:
```bash
# Nếu deploy trên Vercel
vercel --prod

# Nếu deploy trên Netlify
netlify deploy --prod
```

#### B. Cấu hình HTTPS cho local development:
```bash
# Tạo SSL certificate cho localhost
npx mkcert localhost 127.0.0.1

# Chạy React với HTTPS
HTTPS=true SSL_CRT_FILE=localhost+1.pem SSL_KEY_FILE=localhost+1-key.pem npm start
```

#### C. Kiểm tra trong code:
```javascript
// Kiểm tra HTTPS trước khi gọi geolocation
if (window.location.protocol !== 'https:' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1') {
  // Hiển thị thông báo yêu cầu HTTPS
}
```

## 2. Vấn đề ARIA Accessibility

### Nguyên nhân:
- SweetAlert2 set `aria-hidden="true"` trên `#root` khi modal mở
- Button bên trong vẫn có thể focus được
- Vi phạm quy tắc accessibility

### Giải pháp:

#### A. Cải thiện SweetAlert2 wrapper:
```javascript
const showAlert = (options) => {
  // Xóa aria-hidden từ root element
  const rootElement = document.getElementById('root');
  if (rootElement && rootElement.getAttribute('aria-hidden') === 'true') {
    rootElement.removeAttribute('aria-hidden');
  }
  
  return Swal.fire({
    ...options,
    backdrop: false,
    allowOutsideClick: false,
    allowEscapeKey: true,
    customClass: {
      container: 'swal-no-aria-hidden'
    },
    didOpen: () => {
      // Đảm bảo popup không có focus trap
      const popup = document.querySelector('.swal2-popup');
      if (popup) {
        popup.setAttribute('tabindex', '-1');
        popup.focus();
      }
    }
  });
};
```

#### B. CSS fixes:
```css
/* Fix cho SweetAlert2 aria-hidden issue */
.swal-no-aria-hidden {
  z-index: 9999 !important;
}

/* Bỏ viền xanh của SweetAlert2 popup */
.swal2-popup:focus {
  outline: none !important;
}

.swal2-popup *:focus {
  outline: none !important;
}

/* Custom focus style */
.swal2-popup button:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
}
```

## 3. Các lỗi Geolocation thường gặp

### Error Code 1: PERMISSION_DENIED
- Người dùng từ chối quyền truy cập vị trí
- **Giải pháp**: Hướng dẫn người dùng bật quyền trong cài đặt trình duyệt

### Error Code 2: POSITION_UNAVAILABLE
- Không thể xác định vị trí
- **Giải pháp**: Kiểm tra GPS, kết nối mạng

### Error Code 3: TIMEOUT
- Hết thời gian chờ
- **Giải pháp**: Tăng timeout hoặc thử lại

## 4. Testing Checklist

### Geolocation:
- [ ] Test trên localhost (HTTP)
- [ ] Test trên HTTPS localhost
- [ ] Test trên production domain (HTTPS)
- [ ] Test khi từ chối quyền truy cập
- [ ] Test khi không có GPS
- [ ] Test khi mất kết nối mạng

### ARIA Accessibility:
- [ ] Test với screen reader
- [ ] Test navigation bằng keyboard
- [ ] Test focus management
- [ ] Kiểm tra không có focus trap
- [ ] Test với các trình duyệt khác nhau

## 5. Environment Variables

### Frontend (.env):
```env
REACT_APP_HOST=https://your-backend-domain.com
HTTPS=true
SSL_CRT_FILE=localhost+1.pem
SSL_KEY_FILE=localhost+1-key.pem
```

### Backend (.env):
```env
NODE_ENV=production
PORT=8000
```

## 6. Deployment Notes

### Vercel:
- Tự động có HTTPS
- Cần set environment variables
- CORS cần cấu hình đúng domain

### Netlify:
- Tự động có HTTPS
- Cần redirect rules cho SPA
- Environment variables cần set trong dashboard

### Heroku:
- Tự động có HTTPS
- Cần set buildpacks
- Environment variables trong dashboard 