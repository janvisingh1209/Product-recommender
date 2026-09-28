import ComparisonDesk from "./components/ComparisonDesk.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import RecommendationSection from "./components/RecommendationSection.jsx";
import PreferenceInput from "./components/PreferenceInput.jsx";
import Header from "./components/Header.jsx";
import { useState } from "react";
import { products } from "../shared/products.js";

const categories = [
  "All products",
  ...new Set(products.map((product) => product.category)),
];

export default function App() {
  const [preferences, setPreferences] = useState("");
  const [category, setCategory] = useState("All products");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [sort, setSort] = useState("default");

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSubmitted(preferences.trim());
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "Something went wrong. Please try again.",
        );
      setResult(data);
      setCategory("All products");
      setSort("default");
    } catch (err) {
      setError(
        err.name === "TimeoutError"
          ? "The request timed out. Please try again."
          : err.message || "Unable to connect. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleCompare(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : current.length < 3
          ? [...current, id]
          : current,
    );
  }
  function resetResults() {
    setResult(null);
    setError("");
    setCategory("All products");
    setSort("default");
  }
  const matches = result?.recommendations.map((match) => ({
    ...products.find((p) => p.id === match.productId),
    reason: match.reason,
  }));
  const visibleProducts = (matches ?? products).filter(
    (p) => category === "All products" || p.category === category,
  );
  if (sort !== "default")
    visibleProducts.sort((a, b) =>
      sort === "low" ? a.price - b.price : b.price - a.price,
    );
  const compared = selectedIds.map((id) => products.find((p) => p.id === id));

  return (
    <>
      <Header />
      <main>
        <section className="intro">
          <div>
            <span className="eyebrow">
              <i /> YOUR NEXT GOOD DECISION STARTS HERE
            </span>
            <h1>
              Less guesswork.
              <br />
              Better{" "}
              <span className="gear">
                gear
                <svg viewBox="0 0 270 20" aria-hidden="true">
                  <path d="M3 13 Q115 -2 264 10 M18 18 Q153 9 247 16" />
                </svg>
              </span>
              <span className="orange">.</span>
            </h1>
          </div>
          <div className="intro-aside">
            <div className="orbit" aria-hidden="true">
              ↘
            </div>
            <p>
              A dozen things worth a look.
              <br />
              One brief about what you need.
              <br />
              <strong>Let’s find your kind of good.</strong>
            </p>
            <span className="small-mono">
              NO ENDLESS SCROLL. JUST A SHORTLIST.
            </span>
          </div>
        </section>
        <div className="workspace">
          <PreferenceInput
            preferences={preferences}
            setPreferences={setPreferences}
            loading={loading}
            handleSubmit={handleSubmit}
          />
          <section className="catalog" id="collection" aria-busy={loading}>
            <div className="catalog-heading">
              <div>
                <span className="eyebrow">
                  {result ? "CURATED FROM YOUR BRIEF" : "EXPLORE THE EDIT"}
                </span>
                <h2>
                  {result ? "Your shortlist" : "The collection"}
                  <sup>{String(visibleProducts.length).padStart(2, "0")}</sup>
                </h2>
              </div>
              <span className="catalog-mark" aria-hidden="true">
                ✳
              </span>
            </div>
            <RecommendationSection
              loading={loading}
              error={error}
              result={result}
              submitted={submitted}
              resetResults={resetResults}
            />
            <div className="catalog-toolbar">
              <div className="tabs" aria-label="Product categories">
                {categories.map((item) => (
                  <button
                    key={item}
                    aria-pressed={category === item}
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item === "All products" ? "Everything" : item}
                  </button>
                ))}
              </div>
              <label className="sort-label">
                <span className="sr-only">Sort products</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="default">
                    {result ? "Best match" : "Editor’s order"}
                  </option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                </select>
              </label>
            </div>
            <ProductGrid
              visibleProducts={visibleProducts}
              result={result}
              matches={matches}
              selectedIds={selectedIds}
              toggleCompare={toggleCompare}
            />
            {!visibleProducts.length && (
              <div className="empty">
                <span>∅</span>
                <h3>Nothing on this shelf. Yet.</h3>
                <p>Try another category or adjust your brief.</p>
                <button onClick={resetResults}>Browse all 12 products ↗</button>
              </div>
            )}
            <div className="collection-end">
              <span>YOU’VE REACHED THE END OF THE EDIT.</span>
              <span>QUALITY OF FIT &gt; QUANTITY OF CHOICE</span>
            </div>
          </section>
        </div>
        <ComparisonDesk
          selectedIds={selectedIds}
          compared={compared}
          showComparison={showComparison}
          setShowComparison={setShowComparison}
          setSelectedIds={setSelectedIds}
          toggleCompare={toggleCompare}
        />
      </main>
      <footer>
        <div className="footer-brand">
          Buy less randomly<span>↗</span>
        </div>
        <div>
          <p>Built by Janvi Singh · An AI-powered shopping experiment.</p>
          <span>Fictional demo products. All prices in Indian rupees.</span>
        </div>
        <a href="#brief">Back to your brief ↑</a>
      </footer>
    </>
  );
}
