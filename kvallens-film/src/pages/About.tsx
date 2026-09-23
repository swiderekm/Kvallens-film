import { Link } from "react-router-dom";

export const About = () => {
  return (
    <main className="container about-page">
      <div className="about-hero">
        <span className="about-tag">Projektinformation</span>
        <h2>Om Kvällens film</h2>
        <p className="about-lead">
          En modern webbapplikation byggd för att enkelt hitta, utforska och
          hålla koll på filmer inför filmkvällen.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <div className="card-icon">⚡</div>
          <h3>The Movie Database API</h3>
          <p>
            Hämtar direkt information om aktuella och populära filmer i realtid
            via TMDb API med hjälp av Axios.
          </p>
        </div>

        <div className="about-card">
          <div className="card-icon">💾</div>
          <h3>Lokal persistens</h3>
          <p>
            Dina sparade filmer sparas säkert i webbläsarens{" "}
            <code>localStorage</code>, så din lista finns kvar även om du
            stänger fliken.
          </p>
        </div>

        <div className="about-card">
          <div className="card-icon">⚛️</div>
          <h3>Modern React & TypeScript</h3>
          <p>
            Strukturerad med komponenter med single responsibility, React Router
            för snabb navigering och Context API för delat state.
          </p>
        </div>
      </div>

      <div className="about-footer-box">
        <h3>Redo att hitta nästa film?</h3>
        <p>Bläddra bland populära titlar eller sök efter dina personliga favoriter.</p>
        <Link to="/" className="about-cta-btn">
          Gå till filmerna
        </Link>
      </div>
    </main>
  );
};
