import "dotenv/config";
import express from "express";
import { createServer } from "vite";
import handler from "../api/recommend.js";

const app = express();
app.use(express.json({ limit: "8kb" }));
app.all("/api/recommend", handler);
const vite = await createServer({
  server: { middlewareMode: true },
  appType: "spa",
});
app.use(vite.middlewares);
app.listen(5173, "0.0.0.0", () =>
  console.log("The Shortlist is running at http://localhost:5173"),
);
