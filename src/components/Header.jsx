export default function Header() {
  return (
    <>
      <div className="edition-bar">
        <span>AN INDEPENDENT EDIT OF EVERYDAY TECH</span>
        <span>VOL. 01 · INDIA / INR</span>
      </div>
      <header>
        <a className="brand" href="/" aria-label="The Shortlist home">
          <span className="brand-symbol">
            s<span>↗</span>
          </span>
          <span>
            the
            <br />
            shortlist<span className="orange">.</span>
          </span>
        </a>
        <nav>
          <a href="#collection">
            The collection <span>12</span>
          </a>
          <a href="#brief">Make a brief ↗</a>
        </nav>
        <div className="header-stamp">
          HUMAN PREFERENCES.
          <br />
          <strong>AI CONNECTIONS.</strong>
        </div>
      </header>
    </>
  );
}
