import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import './Navbar.scss';

const Navbar: React.FC = () => {
  return (
    <div className="comp-navbar">
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <Link to="/" className="navbar-brand">
          BTES
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                className="nav-link"
                activeClassName="active"
                exact={true}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/sandbox"
                className="nav-link"
                activeClassName="active"
              >
                Sandbox
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/lessons"
                className="nav-link"
                activeClassName="active"
              >
                Lessons
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/explorer"
                className="nav-link"
                activeClassName="active"
              >
                Explorer
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/help"
                className="nav-link "
                activeClassName="active"
              >
                Help
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                className="nav-link"
                activeClassName="active"
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/signin"
                className="nav-link"
                activeClassName="active"
              >
                Sign In
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
