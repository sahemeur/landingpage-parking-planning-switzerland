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
