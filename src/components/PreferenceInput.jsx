const examples = [
  {
    tag: "01 / DAILY DRIVER",
    text: "A phone under ₹30,000 with a good camera",
  },
  { tag: "02 / FOCUS MODE", text: "Noise-cancelling headphones under ₹6,000" },
  { tag: "03 / SIDE PROJECT", text: "A laptop for coding under ₹70,000" },
];
export default function PreferenceInput({
  preferences,
  setPreferences,
  loading,
  handleSubmit,
}) {
  return (
    <aside className="brief-column">
      <section className="brief-card" id="brief">
        <div className="receipt-top">
          <span className="small-mono">THE SHORTLIST / REQUEST SLIP</span>
          <span className="receipt-star">✳</span>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="preferences">
            <span className="step">01</span> What’s the brief?
          </label>
          <p className="form-hint">Your budget. Your must-haves. Your words.</p>
          <textarea
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="A phone under ₹30,000. Good camera. Battery that survives my commute."
            minLength={3}
            maxLength={500}
            required
            disabled={loading}
          />
          <div className="input-meta">
            <span>₹ INR · “25k” works too</span>
            <span>{preferences.length}/500</span>
          </div>
          <button
            className="recommend-button"
            disabled={loading || preferences.trim().length < 3}
          >
            {loading ? (
              <>
                <span className="spinner" /> Reading your brief…
              </>
            ) : (
              <>
                Find my shortlist <span>↗</span>
              </>
            )}
          </button>
          <div className="example-heading small-mono">OR BORROW A BRIEF ↓</div>
          <div className="examples">
            {examples.map((example) => (
              <button
                type="button"
                key={example.tag}
                disabled={loading}
                onClick={() => {
                  setPreferences(example.text);
                  document.getElementById("preferences").focus();
                }}
              >
                <span>{example.tag}</span>
                <p>
                  {example.text} <b>↗</b>
                </p>
              </button>
            ))}
          </div>
        </form>
        <div className="receipt-bottom">
          <span className="barcode" aria-hidden="true" />
          <span className="small-mono">12 ITEMS. YOUR CALL.</span>
        </div>
      </section>
      <div className="margin-note">
        <span>↳</span>
        <p>
          Good recommendations should
          <br />
          come with a <em>reason.</em>
          <br />
          <small>Every AI pick explains why it fits.</small>
        </p>
      </div>
    </aside>
  );
}
