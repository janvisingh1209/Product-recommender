import { formatPrice } from "../../shared/currency.js";

export default function ProductCard({
  product,
  reason,
  rank,
  selected,
  onToggle,
  disabled,
}) {
  return (
    <article className={`product-card ${selected ? "selected" : ""}`}>
      <div className="card-top">
        <span>ITEM / {product.id.slice(1).padStart(2, "0")}</span>
        <span>{product.category}</span>
      </div>
      <div className={`product-art ${product.color}`}>
        {rank && (
          <span className="match-badge">
            {rank === 1 ? "★ FIRST PICK" : `PICK / 0${rank}`}
          </span>
        )}
        <div className={`device ${product.icon}`} aria-hidden="true">
          <span />
          <i />
          <b />
        </div>
        <span className="art-caption">ILLUSTRATED DEMO PRODUCT</span>
      </div>
      <div className="product-info">
        <div className="product-title">
          <h3>{product.name}</h3>
          <strong>{formatPrice(product.price)}</strong>
        </div>
        <p>{product.tagline}</p>
        <ul>
          {product.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        {reason && (
          <div className="match-reason">
            <span>↳ THE REASON</span>
            <p>{reason}</p>
          </div>
        )}
        <button
          className={`compare-button ${selected ? "is-selected" : ""}`}
          aria-pressed={selected}
          disabled={disabled && !selected}
          onClick={() => onToggle(product.id)}
        >
          {selected ? "✓ On the comparison desk" : "+ Add to comparison"}
          <span>↗</span>
        </button>
      </div>
    </article>
  );
}
