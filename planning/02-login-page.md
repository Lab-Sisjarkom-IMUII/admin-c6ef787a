# Task 02: Login Page

## 📋 Overview
Membuat halaman login untuk admin dengan form validation dan error handling.

## ✅ Checklist

### 1. Create Login Page Component
- [ ] Create `src/pages/Login.jsx`
- [ ] Setup layout dengan glass morphism effect
- [ ] Add IMUII branding/logo
- [ ] Create login form dengan username & password fields

### 2. Create Login Form Component
- [ ] Create `src/components/auth/LoginForm.jsx`
- [ ] Add username input field
- [ ] Add password input field (with show/hide toggle)
- [ ] Add submit button dengan accent color
- [ ] Add loading state

### 3. Form Validation
- [ ] Validate username (required, min length)
- [ ] Validate password (required, min length)
- [ ] Show validation errors
- [ ] Disable submit jika form invalid

### 4. Error Handling
- [ ] Handle login errors (401, 500, network errors)
- [ ] Show error messages dengan red status color
- [ ] Add rate limiting feedback (jika ada)

### 5. Authentication Logic
- [ ] Create `src/contexts/AuthContext.jsx`
- [ ] Create `src/hooks/useAuth.js`
- [ ] Implement login function
- [ ] Store JWT token di localStorage
- [ ] Redirect ke dashboard setelah login success

## 🎨 Design Requirements

### Layout
- Full screen dengan gradient background
- Centered login card dengan glass morphism
- Card width: max 400px
- Card padding: 2rem
- Border: subtle dengan primary/accent glow

### Colors
- Background: Gradient dengan primary & accent
- Card: Glass morphism (`bg-[--glass-bg]`)
- Button: Accent color (`bg-accent`)
- Error text: Red 400 (`text-red-400`)

### Typography
- Title: Large, bold, dengan gradient text
- Labels: Medium weight
- Error messages: Small, red color

### Components
- Input fields: Glass style dengan border
- Button: Accent color dengan hover effect
- Loading spinner: Accent color

## 📝 Files to Create

1. `src/pages/Login.jsx` - Login page
2. `src/components/auth/LoginForm.jsx` - Login form component
3. `src/contexts/AuthContext.jsx` - Auth context
4. `src/hooks/useAuth.js` - Auth hook
5. `src/utils/api.js` - API utilities

## 📐 Component Structure

```jsx
<Login>
  <div className="glass card">
    <Logo />
    <h1>Admin Login</h1>
    <LoginForm>
      <Input type="text" name="username" />
      <Input type="password" name="password" />
      <Button type="submit">Login</Button>
      <ErrorMessage />
    </LoginForm>
  </div>
</Login>
```

## ✅ Acceptance Criteria

- [ ] Login page terlihat sesuai design
- [ ] Form validation bekerja dengan baik
- [ ] Error handling menampilkan pesan yang jelas
- [ ] Loading state terlihat saat login
- [ ] Redirect ke dashboard setelah login success
- [ ] Token disimpan di localStorage
- [ ] Responsive untuk mobile & desktop

## 🔗 Dependencies

- Task 01: Setup Project Foundation (harus selesai dulu)
- API endpoint: `POST /api/v1/admin/auth/login` (belum ada, perlu dibuat)

## 📚 References

- `COLOR_REFERENCE.md` - Colors untuk error states
- `PRD.md` Section 4.1 - Admin Authentication requirements

---

**Status**: ⏳ Pending  
**Estimated Time**: 3-4 hours  
**Dependencies**: Task 01
