import React from 'react';
import { useSelector } from 'react-redux';

import './ProfileDetail.scss';
import background from '../Signin/sand.jpg';
import { RootState } from '../../state/RootState';
import { authenticationService } from '../../services/authenticationService';

const ProfileDetail: React.FC = () => {
  const currentUser = useSelector(
    (state: RootState) => state.currentUser || null
  );

  const logout = async () => {
    await authenticationService.logout();
  };

  return (
    <div className="page-profile-detail">
      <img
        className="global-bg-img page-profile-detail--bg-img"
        src={background}
        alt="background"
      />
      <div className="page-profile-detail--form-container">
        <div>
          <h1 className="p-4">Profile Details</h1>
          <form>
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
                disabled
                value={currentUser?.username ? currentUser.username : ''}
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
                disabled
                value={currentUser?.email ? currentUser.email : ''}
              />
            </div>
            <button
              onClick={logout}
              className="btn page-profile-detail--btn-custom btn-lg btn-block mt-5 "
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
