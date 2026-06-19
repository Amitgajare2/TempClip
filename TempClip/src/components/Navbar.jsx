import "./navbar.css"
import { MdOutlineDarkMode } from "react-icons/md";
import { BsSun } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <>
     <div className="navbar">
        <div className="nav-title">
              <h1><Link to={"/"}>TempClip</Link></h1>
        </div>
        <div className="nav-links">
            <ul>
                <li>How it work</li>
                <li>FAQ</li>
                <li>Contact</li>
            </ul>
        </div>
        <div className="nav-mode">
            <div className="dark" onClick={toggle} title="Toggle theme">
                {theme === "light"
                  ? <MdOutlineDarkMode className="dark-icon" />
                  : <BsSun className="dark-icon" />
                }
            </div>
        </div>
     </div>
    </>
  )
}

export default Navbar