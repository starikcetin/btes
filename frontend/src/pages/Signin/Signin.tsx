import React from 'react';
import { Link } from 'react-router-dom';
import Sandbox from '../Sandbox/Sandbox';

import './Signin.scss';
import background from './sand.jpg';

const Signin: React.FC = () => {
  return (
    <div className="page-signin">
      <div className="container">
        <div className="col p-0 text-center d-flex justify-content-center align-items-center display-none">
          <div className="col p-0  bg-custom d-flex justify-content-center align-items-center flex-column w-100">
            <img
              className="global-bg-img page-signin--bg-img"
              src={background}
              alt="background"
            />
            <div className="container">
              <label>
                <i className="far">&#xf007;</i>
                <h1 className="right"> LOG IN </h1>
              </label>

              <form className="w-75" action="#">
                <div className="mb-3">
                  <label id="exampleFormControlInput1" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="username"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label id="exampleFormControlInput2" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleFormControlInput2"
                    placeholder="password"
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label className="form-check-label" id="flexCheckDefault">
                        Keep me logged in
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-custom btn-lg btn-block mt-3"
                >
                  Login Now
                </button>
                <p></p>
                <label>
                  Not a member ?<a href="#"> Sign Up </a>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
