export default function RecommendationSection({
  loading,
  error,
  result,
  submitted,
  resetResults,
}) {
  return (
    <div aria-live="polite">
      {loading && (
        <div className="status">
          <span className="spinner" /> Reading the brief. Checking the shelves.
          Connecting the dots.
        </div>
      )}
      {error && (
        <div className="error" role="alert">
          <strong>Couldn’t finish this brief.</strong>
          <p>{error}</p>
        </div>
      )}
      {result && (
        <div className="result-summary">
          <div className="small-mono">↳ NOTES FROM YOUR SHOPPING ASSISTANT</div>
          <p>{result.summary}</p>
          <blockquote>“{submitted}”</blockquote>
          <button onClick={resetResults}>← Back to the full collection</button>
        </div>
      )}
    </div>
  );
}
