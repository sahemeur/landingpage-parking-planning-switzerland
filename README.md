# Parking Planning Web Application

## Overview

This is a collaborative web application that helps users understand the planning process for building private parking spaces in Switzerland. It provides municipality-specific guidance, planning information and links to service providers.

## My Contribution

I joined an existing software project and contributed to the frontend implementation.

My responsibilities included:

- Redesigned the landing page and several content pages
- Implemented UI improvements directly in the existing TypeScript / Next.js codebase
- Improved layout, navigation and visual hierarchy
- Added and integrated images and content
- Improved usability and overall user experience

## Technologies

- TypeScript
- React
- Next.js
- Prisma
- Git
- GitHub

## Challenges & Lessons Learned

This was my first experience contributing to an existing TypeScript codebase. One of the biggest challenges was understanding the project structure and identifying where interface changes needed to be made. Through this project, I gained experience navigating a larger codebase, implementing frontend changes, and testing my modifications within an established application.

---

## Credits

This project was developed collaboratively. My contribution focused on frontend implementation and user interface improvements.

---

# Original Project Documentation

Parkplatz Landingpage

## DB Setup

Run

```bash
npm run dbreset
```

## Dev Mode

First, run the development server:

```bash
npm run dev
```

## Generate Static Site

```bash
npm run build
```

## Deployment

If the project isn't linked yet: `npx netlify link`
Login and choose the corresponding project.

To deploy make sure you have a valid build and then `SITE_URL=https://landingpage-parkplatz.netlify.app npx netlify deploy`
Adjust SITE_URL accordingly to the target domain.
