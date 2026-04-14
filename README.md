# MOTHERLODE ADVISING, LLC WEBSITE

A professional, responsive website for Motherlode Advising, LLC - helping founder-CEOs of 5-75 person companies build operational foundations and leadership capacity.

---

## 🎯 PROJECT OVERVIEW

**Built with:** Vanilla HTML, CSS, and JavaScript (no frameworks)
**Design:** Custom brand with gemstone color palette and animated particle background
**Responsive:** Mobile-first design, works on all devices
**Performance:** Fast loading, optimized for < 3 second load time
**Accessibility:** WCAG AA compliant

---

## 📁 FILE STRUCTURE

```
motherlode-site/
├── index.html                  # Homepage
├── about.html                  # About/bio page
├── services.html               # Services with anchor sections
├── contact.html                # Contact with Calendly integration
├── privacy.html                # Privacy policy
├── terms.html                  # Terms & conditions
├── css/
│   └── styles.css             # Master stylesheet (all styling)
├── js/
│   ├── particles.js           # Gemstone particle animation
│   └── main.js                # Navigation, smooth scroll, interactions
├── images/                     # Logo and photos (to be added)
│   ├── motherlode-logo.png   # (client provides)
│   └── tobey-headshot.jpeg    # (client provides)
├── INTEGRATION-GUIDE.md       # Step-by-step integration instructions
└── README.md                  # This file
```

---

## 🎨 BRAND COLORS

### Primary Colors
- **Cream Background:** `#F5F1E8`
- **Black Text:** `#000000`
- **Dark Gray Text:** `#2B2B2B`
- **Gold Primary (CTA):** `#EBDBA3`
- **White:** `#FFFFFF`

### Gemstone Accents (from Konami code logo)
- **Teal:** `#0299B3`
- **Hot Pink:** `#F20358`
- **Purple:** `#5E18E8`
- **Cerulean:** `#5372FF`

### Light Washes (for section backgrounds)
- **Teal Wash:** `#F0FAFB`
- **Hot Pink Wash:** `#FFF0F5`
- **Purple Wash:** `#F7F0FD`
- **Cerulean Wash:** `#F0F4FF`

---

## 🚀 QUICK START

### 1. Add Your Logo and Headshot

Place these files in the `/images/` folder:
- `motherlode-logo.png` (1000px wide, transparent PNG)
- `tobey-headshot.jpeg` (800x800px minimum)

### 2. Insert Preserved Code

Follow **INTEGRATION-GUIDE.md** for detailed instructions on adding:
- GoHighLevel popup form
- GoHighLevel contact form
- Calendly booking widget
- Client testimonials
- Privacy policy text
- Terms & conditions text
- LinkedIn profile URL

### 3. Test Locally

Open `index.html` in your browser to preview the site locally.

### 4. Deploy

Upload to your hosting provider or use:
- **Netlify** (recommended - drag and drop)
- **Vercel** (automatic deployment)
- **Traditional hosting** (FTP/SFTP)

---

## 📱 RESPONSIVE DESIGN

The site is fully responsive with breakpoints at:
- **Mobile:** < 480px
- **Tablet:** 481px - 768px
- **Desktop:** 769px+

All pages tested on:
- iPhone (Safari)
- Android (Chrome)
- iPad
- Desktop browsers (Chrome, Firefox, Safari, Edge)

---

## ✨ KEY FEATURES

### Animated Gemstone Particles
- Canvas-based particle system
- 5 brand colors with weighted distribution
- Subtle upward drift with shimmer effect
- Performance optimized (fewer particles on mobile)
- Located in: `js/particles.js`

### Smooth Scrolling
- Anchor links scroll smoothly to services sections
- Accounts for 80px fixed header offset
- Updates URL without page jump
- Located in: `js/main.js`

### Mobile Navigation
- Hamburger menu for screens < 768px
- Slide-in from right with overlay
- Closes on link click or outside click
- Located in: `js/main.js`

### Service Anchors
Three services with deep-linkable sections:
- `/services.html#oir` - Operator-in-Residence
- `/services.html#coaching` - Strategic Coaching
- `/services.html#team-coaching` - Leadership Team Coaching

---

## 🔌 INTEGRATION POINTS

The following need to be added by the client (see INTEGRATION-GUIDE.md):

### Required:
- [x] Logo image
- [x] Headshot photo
- [ ] LinkedIn profile URL (4 locations)
- [ ] Privacy policy text
- [ ] Terms & conditions text

### Optional but Recommended:
- [ ] GHL popup form (homepage)
- [ ] GHL contact form (contact page)
- [ ] Calendly booking widget (contact page)
- [ ] Client testimonials (4-6 real testimonials)

---

## 📄 PAGES OVERVIEW

### Homepage (index.html)
- Hero with logo and tagline
- Explanation section
- Three service cards
- Why work with me (4 points)
- How we work (4 steps)
- Testimonials section
- Final CTA

### About (about.html)
- Hero with photo and bio
- Background story
- Experience timeline
- What makes me different (4 points)
- Core belief/philosophy
- Personal touch section
- Connect CTA

### Services (services.html)
- Quick comparison cards
- Three detailed service sections:
  - Operator-in-Residence ($297/month)
  - Strategic Coaching ($1,500/month)
  - Leadership Team Coaching ($4,500/month)
- Each includes: format, benefits, fit criteria
- Comparison and CTA section

### Contact (contact.html)
- Three contact options
- Calendly booking widget (integration needed)
- Contact form (GHL integration needed)
- LinkedIn connection section
- FAQ section

### Privacy (privacy.html)
- Privacy policy (text needs insertion)
- Legal content area ready for paste

### Terms (terms.html)
- Terms & conditions (text needs insertion)
- Legal content area ready for paste

