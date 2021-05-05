import React, { SyntheticEvent, useState } from 'react';
import { useSelector } from 'react-redux';

import './ProfileDetail.scss';
import background from '../Signin/sand.jpg';
import { RootState } from '../../state/RootState';
import { authenticationService } from '../../services/authenticationService';
import { Alert, Button } from 'react-bootstrap';

const ProfileDetail: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [alertShow, setAlertShow] = useState(false);
  const currentUser = useSelector(
    (state: RootState) => state.currentUser || null
  );
  const [userName, setUsername] = useState(
    currentUser?.username ? currentUser.username : ''
  );
  const [email, setEmail] = useState(
    currentUser?.email ? currentUser.email : ''
  );
  const [password, setPassword] = useState('');

  const logout = async () => {
    await authenticationService.logout();
  };

  const update = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setAlertShow(false);
    const body = {
      username: userName,
      newPassword: password,
      email,
      oldUsername: currentUser?.username ? currentUser.username : '',
    };
    try {
      const response = await authenticationService.update(body);
      if (response === true) {
        //to refresh token user must login again with new username and password
        await authenticationService.login({ username: userName, password });
        setAlertShow(true);
      } else {
        setAlertShow(true);
        setError("Couldn't update. Not unique email or username!" + response);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="page-profile-detail">
      <Alert
        className="page-profile-detail--alert mr-4"
        size={10}
        show={alertShow}
        variant={error === '' ? 'success' : 'danger'}
        onClose={() => setAlertShow(false)}
        dismissible
      >
        {error === '' ? 'Successfully Updated' : 'Error'}
        <p>{error}</p>
      </Alert>

      <img
        className="global-bg-img page-profile-detail--bg-img"
        src={background}
        alt="background"
      />
      <div className="page-profile-detail--form-container">
        <div>
          <h1 className="p-4">Profile Details</h1>
          <form onSubmit={update}>
            <div className="form-group">
              <label
                htmlFor="page-profile-detail__username"
                className="form-label"
              >
                Username
              </label>
              <input
                type="username"
                className="page-profile-detail--form-control form-control"
                id="page-profile-detail__username"
                placeholder="username"
                required
                value={userName}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />

              <label
                htmlFor="page-profile-detail__email"
                className="form-label"
              >
                E-mail
              </label>
              <input
                type="email"
                className="page-profile-detail--form-control form-control"
                id="page-profile-detail__email"
                placeholder="example@example.com"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />

              <label
                htmlFor="page-profile-detail__password"
                className="form-label"
              >
                New Password
              </label>
              <i className="fa fa-password"></i>
              <input
                type="password"
                className="page-profile-detail--form-control form-control"
                id="page-profile-detail__password"
                placeholder="password"
                required
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </div>
            <div className="row d-flex justify-content-between">
              <button type="submit" className="btn btn-primary  btn-lg mt-5 ">
                Update
              </button>
              <button
                onClick={logout}
                className="btn btn-danger  btn-lg  mt-5 "
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
