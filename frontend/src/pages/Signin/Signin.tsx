import React from 'react';

import './Signin.scss';
import background from './sand.jpg';

const Signin: React.FC = () => {
  return (
    <div className="page-signin">
      <img
        className="global-bg-img page-signin--bg-img"
        src={background}
        alt="background"
      />
      <div className="page-signin--form-container">
        <form action="#">
          <div className="form-group">
            <label htmlFor="page-signin__username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="page-signin--form-control form-control"
              id="page-signin__username"
              placeholder="username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="page-signin__password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="page-signin--form-control form-control"
              id="page-signin__password"
              placeholder="password"
              required
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="page-signin__remember"
            />
            <label className="form-check-label" htmlFor="page-signin__remember">
              Keep me logged in
            </label>
          </div>
          <button
            type="button"
            className="btn page-signin--btn-custom btn-lg btn-block mt-5"
          >
            Login Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
