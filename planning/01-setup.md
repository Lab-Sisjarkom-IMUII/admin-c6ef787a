# Task 01: Setup Project Foundation

## 📋 Overview
Setup dasar project: theme system, CSS variables, dan struktur folder.

## ✅ Checklist

### 1. Setup CSS Variables & Theme
- [ ] Update `src/index.css` dengan CSS variables dari COLOR_REFERENCE.md
- [ ] Setup dark mode sebagai default
- [ ] Setup light mode override
- [ ] Add gradient backgrounds (dark & light mode)
- [ ] Add glass morphism utilities

### 2. Setup Tailwind Config
- [ ] Configure Tailwind untuk menggunakan CSS variables
- [ ] Add custom colors (primary, accent, status colors)
- [ ] Add custom utilities (glass, gradients)

### 3. Create Folder Structure
- [ ] Create `src/components/` folder
- [ ] Create `src/pages/` folder
- [ ] Create `src/contexts/` folder
- [ ] Create `src/hooks/` folder
- [ ] Create `src/utils/` folder

### 4. Setup Base Components
- [ ] Create `src/components/ui/Button.jsx` (base button component)
- [ ] Create `src/components/ui/Card.jsx` (base card component)
- [ ] Create `src/components/ui/Input.jsx` (base input component)

## 🎨 Design Requirements

### CSS Variables (Dark Mode - Default)
```css
:root {
  --background: #0B0B0E;
  --foreground: #E5E7EB;
  --muted: #0f1014;
  --card: #0d0e12;
  --border: #1c1f27;
  --primary: #7C3AED;
  --primary-foreground: #0b0b0b;
  --accent: #0D9488;
  --glass-bg: rgba(255,255,255,0.06);
}
```

### CSS Variables (Light Mode)
```css
html.light {
  --background: #ffffff;
  --foreground: #111827;
  --muted: #f5f7fb;
  --card: #ffffff;
  --border: #e6e6ef;
  --primary: #7C3AED;
  --primary-foreground: #ffffff;
  --accent: #0D9488;
  --glass-bg: rgba(0,0,0,0.02);
}
```

### Background Gradients
- Dark mode: Radial gradients dengan primary & accent colors
- Light mode: Subtle gradients dengan grid pattern

## 📝 Files to Create/Modify

1. `src/index.css` - Update dengan theme system
2. `src/components/ui/Button.jsx` - Base button component
3. `src/components/ui/Card.jsx` - Base card component
4. `src/components/ui/Input.jsx` - Base input component

## ✅ Acceptance Criteria

- [ ] CSS variables sesuai COLOR_REFERENCE.md
- [ ] Dark mode sebagai default
- [ ] Light mode bisa di-toggle
- [ ] Background gradients terlihat dengan baik
- [ ] Base components menggunakan theme colors
- [ ] Folder structure sudah lengkap

## 🔗 Dependencies

- Tailwind CSS v4 (sudah terinstall)
- React 19 (sudah terinstall)

## 📚 References

- `COLOR_REFERENCE.md` - Color system
- `PRD.md` - Requirements

---

**Status**: ⏳ Pending  
**Estimated Time**: 2-3 hours
