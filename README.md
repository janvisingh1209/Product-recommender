# The Shortlist — AI Product Recommendation System

An editorial shopping desk built by Janvi Singh: ink-and-saffron design, receipt-style shopping brief, numbered product cards, a comparison desk, and Indian rupee prices.

## Stack

React + Vite, Express for local development, a Vercel serverless API, and Groq-hosted Llama (`llama-3.3-70b-versatile`). No OpenAI key or SDK is required. Calls use built-in `fetch`.

## Start on Windows (PowerShell)

1. Extract the ZIP to a fresh folder. Open the inner `product-recommender` folder (the one with `package.json`) in VS Code.
2. Open Terminal → New Terminal and run:

```powershell
npm install
Copy-Item .env.example .env
```

3. Visit https://console.groq.com/keys, sign in and create an API key. Groq offers a free tier without a credit card, subject to rate limits. Stay on the Free plan for this assessment.
4. Paste your key into `.env`:

```env
GROQ_API_KEY=your_actual_groq_key
GROQ_MODEL=openai/gpt-oss-120b

```

5. Start both the frontend and API with one command:

```powershell
npm run dev
```

6. Open http://localhost:5173. Try `A phone under ₹30,000 with a good camera`.

If you change `.env`, stop the app with Ctrl+C and run `npm run dev` again. Keep your key server-side: never prefix it with `VITE_`, paste it in chat, or commit `.env`.

### If updating the earlier project

Replace the source files with this version, run `npm install` and update `.env` to the two GROQ variables above. The earlier OPENAI variables are no longer read. Using a fresh extracted folder is simplest. No extra packages are needed.

## Deploy to Vercel

1. Push the project folder to GitHub. `.gitignore` excludes `.env`, `node_modules` and `dist`.
2. In Vercel, import the GitHub repository with **Add New → Project**.
3. Set Framework to **Vite**. Root Directory must contain `package.json`. Build Command: `npm run build`. Output Directory: `dist`.
4. Add these environment variables before deploying:

| Name | Value |
| --- | --- |
| `GROQ_API_KEY` | Your private Groq key |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |

5. Deploy, open the generated `.vercel.app` URL, and test a real recommendation.
6. Submit that URL. If you change environment variables later, redeploy.

Both frontend and `/api/recommend` run on Vercel; you do not need Render or a separately hosted Express server.

CLI alternative:

```powershell
npx vercel login
npx vercel
npx vercel env add GROQ_API_KEY production
npx vercel --prod
```

## Request flow

React posts user preferences to `/api/recommend`. The server sends those preferences and the INR catalog to Groq. Llama responds in JSON with a summary, product IDs and reasons. The backend validates the response shape and removes unknown and duplicate IDs. React maps the IDs to the original catalog and displays only the selected products.

The model is instructed to interpret `25k` as ₹25,000 and `1 lakh` as ₹1,00,000. Prices are fictional INR demo prices, not converted live prices. Price/category interpretation is performed by the model and still needs live evaluation; JSON mode guarantees JSON syntax, not semantic correctness.

## Features

- Twelve fictional products across four categories.
- Free-text shopping briefs and sample prompts.
- AI-ranked matches with reasons and no-match explanations.
- Category filtering and price sorting.
- Compare up to three products side by side.
- Mobile layouts and keyboard-accessible controls.
- Explicit loading, missing-key, timeout and rate-limit errors.
- CSS illustrations; no product image service is needed.

## Files

- `src/App.jsx`: state and coordination of the shopping flow.
- `src/components/Header.jsx`: site navigation.
- `src/components/PreferenceInput.jsx`: brief form and example prompts.
- `src/components/RecommendationSection.jsx`: status, errors and AI summary.
- `src/components/ProductGrid.jsx`: filtered and ranked product cards.
- `src/components/ComparisonDesk.jsx`: side-by-side catalog comparison.
- `src/components/ProductCard.jsx`: reusable card.
- `src/styles.css`: editorial responsive design.
- `src/devices.css`: CSS product illustrations.
- `shared/products.js`: catalog used by frontend and backend.
- `shared/currency.js`: Indian rupee formatting.
- `server/recommendation.js`: Groq request and output validation.
- `api/recommend.js`: request validation and HTTP errors.
- `server/dev.js`: local Express + Vite server.
- `vercel.json`: deployment configuration.
- `tests/recommendation.test.js`: tests using mocked provider responses.

## Verification

```powershell
npm test
npm run build
```

Live checks after adding your key:
- Camera phone under ₹30,000: PixelPeak Camera fits the catalog.
- Noise-cancelling headphones under ₹6,000: QuietSpace 30.
- Coding laptop under ₹70,000: Codebook 14 is a relevant option.
- Laptop under ₹1,000: no matches and an explanation.
- Try `under 25k`, category filters, sorting, compare and reset.

`npm run preview` only previews the built frontend. Use `npm run dev` for local AI requests.

## Troubleshooting

- **AI not configured**: check `.env` placement and spelling, then restart. On Vercel, add variables and redeploy.
- **Provider error**: check the key is a Groq key and the model is available to your account.
- **429 / free-tier limit**: wait and retry. Check https://console.groq.com/dashboard/limits.
- **No matches**: broaden the request; recommendations are restricted to the 12-item catalog.

This is an assessment MVP. Before wider public use, add durable rate limiting and abuse protection. No preferences are stored, but they are sent to Groq for inference.

Docs: https://console.groq.com/docs/quickstart and https://console.groq.com/docs/structured-outputs
