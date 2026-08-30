# VacTrack

VacTrack is a front-end demo for tracking vaccinations, patient records, hospital coordination, and immunization reminders.

## Local setup

### Prerequisites
- Node.js 18+

### Install
```bash
npm install
```

### Environment variables
Create a local environment file from the sample template:

```bash
cp .env.example .env.local
```

Then update the values in `.env.local` with your local configuration. Keep all real secrets out of the repository and do not commit any `.env` or `.env.local` files.

### Run the app
```bash
npm run dev
```

## Project structure
- `src/` — React application source
- `public/` and static assets — build and UI assets
- `.env.example` — public-safe template for local environment settings
