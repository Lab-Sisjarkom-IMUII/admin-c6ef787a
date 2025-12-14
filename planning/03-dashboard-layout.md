# Task 03: Dashboard Layout

## 📋 Overview
Membuat layout dashboard dengan sidebar navigation dan header untuk admin panel.

## ✅ Checklist

### 1. Create Dashboard Layout Component
- [ ] Create `src/components/layout/DashboardLayout.jsx`
- [ ] Setup layout structure (sidebar + main content)
- [ ] Add responsive behavior (mobile sidebar toggle)
- [ ] Implement protected route wrapper

### 2. Create Sidebar Navigation
- [ ] Create `src/components/layout/Sidebar.jsx`
- [ ] Add menu items:
  - Dashboard Overview
  - Monitoring VPS
  - Subdomain Management
  - Project Management
  - Portfolio Management
- [ ] Add active state styling
- [ ] Add icons untuk setiap menu item
- [ ] Add collapse/expand functionality (optional)

### 3. Create Header Component
- [ ] Create `src/components/layout/Header.jsx`
- [ ] Add page title
- [ ] Add user info (admin name, role)
- [ ] Add logout button
- [ ] Add notification icon (optional)

### 4. Implement Protected Routes
- [ ] Create `src/components/auth/ProtectedRoute.jsx`
- [ ] Check authentication status
- [ ] Redirect ke login jika tidak authenticated
- [ ] Check role permissions (super_admin vs admin)

## 🎨 Design Requirements

### Layout Structure
```
┌─────────────────────────────────────┐
│ Header (fixed top)                  │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │ Main Content Area        │
│ (fixed)  │ (scrollable)             │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

### Sidebar
- Width: 256px (desktop), 280px saat expanded
- Background: `bg-[--card]` dengan glass effect
- Border: Right border dengan `border-[--border]`
- Active menu: Primary color background dengan glow
- Hover: Subtle background change

### Header
- Height: 64px
- Background: `bg-[--card]` dengan glass effect
- Border: Bottom border dengan `border-[--border]`
- Padding: 1rem horizontal

### Colors
- Sidebar background: Card color dengan glass
- Active menu: Primary color dengan opacity
- Text: Foreground color
- Icons: Primary color

## 📝 Files to Create

1. `src/components/layout/DashboardLayout.jsx` - Main layout
2. `src/components/layout/Sidebar.jsx` - Sidebar navigation
3. `src/components/layout/Header.jsx` - Header component
4. `src/components/auth/ProtectedRoute.jsx` - Protected route wrapper

## 📐 Component Structure

```jsx
<DashboardLayout>
  <Header>
    <PageTitle />
    <UserInfo />
    <LogoutButton />
  </Header>
  <div className="flex">
    <Sidebar>
      <MenuItem active>Monitoring VPS</MenuItem>
      <MenuItem>Subdomain Management</MenuItem>
      <MenuItem>Project Management</MenuItem>
      <MenuItem>Portfolio Management</MenuItem>
    </Sidebar>
    <main className="flex-1">
      {children}
    </main>
  </div>
</DashboardLayout>
```

## ✅ Acceptance Criteria

- [ ] Layout responsive untuk desktop & mobile
- [ ] Sidebar navigation bekerja dengan baik
- [ ] Active menu state terlihat jelas
- [ ] Protected routes redirect ke login jika tidak authenticated
- [ ] Header menampilkan user info dengan benar
- [ ] Logout button berfungsi
- [ ] Mobile sidebar bisa toggle

## 🔗 Dependencies

- Task 01: Setup Project Foundation
- Task 02: Login Page (untuk auth context)

## 📚 References

- `COLOR_REFERENCE.md` - Colors untuk sidebar & header
- `PRD.md` - Layout requirements

---

**Status**: ⏳ Pending  
**Estimated Time**: 4-5 hours  
**Dependencies**: Task 01, Task 02