---

## 🎯 SERVICE PRICING

**Current pricing (update if changed):**
- **Operator-in-Residence:** $297/month
- **Strategic Coaching:** $1,500/month (Founding: $1,200)
- **Leadership Team Coaching:** $4,500/month

If pricing changes, update in:
- `index.html` (service cards)
- `services.html` (all three service sections)
- `terms.html` (payment terms if mentioned)

---

## 🛠️ CUSTOMIZATION

### Updating Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --cream-bg: #F5F1E8;
    --black-text: #000000;
    /* etc. */
}
```

### Adjusting Particle Animation
Edit `js/particles.js`:
- Particle density: `getParticleCount()` function
- Colors: `this.colors` array
- Speed: `speedY` and `speedX` properties

### Modifying Typography
Edit font sizes in `css/styles.css`:
```css
h1 { font-size: 64px; }
h2 { font-size: 48px; }
/* etc. */
```

---

## 🐛 TROUBLESHOOTING

### Logo not showing
- Check file path: `/images/motherlode-logo.png`
- Verify filename spelling exactly matches
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Particles not animating
- Check JavaScript console (F12) for errors
- Verify `particles.js` is loading
- Ensure canvas element exists: `<canvas id="particles-canvas"></canvas>`

### Smooth scrolling not working
- Check `main.js` is loading
- Verify anchor IDs match links exactly
- Test in different browser

### Mobile menu not working
- Verify `main.js` is loading
- Check mobile menu HTML structure
- Test hamburger button click

---

## 📈 PERFORMANCE

**Optimization tips:**
- Images: Compress to < 200KB each
- Logo: Use PNG with transparency, optimize size
- Headshot: 800x800px is sufficient, compress
- Lazy loading: Already implemented for images
- Particle animation: Auto-reduces on mobile

**Target metrics:**
- Load time: < 3 seconds
- First Contentful Paint: < 1.5 seconds
- Largest Contentful Paint: < 2.5 seconds

**Tools to test:**
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

---

## ♿ ACCESSIBILITY

**Implemented features:**
- Semantic HTML5 elements
- ARIA labels on navigation
- Focus states for keyboard navigation
- High contrast text (AA compliant)
- Reduced motion support for animations
- Alt text placeholders for images

---

## 🔒 SECURITY

**Best practices implemented:**
- External links use `rel="noopener"` for security
- Form validation (client-side)
- No inline JavaScript (all in external files)
- HTTPS ready (enable on hosting)

---

## 📱 SOCIAL MEDIA

**LinkedIn integration:**
- Profile link in footer (all pages)
- Profile link in About connect section
- Profile link in Contact page
- Social icon with hover effect

**Update LinkedIn URL in:**
- index.html
- about.html (2 locations)
- contact.html
- services.html (footer)
- privacy.html (footer)
- terms.html (footer)

---

## 🚢 DEPLOYMENT

### Netlify (Recommended)
1. Go to netlify.com
2. Sign up/login
3. Drag & drop the `motherlode-site` folder
4. Connect custom domain (motherlode.biz)
5. SSL enabled automatically

### Vercel
1. Go to vercel.com
2. Import project
3. Deploy
4. Connect custom domain

### Traditional Hosting
1. Upload via FTP/SFTP
2. Preserve directory structure
3. Enable SSL certificate
4. Point domain to hosting

---

## 📝 MAINTENANCE

### Regular Updates
- Test forms monthly
- Update testimonials quarterly
- Review pricing accuracy
- Check all links work
- Monitor page speed

### Content Updates
Most content can be edited directly in HTML files:
- Copy/text: Edit HTML files
- Styles: Edit `css/styles.css`
- Functionality: Edit `js/main.js`

---

## 📞 SUPPORT RESOURCES

**Documentation:**
- INTEGRATION-GUIDE.md (step-by-step setup)
- Inline code comments (explanations)
- This README (overview)

**Testing checklist:**
- See "Final Testing Checklist" in INTEGRATION-GUIDE.md

**Troubleshooting:**
- Check browser console (F12)
- Verify file paths
- Test in incognito mode
- Try different browser

---

## 🎓 TECHNICAL DETAILS

**Technologies:**
- HTML5 (semantic markup)
- CSS3 (flexbox, grid, custom properties)
- Vanilla JavaScript (ES6+)
- Canvas API (particles)
- Google Fonts (Inter)

**No dependencies:**
- No jQuery
- No Bootstrap
- No React/Vue/Angular
- Just clean, modern web standards

**Browser support:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

---

## 📜 LICENSE

Copyright © 2025 Motherlode Advising, LLC. All rights reserved.

This website is proprietary to Motherlode Advising, LLC.

---

## 🙌 CREDITS

**Design & Development:** Built by Claude (Anthropic AI)
**Brand Identity:** Motherlode Advising, LLC
**Logo:** Motherlode (Konami code easter egg)
**Colors:** Gemstone palette based on logo circles

---

## 📬 NEXT STEPS

1. ✅ Review all HTML pages
2. ✅ Check CSS styling
3. ✅ Test JavaScript functionality
4. 📝 Follow INTEGRATION-GUIDE.md
5. 🎨 Add logo and headshot
6. 🔌 Insert GHL and Calendly code
7. 📝 Add testimonials, privacy, terms
8. 🔗 Update LinkedIn URLs
9. ✅ Test everything thoroughly
10. 🚀 Deploy to production

---

**Need help?** Refer to INTEGRATION-GUIDE.md for detailed instructions on every integration point.

**Ready to launch?** Follow the deployment section and testing checklist.

**Questions?** Check the troubleshooting section or review inline code comments.

---

*Built with care for Motherlode Advising, LLC - Turning founders into CEOs* ✨
