import Motion from "../components/Motion";
import ScrollCinema from "../components/ScrollCinema";
import QuoteForm from "../components/QuoteForm";

const PACKAGES = [
  {
    name: "Backup Basic",
    price: "R42,000",
    note: "No panels. Charges from the grid.",
    items: ["5 kW hybrid inverter", "5 kWh lithium battery", "Runs lights, Wi-Fi, TV and fridge", "Add panels later"],
  },
  {
    name: "Home Hybrid",
    price: "R98,000",
    note: "Our most popular system",
    featured: true,
    items: ["8 × 550 W panels (4.4 kWp)", "5 kW hybrid inverter", "5 kWh lithium battery", "App monitoring on your phone", "Certificate of Compliance included"],
  },
  {
    name: "Off-Grid Ready",
    price: "R175,000",
    note: "For bigger homes and home offices",
    items: ["14 × 550 W panels (7.7 kWp)", "8 kW hybrid inverter", "10 kWh lithium battery", "Runs geyser and pool pump on sun", "Priority after-sales support"],
  },
];

export default function Home() {
  return (
    <>
      <Motion />

      <div className="preloader" aria-hidden="true">
        <div className="preloader-inner">
          <div className="preloader-logo">sun<span>vault</span></div>
          <div className="preloader-bar"><i /></div>
          <div className="preloader-count">Loading 0%</div>
        </div>
      </div>

      <header className="nav">
        <div className="wrap nav-inner">
          <a className="logo" href="#top">sun<span>vault</span></a>
          <nav className="nav-links">
            <a href="#how">How it works</a>
            <a href="#packages">Packages</a>
            <a className="btn btn-amber" href="#quote">Get a quote</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="eyebrow reveal">Solar + battery backup · Gauteng</div>
            <h1>
              <span className="line"><span>Keep the</span></span>
              <span className="line"><span><em>lights</em> on.</span></span>
            </h1>
            <div className="hero-row">
              <div>
                <p className="reveal">Panels, inverter and lithium battery, installed in one day. When loadshedding hits, your house stays on.</p>
                <div className="hero-ctas reveal">
                  <a className="btn btn-amber" href="#quote">Free home assessment</a>
                  <a className="btn" href="#packages">See packages</a>
                </div>
              </div>
              <div className="scroll-hint reveal"><i />Scroll to watch one day with Sunvault</div>
            </div>
          </div>
        </section>

        <ScrollCinema />

        <section className="block">
          <div className="wrap">
            <div className="head" data-reveal>
              <div><div className="eyebrow">The Home Hybrid system</div><h2>Sized for a real family home.</h2></div>
              <p>Enough to run lights, Wi-Fi, TV, fridge and laptops through a full loadshedding slot, and cut your daytime bill with free sun.</p>
            </div>
            <div className="specs" data-reveal>
              <div className="spec"><b><span data-count="4.4">0</span><small>kWp</small></b><span>of panels on your roof</span></div>
              <div className="spec"><b><span data-count="5">0</span><small>kWh</small></b><span>lithium battery storage</span></div>
              <div className="spec"><b><span data-count="1">0</span><small>day</small></b><span>typical install time</span></div>
            </div>
          </div>
        </section>

        <section className="block" id="packages">
          <div className="wrap">
            <div className="head" data-reveal>
              <div><div className="eyebrow">Packages</div><h2>Pick your level of backup.</h2></div>
              <p>Prices include VAT, installation and the electrical Certificate of Compliance. Final quote after a free home assessment.</p>
            </div>
            <div className="packages" data-reveal>
              {PACKAGES.map((p) => (
                <article key={p.name} className={`pkg${p.featured ? " featured" : ""}`}>
                  {p.featured && <span className="tag">Most popular</span>}
                  <h3>{p.name}</h3>
                  <div className="price">from {p.price}<small>{p.note}</small></div>
                  <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
                  <a className={`btn${p.featured ? " btn-amber" : ""}`} href="#quote">Get a quote</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="block" id="quote">
          <div className="wrap quote">
            <div data-reveal>
              <div className="eyebrow">Free assessment</div>
              <h2 style={{ font: "700 clamp(36px,5.5vw,72px)/0.98 var(--display)", letterSpacing: "-0.04em", margin: "12px 0 20px" }}>Book a site visit.</h2>
              <p style={{ color: "var(--muted)", maxWidth: "44ch", margin: 0 }}>We check your roof, your DB board and your last three electricity bills, then send a fixed quote within 48 hours.</p>
              <div className="contact-lines">
                <span>Mon–Sat, 07:30–17:00</span>
                <span>Serving Johannesburg, Pretoria and the East Rand</span>
              </div>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <span>Sunvault Solar is a fictional company. Prices are illustrative.</span>
          <span>Designed &amp; built by Andisa Mtshali · Next.js, GSAP, Lenis</span>
        </div>
      </footer>
    </>
  );
}
