# Personal Developer Portfolio

My personal portfolio website, showcasing my projects, skills and experience as a software developer and IT systems specialist.

**Live site:** https://machokamwamba.co.ke

![Screenshot](screenshot.png)

## Features
- **Responsive, mobile-first design** with smooth scroll animations, a typing headline and a tech ticker
- **Project cards** with screenshots, tech tags, links to the live site and the code, and two short case studies
- **Live preview pop-up:** "View live" opens a project's site in a window on the page, with a link to open it in a new tab
- **CV that builds itself:** the Download CV button creates a fresh PDF in the browser from `cv-data.js`, so the website and the CV always match
- Experience timeline, skills, certifications, and one-tap contact cards
- Floating WhatsApp chat button
- SEO basics: page description, link preview tags and structured data

## Projects shown
- Personal Developer Portfolio (this site)
- [Lemways Nest: Real Estate Website](https://github.com/machokabrian/Real-Estate-): a property platform with an admin dashboard, live at lemwaysnest.co.ke
- Atelier Lune: Modern Salon
- Mwamba Logistics
- Online Employee Selection & Hiring System
- PembaHardware.com (client project)

## Built with
- HTML5
- CSS3
- Vanilla JavaScript
- [jsPDF](https://github.com/parallax/jsPDF), loaded from a CDN to generate the CV
- Poppins (Google Fonts) and Font Awesome icons
- Hosted on Netlify, with the domain machokamwamba.co.ke

## Project structure
```
├── Assets/
│   └── bg image.webp        # hero background image
├── Brian_Machoka_CV.pdf     # static CV, used as a backup download
├── README.md
├── cv-data.js               # all CV content; edit this to update the CV
├── cv-generator.js          # builds the CV PDF in the browser
├── index.html               # page structure and content
├── script.js                # menu, animations, project preview pop-up
└── style.css                # styling and responsive layout
```

## Updating the site
- **Text, projects and links:** edit `index.html`.
- **CV content:** edit `cv-data.js`. The Download CV button then produces the updated PDF. Also replace `Brian_Machoka_CV.pdf` so the backup stays current.
- **Look and layout:** edit `style.css`.
- **Preview pop-up:** `script.js` controls it. A project only opens inside the pop-up if its own site allows being framed. For Lemways Nest, the `frame-ancestors` rule in that site's `vercel.json` allows `machokamwamba.co.ke`. If a site refuses, the pop-up offers a link to open it in a new tab.

## Run it locally
1. Clone the repo: `git clone https://github.com/machokabrian/Personal-Developer-Portfolio.git`
2. Open `index.html` in your browser. An internet connection is needed for fonts, icons and the CV generator.

## Deployment
Every push to `main` is deployed automatically. The domain is connected in the Netlify dashboard.

## Author
**Brian Machoka Mwamba**, Software Developer, Nakuru, Kenya
[GitHub](https://github.com/machokabrian) · machokabrian0@gmail.com
