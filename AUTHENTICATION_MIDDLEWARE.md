# 🔐 Authentication Middleware Documentation

## Overview
Aplikasi ini menggunakan Next.js Middleware untuk memproteksi halaman-halaman yang memerlukan autentikasi.

## Protected Routes
Halaman berikut **memerlukan login**:
- `/dashboard` - Dashboard utama
- `/planner` - FIRE Planner
- `/results` - Hasil simulasi
- `/settings` - Pengaturan
- `/education` - Halaman edukasi
- `/transaction/*` - Semua halaman transaksi (income, outcome, report)

## Public Routes
Halaman berikut **tidak memerlukan login**:
- `/auth/login` - Halaman login
- `/auth/register` - Halaman registrasi
- `/auth/forgot-password` - Lupa password

## How It Works

### 1. Authentication Check
Middleware akan memeriksa keberadaan **auth token di cookies** (`fire-planner-auth-token`).

### 2. Redirect Logic

#### Scenario A: User belum login mencoba akses protected route
```
User → /dashboard (protected)
Middleware → Check cookie → No token found
Middleware → Redirect to /auth/login?redirect=/dashboard
User → Login sukses
App → Redirect kembali ke /dashboard
```

#### Scenario B: User sudah login mencoba akses halaman auth
```
User (logged in) → /auth/login
Middleware → Check cookie → Token found
Middleware → Redirect to /dashboard
```

#### Scenario C: User akses root path `/`
```
User (not logged in) → /
Middleware → Redirect to /auth/login

User (logged in) → /
Middleware → Redirect to /dashboard
```

### 3. Cookie Management

**When user logs in:**
```javascript
document.cookie = 'fire-planner-auth-token=<token>; path=/; max-age=604800';
// Token valid for 7 days
```

**When user logs out:**
```javascript
document.cookie = 'fire-planner-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
// Cookie immediately expires
```

## Files Modified

1. **`src/middleware.ts`** - Main middleware file
2. **`src/store/index.ts`** - Updated `setAuth()` dan `logout()` untuk manage cookies
3. **`src/lib/auth-cookies.ts`** - Utility functions untuk cookie operations
4. **`src/components/auth/LoginForm.tsx`** - Handle redirect parameter

## Testing

### Test 1: Access protected route without login
1. Pastikan **logout** terlebih dahulu
2. Buka browser dan ketik `http://localhost:3000/dashboard`
3. **Expected**: Auto-redirect ke `/auth/login?redirect=/dashboard`

### Test 2: Login and redirect back
1. Di halaman login, masukkan credentials
2. Klik login
3. **Expected**: Redirect kembali ke `/dashboard` (halaman yang dituju sebelumnya)

### Test 3: Already logged in, try to access login page
1. Pastikan sudah **login**
2. Ketik `http://localhost:3000/auth/login` di browser
3. **Expected**: Auto-redirect ke `/dashboard`

### Test 4: Logout clears access
1. Login ke aplikasi
2. Buka `/dashboard` (seharusnya accessible)
3. Klik **Logout**
4. **Expected**: Redirect ke `/auth/login`
5. Coba akses `/dashboard` lagi
6. **Expected**: Redirect kembali ke `/auth/login`

### Test 5: Cookie persistence
1. Login ke aplikasi
2. **Close browser** completely
3. **Open browser** lagi
4. Ketik `http://localhost:3000/dashboard`
5. **Expected**: Tetap bisa akses (token masih valid di cookies)

## Debugging

### Check cookie in browser:
```javascript
// Buka Console (F12)
document.cookie
// Output: "fire-planner-auth-token=db_access_..."
```

### Check authentication status:
```javascript
// Di Console
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('fire-planner-auth-token='))
  ?.split('=')[1];

console.log('Auth Token:', token);
console.log('Is Authenticated:', !!token);
```

### Clear cookies manually:
```javascript
// Di Console
document.cookie = 'fire-planner-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
location.reload();
```

## Security Notes

1. **Cookie Settings:**
   - `path=/` - Available to all routes
   - `max-age=604800` - 7 days expiration
   - `SameSite=Lax` - CSRF protection

2. **Server-Side Check:**
   - Middleware runs on server BEFORE page renders
   - No flash of unauthorized content

3. **Production Considerations:**
   - In production, add `Secure` flag: `Secure; SameSite=Strict`
   - Use HTTPS only
   - Consider shorter expiration times
   - Implement token refresh mechanism

## Troubleshooting

### Problem: Infinite redirect loop
**Solution:** Clear all cookies and localStorage
```javascript
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC";
});
location.reload();
```

### Problem: Still can access protected route without login
**Solution:** 
1. Check if middleware file is in correct location (`src/middleware.ts`)
2. Restart dev server
3. Clear browser cache
4. Check browser console for errors

### Problem: Redirect parameter not working
**Solution:**
1. Check URL contains `?redirect=...` parameter
2. Verify LoginForm is reading `searchParams`
3. Check browser console logs
