import { formatPrice } from "../../shared/currency.js";

export default function ComparisonDesk({
  selectedIds,
  compared,
  showComparison,
  setShowComparison,
  setSelectedIds,
  toggleCompare,
}) {
  if (!selectedIds.length) return null;
  return (
    <section className="comparison" aria-label="Product comparison">
      <div className="compare-heading">
        <div>
          <span className="eyebrow">SIDE BY SIDE, LESS SECOND-GUESSING</span>
          <h2>
            The comparison desk <small>{selectedIds.length}/3</small>
          </h2>
        </div>
        <div>
          <button
            onClick={() => setShowComparison(!showComparison)}
            aria-expanded={showComparison}
          >
            {showComparison ? "Close comparison −" : "Compare picks +"}
          </button>
          <button
            onClick={() => {
              setSelectedIds([]);
              setShowComparison(false);
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="compare-names">
        {compared.map((p) => (
          <button
            key={p.id}
            onClick={() => toggleCompare(p.id)}
            aria-label={`Remove ${p.name} from comparison`}
          >
            {p.name}
            <span>×</span>
          </button>
        ))}
      </div>
      {showComparison && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">The details</th>
                {compared.map((p) => (
                  <th scope="col" key={p.id}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Price</th>
                {compared.map((p) => (
                  <td key={p.id}>{formatPrice(p.price)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Category</th>
                {compared.map((p) => (
                  <td key={p.id}>{p.category}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Features</th>
                {compared.map((p) => (
                  <td key={p.id}>
                    <ul>
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
