# MOTHERLODE ADVISING, LLC WEBSITE - INTEGRATION GUIDE

This guide provides step-by-step instructions for adding your preserved content, code, and assets to the new website.

---

## TABLE OF CONTENTS

1. [Adding Logo and Images](#1-adding-logo-and-images)
2. [Inserting GHL Popup Form](#2-inserting-ghl-popup-form)
3. [Inserting GHL Contact Form](#3-inserting-ghl-contact-form)
4. [Inserting Calendly Booking Widget](#4-inserting-calendly-booking-widget)
5. [Adding Testimonials](#5-adding-testimonials)
6. [Inserting Privacy Policy Text](#6-inserting-privacy-policy-text)
7. [Inserting Terms & Conditions Text](#7-inserting-terms--conditions-text)
8. [Adding LinkedIn URL](#8-adding-linkedin-url)
9. [Final Testing Checklist](#9-final-testing-checklist)

---

## 1. ADDING LOGO AND IMAGES

### Logo (motherlode-logo.png)

**What you need:**
- Your Motherlode logo file (with the Konami code circles)
- Recommended size: 1000px wide, transparent PNG
- File name: `motherlode-logo.png`

**Where to place it:**
```
/motherlode-site/images/motherlode-logo.png
```

**Used on these pages:**
- `index.html` - Header and hero section
- `about.html` - Header
- `services.html` - Header
- `contact.html` - Header
- `privacy.html` - Header
- `terms.html` - Header

**How to verify it works:**
1. Place logo file in `/images/` folder
2. Open any page in browser
3. Logo should appear in top-left header and homepage hero

---

### Headshot (tobey-headshot.jpeg)

**What you need:**
- Professional headshot photo
- Recommended size: 800x800px minimum
- File name: `tobey-headshot.jpeg` (or .png)

**Where to place it:**
```
/motherlode-site/images/tobey-headshot.jpeg
```

**Used on:**
- `about.html` - About hero section (left side)

**If your filename is different:**
Update line in `about.html`:
```html
<!-- Change this line: -->
<img src="images/tobey-headshot.jpeg" alt="Tobey Wyatt">

<!-- To match your filename: -->
<img src="images/YOUR-FILENAME.jpg" alt="Tobey Wyatt">
```

---

## 2. INSERTING GHL POPUP FORM

### Finding the code on your current site

**Option A: From GoHighLevel Dashboard**
1. Log into GoHighLevel
2. Go to Sites → Forms
3. Find your popup form
4. Click "Get Code"
5. Copy the FULL script tag

**Option B: From your current website source**
1. Visit your current motherlode.biz site
2. Right-click → "View Page Source"
3. Search for "gohighlevel" or "leadconnector"
4. Copy the complete `<script>` tag

**The code will look something like this:**
```html
<script type="text/javascript" src="https://link.msgsndr.com/js/form_embed.js"></script>
<script>
  // GHL form configuration
</script>
```

### Where to paste it

**File:** `index.html`

**Location:** Just before the closing `</body>` tag (bottom of file)

**Look for this comment:**
```html
<!-- ========================================
     GHL POPUP FORM INSERTION POINT
     ========================================
     Paste your GoHighLevel popup form script here
     (just before the closing </body> tag)
     Look for <script> tags from your current site
     ======================================== -->
```

**Paste your GHL popup script BELOW this comment, ABOVE:**
```html
<!-- JavaScript -->
<script src="js/particles.js"></script>
```

### Testing

1. Load homepage in browser
2. The popup should appear based on your GHL trigger settings (time delay, scroll depth, exit intent, etc.)
3. Test form submission to verify it connects to GHL

---

## 3. INSERTING GHL CONTACT FORM

### Finding the code

**From GoHighLevel:**
1. Log into GoHighLevel
2. Go to Sites → Forms
3. Find your contact form
4. Click "Get Code"
5. Choose "Inline Embed" (not popup)
6. Copy the code

**The code might be:**
- An `<iframe>` embed
- A `<form>` with data attributes
- A `<div>` with a script

### Where to paste it

**File:** `contact.html`

**Location:** In the "Contact Form Section"

**Look for this comment:**
```html
<!-- ========================================
     GHL CONTACT FORM INSERTION POINT
     ========================================
     
     OPTION 1: GoHighLevel Form
     Copy your GHL form embed code and paste it here
     
     OPTION 2: Simple Fallback Form
     If you don't have GHL form ready yet, use the
     fallback form below and replace it later
     
     ======================================== -->
```

### What to replace

**Delete this entire section:**
```html
<!-- FALLBACK CONTACT FORM (replace with GHL form when ready) -->
<div class="form-container">
    <form action="#" method="POST" class="contact-form">
        [... entire form ...]
    </form>
</div>
<!-- END FALLBACK FORM -->
```

**Replace with your GHL form code**

### Testing

1. Load contact page
2. Fill out form
3. Submit test entry
4. Verify submission appears in GHL

---

## 4. INSERTING CALENDLY BOOKING WIDGET

### Finding your Calendly embed code

1. Log into Calendly
2. Go to the event type you want to embed (Discovery Call)
3. Click "Share" or "Copy Link"
4. Select "Add to Website"
5. Choose "Inline Embed"
6. Copy BOTH:
   - The inline widget `<div>` code
   - The script tag

**Example of what you'll copy:**
```html
<!-- Calendly inline widget begin -->
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/your-name/discovery-call" 
     style="min-width:320px;height:630px;">
</div>
<script type="text/javascript" 
        src="https://assets.calendly.com/assets/external/widget.js" 
        async>
</script>
<!-- Calendly inline widget end -->
```

### Where to paste it

**File:** `contact.html`

**Location 1: Inline widget in Calendly section**

Look for:
```html
<!-- ========================================
     CALENDLY INLINE WIDGET INSERTION POINT
     ======================================== -->
```

**Delete the placeholder:**
```html
<!-- TEMPORARY PLACEHOLDER (remove when adding real Calendly) -->
<div class="calendly-placeholder">
    [... placeholder content ...]
</div>
<!-- END TEMPORARY PLACEHOLDER -->
```

**Paste your Calendly `<div>` code** (the inline widget part only, not the script yet)

**Location 2: Script tag at bottom of page**

Look for:
```html
<!-- ========================================
     CALENDLY SCRIPT TAG INSERTION POINT
     ======================================== -->
```

**Paste your Calendly `<script>` tag here**

### Also add the CSS (if needed)

At the top of `contact.html` in the `<head>` section, look for:
```html
<!-- ========================================
     CALENDLY STYLESHEET (if needed)
     ======================================== -->
```

Add this if Calendly requires it (usually included automatically):
```html
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
```

### Testing

1. Load contact page
2. Scroll to booking section
3. Calendly widget should load and show your availability
4. Test booking an appointment
5. Verify booking appears in your Calendly

---

## 5. ADDING TESTIMONIALS

### Where to add them

**File:** `index.html`

**Section:** "What Founders Say" section

**Look for this comment:**
```html
<!-- ========================================
     CLIENT TESTIMONIALS INSERTION POINT
     ======================================== -->
```

### Format for each testimonial

**Copy this structure for EACH testimonial:**

```html
<div class="testimonial-card">
    <div class="quote-icon teal">"</div>
    <p class="testimonial-quote">
        [Full testimonial text here - keep it 2-4 sentences for best display]
    </p>
    <div class="testimonial-author">[Client Full Name]</div>
    <div class="testimonial-title">[Title], [Company Name]</div>
</div>
```

### Color rotation for quote icons

Rotate these colors to add visual variety:
- `teal` - Teal accent
- `purple` - Purple accent
- `hot-pink` - Hot pink accent
- `cerulean` - Cerulean blue accent

**Example pattern:**
```html
<!-- Testimonial 1 -->
<div class="quote-icon teal">"</div>

<!-- Testimonial 2 -->
<div class="quote-icon purple">"</div>

<!-- Testimonial 3 -->
<div class="quote-icon cerulean">"</div>

<!-- Testimonial 4 -->
<div class="quote-icon hot-pink">"</div>

<!-- Testimonial 5 - start over -->
<div class="quote-icon teal">"</div>
```

### What to replace

**Delete these placeholder testimonials:**
```html
<!-- Example Testimonial 1 (REPLACE WITH REAL) -->
<div class="testimonial-card">
    [... placeholder content ...]
</div>
```

**Replace with your REAL client testimonials**

### How many to add

- Minimum: 4 testimonials
- Recommended: 4-6 testimonials
- Maximum: 8 testimonials (then it gets too long)

The testimonials will automatically arrange in a 2-column grid (1 column on mobile).

---

## 6. INSERTING PRIVACY POLICY TEXT

### Where to get the text

**Option 1: Copy from your current site**
1. Go to your current motherlode.biz/privacy page
2. Select ALL the privacy policy text
3. Copy it

**Option 2: Use your privacy policy document**
If you have a separate document, copy the full text

### Where to paste it

**File:** `privacy.html`

**Look for this section:**
```html
<!-- ========================================
     PRIVACY POLICY TEXT INSERTION POINT
     ======================================== -->
```

### What to replace

**Delete everything between these comments:**
```html
<!-- PRIVACY POLICY CONTENT STARTS HERE -->
[... all placeholder content including the orange warning box ...]
<!-- PRIVACY POLICY CONTENT ENDS HERE -->
```

### How to format it

**Keep your existing structure**, but ensure:
- Main sections use `<h2>` tags
- Subsections use `<h3>` or `<h4>` tags
- Paragraphs use `<p>` tags
- Lists use `<ul>` and `<li>` tags

**Example formatting:**
```html
<div class="legal-content">
    <h2>1. Introduction</h2>
    <p>
        Your introduction text here...
    </p>
    
    <h2>2. Information We Collect</h2>
    <p>
        Your collection details here...
    </p>
    
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
    </ul>
    
    [... continue with all sections ...]
</div>
```

### Update the date

At the top of privacy.html, find:
```html
<span id="last-updated-date">[Insert Date]</span>
```

Replace `[Insert Date]` with your actual date, for example:
```html
<span id="last-updated-date">October 28, 2025</span>
```

### IMPORTANT

- Do NOT edit any legal language
- Do NOT remove any sections
- Keep ALL disclaimers and notices exactly as written
- Verify your contact information is correct

---

## 7. INSERTING TERMS & CONDITIONS TEXT

### Where to get the text

**Option 1: Copy from your current site**
1. Go to your current motherlode.biz/terms page
2. Select ALL the terms text
3. Copy it

**Option 2: Use your terms document**
If you have a separate document, copy the full text

### Where to paste it

**File:** `terms.html`

**Look for this section:**
```html
<!-- ========================================
     TERMS & CONDITIONS TEXT INSERTION POINT
     ======================================== -->
```

### What to replace

**Delete everything between these comments:**
```html
<!-- TERMS & CONDITIONS CONTENT STARTS HERE -->
[... all placeholder content including the orange warning box ...]
<!-- TERMS & CONDITIONS CONTENT ENDS HERE -->
```

### How to format it

Use the same formatting guidelines as the Privacy Policy:
- Main sections: `<h2>` tags
- Subsections: `<h3>` or `<h4>` tags
- Paragraphs: `<p>` tags
- Lists: `<ul>` and `<li>` tags

### Update the date

At the top of terms.html, find:
```html
<span id="last-updated-date">[Insert Date]</span>
```

Replace with your actual date.

### IMPORTANT

- Do NOT edit any legal language
- Ensure pricing matches your current service offerings:
  - Operator-in-Residence: $297/month
  - Strategic Coaching: $1,500/month (Founding: $1,200)
  - Leadership Team Coaching: $4,500/month
- Verify all cancellation and refund policies are current
- Keep ALL legal disclaimers intact

---

## 8. ADDING LINKEDIN URL

Your LinkedIn URL appears in **multiple locations** on the site. You'll need to update it in several files.

### What you need

Your LinkedIn profile URL, format:
```
https://linkedin.com/in/YOUR-USERNAME
```

**To find it:**
1. Go to your LinkedIn profile
2. Click "Edit public profile & URL" (top right)
3. Copy your custom URL
4. Or just copy from your browser address bar

### Where to update it

**Search for this in ALL HTML files:**
```html
<!-- LINKEDIN URL INSERTION POINT -->
```

**Files that need LinkedIn URL:**

#### 1. index.html (Homepage footer)
Find:
```html
<!-- ========================================
     LINKEDIN URL INSERTION POINT #1
     ======================================== -->
<a href="#" class="social-icon">
```

Replace `#` with your LinkedIn URL

#### 2. about.html (Two locations)

**Location A: Connect section**
```html
<!-- ========================================
     LINKEDIN URL INSERTION POINT #2
     ======================================== -->
<a href="#" class="btn btn-outline">
```

**Location B: Footer**
```html
<!-- ========================================
     LINKEDIN URL INSERTION POINT #3
     ======================================== -->
<a href="#" class="social-icon">
```

#### 3. contact.html
```html
<!-- ========================================
     LINKEDIN URL INSERTION POINT #4
     ======================================== -->
<a href="#" class="btn btn-primary">
```

#### 4. All other pages (services.html, privacy.html, terms.html)

Footer sections all have:
```html
<a href="#" class="social-icon">
```

Update ALL instances of `href="#"` in LinkedIn links.

### Quick find-and-replace method

**Search for:** `<a href="#" class="social-icon"`

**Replace with:** `<a href="https://linkedin.com/in/YOUR-USERNAME" class="social-icon"`

**Or search for:** `Connect on LinkedIn</a>`

And update the parent link.

---

## 9. FINAL TESTING CHECKLIST

Before going live, test every aspect of the site.

### Visual Testing

- [ ] Logo displays correctly on all pages
- [ ] Headshot shows properly on About page
- [ ] All images load (no broken image icons)
- [ ] Gemstone particle animation works smoothly
- [ ] Colors match brand guidelines
- [ ] Typography looks consistent across pages

### Navigation Testing

- [ ] Header navigation works on desktop
- [ ] Mobile menu opens and closes properly
- [ ] Dropdown menu works (Services submenu)
- [ ] All internal links work correctly
- [ ] Services anchor links scroll to correct sections (#oir, #coaching, #team-coaching)
- [ ] Smooth scrolling works for anchor links
- [ ] Footer links go to correct pages

### Form & Integration Testing

- [ ] GHL popup appears based on your trigger settings
- [ ] GHL popup form submits successfully
- [ ] Contact form submits and appears in GHL
- [ ] Calendly widget loads and displays availability
- [ ] Test booking flows all the way through
- [ ] Form validation works (required fields, email format)

### Content Testing

- [ ] All testimonials display with correct names and titles
- [ ] Privacy policy text is complete and formatted
- [ ] Terms & conditions text is complete and formatted
- [ ] All LinkedIn links go to your profile
- [ ] Service pricing is accurate everywhere:
  - Homepage: $297, $1,500, $4,500
  - Services page: Same pricing with founding member note
- [ ] Contact information is correct (email, etc.)

### Mobile Responsive Testing

Test on actual devices or browser dev tools:

- [ ] iPhone/iOS Safari (portrait and landscape)
- [ ] Android Chrome (portrait and landscape)
- [ ] iPad/Tablet view
- [ ] Desktop (1920px, 1440px, 1280px widths)

**What to check:**
- [ ] Text is readable without zooming
- [ ] Images scale appropriately
- [ ] Navigation is usable
- [ ] Forms work on mobile
- [ ] Buttons are tappable (not too small)
- [ ] No horizontal scrolling
- [ ] Particle animation isn't too heavy on mobile

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**What to check:**
- [ ] Fonts load correctly
- [ ] Colors render accurately
- [ ] Animations work smoothly
- [ ] No console errors
- [ ] All features work

### Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Particle animation doesn't cause lag
- [ ] Images are optimized (not too large)
- [ ] No unnecessary scripts loading

**Tools to use:**
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### SEO & Meta Tags

- [ ] Page titles are set correctly
- [ ] Meta descriptions are present
- [ ] Open Graph tags work (test link sharing)
- [ ] Favicon displays in browser tab

---

## TROUBLESHOOTING COMMON ISSUES

### Logo not showing
- Verify file is in `/images/` folder
- Check filename matches exactly: `motherlode-logo.png`
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### GHL form not appearing
- Check script is in correct location (before `</body>`)
- Verify GHL form is published/active in dashboard
- Check browser console for errors (F12)
- Test in incognito/private browsing mode

### Calendly not loading
- Verify you copied BOTH the div AND the script tag
- Check script is at bottom of contact.html
- Ensure Calendly URL is correct and event is active
- Test in different browser

### Particle animation too heavy/laggy
- Animation automatically reduces particles on mobile
- If still laggy, you can reduce particle count in `js/particles.js`
- Find: `return Math.floor(baseCount * 0.5);`
- Change 0.5 to 0.3 for even fewer particles

### Smooth scrolling not working for anchors
- Verify anchor IDs match exactly: `id="oir"` → `href="#oir"`
- Check main.js is loading properly
- Test in different browser

### Mobile menu not closing
- Verify mobile-close button has correct class
- Check main.js is loading
- Test in browser dev tools mobile view

---

## DEPLOYMENT

Once everything is tested and working:

### Option 1: Netlify (Recommended for ease)

1. Create account at netlify.com
2. Drag and drop the entire `motherlode-site` folder
3. Netlify will automatically deploy
4. Connect your custom domain (motherlode.biz)
5. Enable HTTPS (automatic with Netlify)

### Option 2: Vercel

1. Create account at vercel.com
2. Import project from folder
3. Deploy
4. Connect custom domain

### Option 3: Traditional Hosting

1. Upload all files via FTP/SFTP to your host
2. Ensure directory structure is preserved
3. Set up SSL certificate for HTTPS
4. Point domain to hosting

---

## POST-LAUNCH CHECKLIST

After going live:

- [ ] Test all forms submit to GHL
- [ ] Verify Calendly bookings create actual appointments
- [ ] Test on real mobile devices
- [ ] Check Google Analytics is tracking (if installed)
- [ ] Submit sitemap to Google Search Console
- [ ] Test all integrations one more time
- [ ] Monitor for any errors in first 24 hours

---

## GETTING HELP

If you encounter issues:

1. **Check browser console** (F12) for error messages
2. **Try different browser** to isolate browser-specific issues
3. **Clear cache** before assuming something is broken
4. **Test in incognito** mode to rule out extensions
5. **Verify code** is in exact location specified in this guide

---

## MAINTENANCE NOTES

### Updating Service Pricing

If you change pricing, update in these locations:

**Files to update:**
- `index.html` - Service cards section
- `services.html` - All three service detail sections
- `terms.html` - Payment terms section (if pricing mentioned)

**Search for current prices:**
- $297
- $1,500 (and $1,200)
- $4,500

### Adding New Testimonials

Follow format in Section 5 of this guide. Keep total to 4-8 testimonials for best display.

### Updating About Page Content

Edit `about.html` directly. Keep structure intact but feel free to update copy.

---

## QUICK REFERENCE

**Logo:** `/images/motherlode-logo.png` (1000px wide)
**Headshot:** `/images/tobey-headshot.jpeg` (800x800px)
**GHL Popup:** Bottom of `index.html` before `</body>`
**GHL Form:** `contact.html` in Contact Form Section
**Calendly:** `contact.html` in Calendly Section + script at bottom
**Testimonials:** `index.html` in "What Founders Say" section
**Privacy:** `privacy.html` - replace placeholder content
**Terms:** `terms.html` - replace placeholder content
**LinkedIn:** Update `href="#"` in ALL files (search for "LINKEDIN URL")

---

**You've got this!** Follow each section step by step, test thoroughly, and you'll have a beautiful, functional website ready to go.
