import { useState } from 'react'
import "./home.css"
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";




const faqs = [
  {
    question: "What is TempClip?",
    answer:
      "TempClip is a realtime clipboard sharing tool. You create a temporary room, get a 6-digit code, and instantly sync text, links, code snippets, and images across any device or browser — no account needed.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. TempClip is completely login-free. Just open the site, start a session, and share the 6-digit code with anyone you want to collaborate with.",
  },
  {
    question: "How long does a session last?",
    answer:
      "Sessions are temporary by design. Each room has a countdown timer and will automatically expire when the time runs out. Once expired, the content is gone — keeping things private and clean.",
  },
  {
    question: "How many people can join a session?",
    answer:
      "Multiple users can join the same room using the same 6-digit code. Everyone in the room sees live updates as content is typed or pasted — perfect for quick team handoffs.",
  },
  {
    question: "What kind of content can I share?",
    answer:
      "You can share plain text, URLs, code snippets, and images. It's designed for quick copy-paste workflows between devices or teammates without the friction of email or messaging apps.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Sessions are ephemeral — content is not stored permanently. Once a session expires, the data is cleared. We don't require any personal information, so there's nothing to leak.",
  },
  {
    question: "Can I use TempClip on mobile?",
    answer:
      "Yes. TempClip is fully responsive and works on any modern browser — desktop, tablet, or mobile. Open the same room code on your phone and your laptop and they stay in sync.",
  },
];

function Home() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <div className="home-container">
        <div className="hero-section">

          <div className="hero-right">
            <div className="hero-right-container">
              <div className="announcement-badge">
                <span className="badge-label">LIVE</span>
                <span className="badge-text">Realtime sharing without login</span>
              </div>

              <div className="headline">
                <h1 className="headline-title">
                  Your <br />
                  clipboard <br />
                  Anywhere</h1>
                <p className="headline-description">Share text, links, code snippets and images instantly with a simple 6-digit code. No login required.</p>
              </div>

              <div className="start-btn-container">
                <div className="start-button" onClick={() => navigate("/join")}>
                  <span className="start-button-text">Start Sharing</span>
                  <FaArrowRightLong className="start-button-icon" />
                </div>
              </div>

            </div>
          </div>

          <div className="hero-left">
            <div className="video-card">
              <img
                src="https://dl.dropbox.com/scl/fi/uqluo37pfcbbh3mi1mokz/unnamed.gif?rlkey=bxk9aj2f99q1t444nyop5pfwn&st=1cdh1nas&dl=0"
              />
            </div>
          </div>
        </div>

        <div className="marquee-container">
          <div className="marquee">
            <p>Share your clipboard content instantly with anyone, anywhere!</p> <p>Start a room, share the code, and sync content instantly across devices and teammates.</p>
          </div>
        </div>

        <div className="cta-section" id='about'>
          <div className="cta-logo">
            <img
              src="https://dl.dropbox.com/scl/fi/mpdax0wptvtpriejp21rc/tempclips.png?rlkey=wro454d5ekloradnomxsnpnl4&st=uwzqkmnr&dl=0"
              alt="TempClip"
              className="cta-logo"
            />
          </div>
          <div className="cta-dec">
            <h2 className="cta-title">
              Share instantly. 
              <span> Anywhere.</span>
            </h2>

            <p className="cta-description">
              Create a temporary room and share text, code snippets,
              links and images instantly across devices.
              No login required.
            </p>
          </div>
        </div>

        <div className="faq-container" id='faq'>
          <div className="faq-header">
            <span className="faq-eyebrow">FAQ</span>
            <h2 className="faq-title">Got questions?</h2>
            <p className="faq-subtitle">Everything you need to know about TempClip.</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openIndex === i ? "faq-item--open" : ""}`}
                onClick={() => toggle(i)}
              >
                <div className="faq-question">
                  <span>{faq.question}</span>
                  <span className="faq-icon">
                    {openIndex === i ? <LuMinus /> : <GoPlus />}
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;