import React, { useState } from 'react';

import './Signin.scss';
import background from './sand.jpg';

const Signin: React.FC = () => {
  const [isRegistering, setisRegistering] = useState(false);
  return (
    <div className="page-signin">
      <img
        className="global-bg-img page-signin--bg-img"
        src={background}
        alt="background"
      />

      <div className="page-signin--form-container">
        {isRegistering ? (
          <div>
            <h1 className="p-4"> Register to BTES </h1>
            <form action="#">
              <div className="form-group">
                <label htmlFor="page-signin__username" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className="page-signin--form-control form-control"
                  id="page-signin__username"
                  placeholder="example@example.com"
                  required
                />
                <pre></pre>

                <label htmlFor="page-signin__username" className="form-label">
                  Password
                </label>
                <i className="fa fa-password"></i>

                <input
                  type="password"
                  className="page-signin--form-control form-control"
                  id="page-signin__username"
                  placeholder="password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="page-signin__password" className="form-label">
                  Repeat Password
                </label>
                <i className="fa fa-lock"></i>
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
                <label
                  className="form-check-label"
                  htmlFor="page-signin__remember"
                >
                  By creating an account you agree to our{' '}
                  <a href="#">Terms & Privacy. </a>
                </label>
                <label className="label success">&nbsp;&nbsp;</label>
              </div>
              <button
                type="submit"
                className="btn page-signin--btn-custom btn-lg btn-block mt-5 "
              >
                Register
              </button>
              <label className="p-3">
                Already have an account?{' '}
                <a href="#" onClick={() => setisRegistering(false)}>
                  Sign in
                </a>
              </label>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="p-4">Sign In to BTES </h1>
            <form action="#">
              <div className="form-group">
                <label htmlFor="page-signin__username" className="form-label">
                  Username
                </label>
                <i className="fa fa-user"></i>
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
                <i className="fa fa-lock"></i>
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
                <label
                  className="form-check-label"
                  htmlFor="page-signin__remember"
                >
                  Keep me logged in
                </label>
                <label className="label success">
                  &nbsp;&nbsp;
                  <a href="#" className="link-success">
                    Forgot Password?
                  </a>
                </label>
              </div>
              <button
                type="submit"
                className="btn page-signin--btn-custom btn-lg btn-block mt-5 "
              >
                Login Now
              </button>
              <label className="p-3">
                Not a member yet?{' '}
                <a href="#" onClick={() => setisRegistering(true)}>
                  Join now
                </a>
              </label>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signin;
