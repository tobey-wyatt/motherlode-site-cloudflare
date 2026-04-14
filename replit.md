# Motherlode Advising, LLC Website

## Overview
A professional, responsive static website for Motherlode Advising, LLC, a consulting firm that helps founder-CEOs build operational foundations and leadership capacity. The site is fully functional and aims to provide a robust online presence without complex frameworks. It focuses on a custom brand with a gemstone color palette and an animated particle background. The project emphasizes SEO, performance, and a user-friendly experience across all devices.

## User Preferences
(To be updated as preferences are expressed)

## System Architecture
The website is built with a minimalist approach, utilizing **Vanilla HTML5, CSS3, and JavaScript (ES6+)** without any frameworks, build tools, or package managers. A simple **Python 3.12 HTTP server (`server.py`)** serves all static files on port 5000, configured for Replit's preview and automatic startup.

**UI/UX Decisions:**
- **Design:** Custom brand identity with a gemstone color palette (Teal, Hot Pink, Purple, Cerulean) and a dynamic particle background (desktop only).
- **Responsiveness:** Mobile-first design with breakpoints for mobile (<480px), tablet (481-768px), and desktop (769px+).
- **Navigation:** Unified header and footer across all pages. Responsive navigation with distinct desktop and mobile experiences (e.g., mobile hamburger menu with collapsible service dropdowns, sticky "Let's chat" CTA).
- **Interactive Elements:** Canvas-based gemstone particle animation (desktop only), smooth scrolling for anchor links, and deep-linkable service sections.
- **Visuals:** Custom watercolor icons are used for feature sections, replacing emojis, and sized for visual impact. Legal pages (privacy.html, terms.html) have professional formatting with clear section breaks and improved readability.
- **Performance:** Optimizations include lazy loading for images, deferred script loading (particles.js, Font Awesome), and disabling particle animations on mobile devices.
- **Accessibility:** Semantic HTML5, ARIA labels, high-contrast text (WCAG AA compliant), keyboard navigation, and reduced motion support.

**Technical Implementations & Features:**
- **Static Site:** Chosen for fast performance, easy maintenance, cost-effectiveness, and no backend/database requirements.
- **Python HTTP Server:** Selected for its simplicity, built-in nature, and ability to set proper cache-control headers.
- **SEO Optimization:** Comprehensive technical SEO across all pages, including optimized titles, meta descriptions, Open Graph, Twitter/Bluesky cards, canonical tags, og:image:alt, and structured data (Schema.org JSON-LD for Organization, Person, and Services). On-page SEO with descriptive, keyword-rich image alt text. Local SEO signals like consistent NAP and social media links.
- **Dynamic Sitemap:** `server.py` generates `/sitemap.xml` on the fly using each file's filesystem modification time as `lastmod`. The static `sitemap.xml` file is bypassed by the server. **When adding a new public page, add it to the `PAGES` list in the `handle_sitemap()` method of `server.py`.**
- **Site Structure:** Consolidated all service and contact information onto `index.html`. Dedicated `about.html`, `events.html`, `media.html`, `diagnostic.html`, `privacy.html`, and `terms.html` pages.
- **Media Page (media.html):** Showcases podcast appearances, video interviews, articles, and upcoming webinars featuring Tobey Wyatt. Features include:
  - **Upcoming Webinars section** at top with "Coming Soon" placeholder (will host webinar events)
  - **Podcast Appearances section** with 8 podcast cards
  - **Video Interviews section** with YouTube thumbnail integration and play buttons
  - **Articles & Features section** with 3 article cards
  - **Book Tobey CTA section** for speaking inquiries with topics list
  - Color-coded card types (Podcast=Teal, Video=Hot Pink, Article=Purple)
  - Fade-in animations for cards
  - Full SEO optimization with Schema.org CollectionPage structured data
