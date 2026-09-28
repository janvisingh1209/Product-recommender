import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({
  visibleProducts,
  result,
  matches,
  selectedIds,
  toggleCompare,
}) {
  return (
    <div className="product-grid">
      {visibleProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          reason={product.reason}
          rank={
            result
              ? matches.findIndex((match) => match.id === product.id) + 1
              : null
          }
          selected={selectedIds.includes(product.id)}
          onToggle={toggleCompare}
          disabled={selectedIds.length >= 3}
        />
      ))}
    </div>
  );
}
