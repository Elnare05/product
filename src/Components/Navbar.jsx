import { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { MenuItems } from "./MenuItems";
import "../css/NavbarStyle.css";

class Navbar extends Component {
  state = { clicked: false };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  render() {
    return (
      <nav className="NavbarItems">
        <h1 className="navbar-lego">AgroS</h1>
        <div className="menu-icons" onClick={this.handleClick}>
          <FontAwesomeIcon
            icon={this.state.clicked ? faTimes : faBars}
            className="menu-icon"
          />
        </div>
        <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <Link className={item.cName} to={item.url}>
                  {item.title}
                </Link>
              </li>
            );
          })}

        </ul>
      </nav>
    );
  }
}

export default Navbar;
