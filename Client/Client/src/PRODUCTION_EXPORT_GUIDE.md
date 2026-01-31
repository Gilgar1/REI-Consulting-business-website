# REI Consulting Firm - Production Export Guide

## ⚠️ CRITICAL: Ensure Nothing Gets Lost During Export

This document outlines everything needed to successfully export this website to production-ready React.js code without losing any features, assets, or functionality.

---

## 📦 Required Assets

### 1. **Images from Figma Assets**
The following assets are imported using the `figma:asset` scheme and MUST be exported:

```typescript
// Logo
import logo from "figma:asset/8cf545153b4e8bb9205a6ccf5469b7e077514441.png";

// Hero Slider Images
import founderPhoto from "figma:asset/53562da4abfa0bc167e37598fff2c861ff2fe35d.png";
import buildingPhoto from "figma:asset/8bf12cbe120838ab7f3586f269745cde5f2c498b.png";
```

**Action Required:**
- Export these assets from Figma
- Place them in a `/public/assets/` or `/src/assets/` folder
- Update import paths to relative paths:
  ```typescript
  import logo from "../assets/logo.png";
  import founderPhoto from "../assets/founder-photo.png";
  import buildingPhoto from "../assets/building-photo.png";
  ```

### 2. **External Images (Unsplash)**
The website uses Unsplash images for:
- Core Services Section (6 service cards)
- Hero Slider backgrounds (slides 3, 4, 5)
- Various page headers

**These are loaded via HTTPS URLs and will work in production as-is.**

---

## 🎨 Critical Styling Elements

### 1. **Custom Tailwind Configuration**
The website uses Tailwind CSS v4.0 with custom tokens defined in `/styles/globals.css`:

```css
@theme {
  --color-royal-blue: #0B1F3A;
  --color-gold: #D4AF37;
  --color-emerald: #1F7A4F;
  --color-ivory: #FDFBF7;
  --color-slate: #475569;
  
  --font-family-montserrat: 'Montserrat', sans-serif;
  --font-family-inter: 'Inter', sans-serif;
  --font-family-playfair: 'Playfair Display', serif;
}
```

**Action Required:**
- Ensure `globals.css` is imported in your root component
- Include Google Fonts in `index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">
  ```

### 2. **Typography System**
Default typography is set in `globals.css` - DO NOT override with Tailwind classes unless specifically needed.

---

## 🔧 Component Structure

### Core Components
```
/components
  ├── Navigation.tsx          ✅ Logo, nav items, mobile menu
  ├── Footer.tsx              ✅ Logo, contact info, links
  
  /home
    ├── HeroSlider.tsx        ✅ 5-slide hero with 10-second intervals
    ├── ServicesOverview.tsx  ✅ 6-card masonry grid
    ├── WhoWeAre.tsx          ✅ Staggered animations
    ├── WhyChooseUs.tsx       ✅ 3-column benefits
    ├── Testimonials.tsx      ✅ Client testimonials
    ├── FinalCTA.tsx          ✅ Final call-to-action (quote removed)
```

### Pages
```
/pages
  ├── HomePage.tsx           ✅ Main landing page
  ├── AboutPage.tsx          ✅ About + Founder bio
  ├── ServicesPage.tsx       ✅ All services overview
  ├── BlogPage.tsx           ✅ Blog posts grid
  ├── ContactPage.tsx        ✅ Contact form + info
  ├── ListingsPage.tsx       ✅ Property listings
  
  /services
    ├── LoanAssistancePage.tsx
    ├── DocumentationPage.tsx
    ├── VerificationPage.tsx
    ├── RentalManagementPage.tsx
    ├── DiasporaStrategyPage.tsx
```

---

## ⚙️ Key Features to Preserve

### 1. **Hero Slider Configuration**
- **Auto-play interval:** 10 seconds (10000ms)
- **Slides:** 5 total slides
- **Features:** Navigation arrows, dot indicators, auto-pause on manual navigation
- **Location:** `/components/home/HeroSlider.tsx` line 66-67

### 2. **Animation System**
- Scroll-triggered animations using IntersectionObserver
- Staggered delays for sequential element appearances
- Preserved in: ServicesOverview, WhoWeAre, WhyChooseUs

### 3. **Contact Information**
```
Phone: +237 681 478 111
WhatsApp: +237 681 478 111 (links to https://wa.me/237681478111)
Email: reiconsultingcm@gmail.com
Location: Yaoundé, Cameroon
```

### 4. **Logo Sizes**
- **Navigation:** h-20 (mobile) / h-24 (desktop)
- **Footer:** h-20

### 5. **Core Services Section**
- **Layout:** CSS Grid masonry with 6 cards
- **Card Heights:**
  - Cards 1 & 4: Tall (row-span-2)
  - Cards 2 & 3: Medium (row-span-1) - SAME HEIGHT
  - Cards 5 & 6: Short (row-span-1)
- **Overlay:** Dark black overlay for text readability
- **Animation:** Staggered entrance (0ms, 100ms, 200ms, 300ms, 400ms, 500ms)

---

## 📝 Dependencies

### Required NPM Packages
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "lucide-react": "latest",
    "tailwindcss": "^4.0.0"
  }
}
```

### Import Statements
All components use standard ES6 imports. No special loaders needed except for assets.

---

## 🚀 Production Build Steps

### 1. **Asset Migration**
```bash
# Copy figma assets to public folder
cp figma:asset/* public/assets/

# Update imports in:
# - /components/Navigation.tsx
# - /components/Footer.tsx
# - /components/home/HeroSlider.tsx
```

### 2. **Verify All Imports**
Search for `figma:asset` and replace with relative paths:
```bash
# Find all figma:asset imports
grep -r "figma:asset" .
```

### 3. **Build Configuration**
Ensure your `package.json` has:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 4. **Environment Check**
- ✅ All images load correctly
- ✅ Fonts render properly
- ✅ Colors match brand guide
- ✅ Animations work smoothly
- ✅ All links/buttons functional
- ✅ Mobile responsive
- ✅ WhatsApp links working

---

## 🎯 Final Checklist

### Visual Elements
- [ ] Logo displays at correct size in navigation and footer
- [ ] All 5 hero slides rotate every 10 seconds
- [ ] Core services section shows 6 cards in masonry layout
- [ ] Text is readable on all service cards (dark overlay)
- [ ] All animations trigger on scroll
- [ ] Brand colors (Royal Blue, Gold, Emerald) render correctly

### Functionality
- [ ] Navigation menu works on mobile and desktop
- [ ] All page transitions smooth
- [ ] Contact forms have proper placeholders
- [ ] WhatsApp button links to correct number
- [ ] Email displays correctly: reiconsultingcm@gmail.com
- [ ] Phone displays correctly: +237 681 478 111

### Content
- [ ] Founder quote removed from FinalCTA section
- [ ] All service descriptions accurate
- [ ] Contact information consistent across pages
- [ ] No placeholder text remaining

### Performance
- [ ] Images optimized for web
- [ ] No console errors
- [ ] Smooth scrolling behavior
- [ ] Fast initial load time

---

## 📧 Support

If any issues arise during export, check:
1. Asset paths are relative, not absolute
2. Tailwind config includes custom theme
3. Google Fonts are loaded in HTML
4. All dependencies installed via npm

---

**Last Updated:** December 10, 2025  
**Framework:** React 18 + TypeScript  
**Styling:** Tailwind CSS v4.0  
**Build Tool:** Vite