- **Events Page (events.html):** Dynamic calendar-based events page powered by `events-data.json`. Features include:
  - **2-week rolling calendar** with compact 14-day strip view and week-based navigation
  - **90-day window filter** - only shows events within next 90 days
  - **Click-to-scroll** - calendar event pills scroll to detail cards with highlight animation
  - **Timezone conversion** - virtual events convert to viewer's local timezone (convertTimezone: true in JSON)
  - **Color-coded event pills**: Facilitating (#0299B3 teal), Hosting (#F20358 hot-pink), Speaking (#5E18E8 purple)
  - **Mobile responsive** - switches to week-grouped list view on mobile (<768px)
  - Schema.org Event structured data for SEO
  - JSON fields: title, date (YYYY-MM-DD), displayDate, time, timezone, convertTimezone, type, location, description, registrationUrl, registrationLabel
- **Table of Contents (About Page):** Sticky sidebar navigation on desktop (fixed right side) and horizontal scrollable nav on mobile. Uses IntersectionObserver for performant active section highlighting. Links to: Why I Do This Work, Selected Experience, Beyond Business, For the Nerds.
- **Particle Muting System:** Uses semi-transparent container backgrounds (85% opacity) to mute particles under text and block them by content cards, simplifying particle integration.
- **No Build System:** Direct editing of HTML, CSS, and JS files for immediate changes.

## External Dependencies
- **Google Fonts:** For typography.
- **Font Awesome:** For icons (deferred loading).
- **Alignable:** Custom logo integration.
- **LinkedIn, Bluesky, YouTube, Google Business Profile:** Social media integration and hover tooltips for direct links.

## Recent Changes
- **January 2026:** Replaced Office Hours with Upcoming Webinars. Navigation now links to Webinars section on media.html. Added "Coming Soon" placeholder for webinars on both index.html and media.html. Removed Office Hours entries from events calendar.
- **January 2026:** Redesigned events calendar to 2-week rolling view with week-based navigation for better UX. Calendar now shows compact 14-day strip with color-coded event pills.
- **January 2026:** Optimized 8 critical images for performance: 7 watercolor icons reduced from ~12MB total to <50KB each, headshot to 85KB. Originals backed up to images/originals/.
- **January 2026:** Added Media & Press page (media.html) replacing external blog link. Updated navigation across all pages to include Media link.
- **January 2026:** Fixed favicon - resized from 190x190 to proper sizes (32x32, 16x16) and added apple-touch-icon.png (180x180) for iOS devices.
- **January 2026:** Added skip-to-content links on all 6 pages for keyboard accessibility. Added events.html and media.html to sitemap.xml. Fixed testimonial name (Zach → Zak). Removed Napkin Networking events after March 27, 2026.
- **January 2026:** Added external event scraper integration. Events from Always Be Connecting and Windy City Business Network now appear on the events page with host badges (ABC Event, WCBN Event, Motherlode Event) and location tags (Virtual or In-Person: City). External events show dual links: "View Event" (links to source organization's events page for SEO) and "Register" (links to Eventbrite/registration). 
  - **Scheduled Updates:** External scraper runs as a separate Replit app with scheduled deployment (weekly on Mondays at 1 AM CT).
  - **API Endpoint:** POST `/api/external-events` receives event data from the scraper app. Requires `X-API-Key` header matching `SCRAPER_API_KEY` secret.
  - **Scraper App Config:** Set `MOTHERLODE_API_URL` to `https://motherlode.biz/api/external-events` and `MOTHERLODE_API_KEY` to match this site's `SCRAPER_API_KEY` secret.
  - **Database Storage:** External events are stored in PostgreSQL (`external_events` table) for persistence across deployments. GET `/api/external-events` serves events from the database. This enables fully automated updates - no republishing needed after scraper runs.
  - **Multi-Host Tagging:** The `host` field is stored as JSONB array to support events tagged with multiple hosts (e.g., ["motherlode", "alignable"]). Supported host slugs: `motherlode`, `always-be-connecting`, `windy-city-business-network`, `alignable`, `sagin`. Display shows combined badges like "Motherlode + Alignable". Host filter searches across all tags in the array.
  - **Source-Scoped Uploads:** POST `/api/external-events` requires a top-level `source` field. The server only deletes events matching that source before inserting, preventing one scraper from wiping events from other sources. Individual events inherit the top-level source if not specified.
- **February 2026:** Added SAGIN as new event source with host badge mapping. Fixed critical bug where uploading events from one source would delete ALL external events from the database. Events are now scoped by source for safe multi-source operation.
- **March 2026:** Implemented automatic dark mode via `prefers-color-scheme: dark`. Warm dark palette (#1A1817 bg, #252220 cards, #E8E6E1 text) applied site-wide. CSS variable overrides in styles.css, hardcoded color overrides for header, mobile menu, dropdown, cards, forms, particle-muting containers, and section backgrounds. Header logos use `<picture>` element to swap dark logo for white logo on all 8 pages (footer logos unchanged — already white on dark). Diagnostic tool (diagnostic.html) has dedicated inline dark mode block for question cards, option buttons, progress bar, results sections, and callout boxes. 404 page has inline dark mode for error text. PDF export stays light. No manual toggle — purely OS/browser preference driven. Brand accent colors (teal, hot pink, purple, cerulean, gold) unchanged in dark mode.