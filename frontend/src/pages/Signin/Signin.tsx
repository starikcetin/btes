import React, { SyntheticEvent, useState } from 'react';

import './Signin.scss';
import background from './sand.jpg';
import { authenticationService } from '../../services/authenticationService';
import { AuthLoginRequestBody } from '../../../../common/src/auth/AuthLoginBody';
import { AuthRegisterRequestBody } from '../../../../common/src/auth/AuthRegisterBody';
import { useHistory } from 'react-router-dom';

interface IFormError {
  username: string;
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  const history = useHistory();
  const [isRegistering, setisRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<IFormError>({
    username: '',
    email: '',
    password: '',
  });

  const validateUsernameAndEmail = async () => {
    const isUsernameAvailable = await authenticationService.isUsernameAvailable(
      username
    );
    const isEmailAvailable = await authenticationService.isEmailAvailable(
      email
    );

    if (!isUsernameAvailable) {
      setFormError((prevState) => {
        return { ...prevState, username: 'The username already taken!' };
      });
      return false;
    } else {
      setFormError((prevState) => {
        return { ...prevState, username: '' };
      });
    }

    if (!isEmailAvailable) {
      setFormError((prevState) => {
        return { ...prevState, email: 'The email address already used!' };
      });
      return false;
    } else {
      setFormError((prevState) => {
        return { ...prevState, email: '' };
      });
    }
    return true;
  };

  const validatePassword = () => {
    if (password === passwordRepeat) {
      return true;
    }
    setFormError((prevState) => {
      return { ...prevState, password: 'Passwords does not match!' };
    });
    return false;
  };

  const login = async (e: SyntheticEvent) => {
    e.preventDefault();
    const body: AuthLoginRequestBody = {
      username: username,
      password: password,
    };
    console.log('login called');
    const response = await authenticationService.login(body);
    console.log(response);
    if (response === null) {
      console.log('username or password wrong');
    } else {
      localStorage.setItem('username', username);
      history.push('/');
    }
  };

  const register = async (e: SyntheticEvent) => {
    e.preventDefault();
    const body: AuthRegisterRequestBody = {
      username: username,
      password: password,
      email: email,
    };

    setFormError({ username: '', email: '', password: '' });

    if ((await validateUsernameAndEmail()) && validatePassword()) {
      const response = await authenticationService.register(body);
      window.location.reload();
      console.log(response);
    }
  };

  const logout = () => {
    authenticationService.logout();
  };

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
            <form onSubmit={register}>
              <div className="form-group">
                <label htmlFor="page-signin__username" className="form-label">
                  Username
                </label>
                <input
                  type="username"
                  className="page-signin--form-control form-control"
                  id="page-signin__username"
                  placeholder="username"
                  required
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
                <span className="text-danger">{formError.username}</span>
                <pre></pre>
                <label htmlFor="page-signin__email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className="page-signin--form-control form-control"
                  id="page-signin__email"
                  placeholder="example@example.com"
                  required
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                <span className="text-danger">{formError.email}</span>
                <pre></pre>

                <label htmlFor="page-signin__password" className="form-label">
                  Password
                </label>
                <i className="fa fa-password"></i>

                <input
                  type="password"
                  className="page-signin--form-control form-control"
                  id="page-signin__password"
                  placeholder="password"
                  required
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
                <span className="text-danger">{formError.password}</span>
              </div>
              <label
                htmlFor="page-signin__password-repeat"
                className="form-label"
              >
                Repeat Password
              </label>
              <i className="fa fa-lock"></i>
              <input
                type="password"
                className="page-signin--form-control form-control"
                id="page-signin__password-repeat"
                placeholder="password"
                required
                onChange={(event) => {
                  setPasswordRepeat(event.target.value);
                }}
              />

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
            <form onSubmit={login}>
              <div className="form-group">
                <label htmlFor="page-signin__username" className="form-label">
                  Username or email address
                </label>
                <i className="fa fa-user"></i>
                <input
                  type="text"
                  className="page-signin--form-control form-control"
                  id="page-signin__username"
                  placeholder="username or email"
                  required
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
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
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
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
                  Keep me signed in
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
                Sign in Now
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
