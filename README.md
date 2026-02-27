# Airtel ESM – Quote / Office Broadband (Mock UI)

Mock UI for the Sales Console Quote screen (Office Broadband) matching the provided screenshot. Built with **React**, **Vite**, and **Tailwind CSS**. Functionality for buttons and row actions can be wired in your next steps.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Deploy to Heroku

The project is set up for Heroku: it uses the **Node** buildpack, builds with Vite on deploy, and serves the static app with `serve`.

1. **Install the Heroku CLI** and log in: [https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

2. **Create the app** (from the project root):
   ```bash
   heroku create
   ```
   Or with a name: `heroku create your-app-name`

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Prepare for Heroku"
   git push heroku main
   ```
   If your default branch is `master`: `git push heroku master`

4. **Open the app**: `heroku open`

Heroku will run `npm run build` (via `heroku-postbuild`) and then `npm start` (serves the `dist` folder with SPA fallback). Node version is set to **20.x** in `package.json` (`engines.node`).

## What’s included (UI only)

- **Header**: Airtel logo, Sales Console launcher, global search, nav (Home, Quote, Contacts, Service, Sales, Accounts, Dashboards, Reports, More), utility icons, profile.
- **Quote section**: Quote title “Office Broadband”, One Time / Monthly / Quote Total ($000), and actions: **+ Add Products**, **Create Enterprise Quote**, **Discounts & Promotions**, **Create Final Orders**.
- **Tabs**: Summary (0), Locations (12), Subscribers (0), **Extracted Information** (active).
- **Table toolbar**: View By (All), Filter by (All), “Search this list”, **Match All Products**, **View Selected(0)**.
- **Data table**: Checkboxes, Street Address, Postal Code, Requested Products, Matched Products, Matching Status (Done / Partial / Pending pills), Technology, Attributes, Confidence Level (sort indicator), Data Quantity, row-level action (chevron).
- **Footer**: **Validate**, **Continue with resolved**, **Continue with Selected**.

All controls are present as UI only; you can attach handlers in the next steps.
