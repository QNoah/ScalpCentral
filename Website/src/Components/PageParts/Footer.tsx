import { Link } from 'react-router-dom';
import '../Styling/Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__links">
        <div className="site-footer__column">
          <h3 className="site-footer__column-heading">About</h3>
          <p className="site-footer__text">ScalpCentral your specialist in Pokémon cards. From loose singles to sealed boosters. Browse verified listings, compare prices, and trade with fellow collectors. We focus on authenticity, fair pricing, and clear condition grading so you can buy and sell with confidence.</p>
        </div>

        <div className="site-footer__column">
          <h3 className="site-footer__column-heading">Help</h3>
          <Link to="/faq" className="site-footer__link">FAQ</Link>
          <Link to="/contact" className="site-footer__link">Contact</Link>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© 2026 ScalpCentral</span>
      </div>
    </footer>
  );
}