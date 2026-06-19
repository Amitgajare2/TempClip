import React from 'react'
import './footer.css'
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter  } from 'react-icons/fa';
import { FaSquareInstagram } from "react-icons/fa6";

function Footer() {
   const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo"><Link to="/" className="footer-logo">TempClip</Link></span>
          <p className="footer-tagline">Realtime clipboard sharing</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#faq">Faq</a>
          {/* <a href="/#pricing">Pricing</a> */}
          <a href="#about" rel="noreferrer">About</a>
          <a href="mailto:syntaxamit@proton.me">Contact</a>
        </nav>
        <div className="footer-social">
          <a href="https://github.com/Amitgajare2" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href="https://x.com/AmitGajare4" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
          <a href="https://www.instagram.com/amitgajare_/" target="_blank" rel="noreferrer" aria-label="Instagram"><FaSquareInstagram /></a>
        </div>
      </div>
      <div className="footer-legal">
        <span>© 2026 - {year} TempClip. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer