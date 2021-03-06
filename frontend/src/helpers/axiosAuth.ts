import axios from 'axios';

import { store } from '../state/store';
import { userSlice } from '../state/user/userSlice';

export default () => {
  const headers = { Authorization: '' };
  const jwtToken = localStorage.getItem('jwt');
  if (jwtToken) {
    headers.Authorization = 'Bearer ' + jwtToken;
  }
  const axiosInstance = axios.create({ headers });
  axiosInstance.interceptors.response.use(
    (response) =>
      new Promise((resolve, reject) => {
        resolve(response);
      }),
    (error) => {
      if (!error.response) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
      if (error.response.status === 401) {
        console.log(error);
        localStorage.removeItem('jwt');
        store.dispatch(userSlice.actions.removeCurrentUser());
        window.location.href = '/signin';
      } else {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    }
  );

  return axiosInstance;
};
