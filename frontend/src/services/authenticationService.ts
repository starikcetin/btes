import { AuthLoginRequestBody } from '../common/auth/AuthLoginBody';
import { AuthRegisterRequestBody } from '../common/auth/AuthRegisterBody';
import { UserData } from '../common/database/UserData';
import axios from 'axios';
import axiosAuth from '../helpers/axiosAuth';
import { store } from '../state/store';
import { userSlice } from '../state/user/userSlice';

class AuthenticationService {
  public async login(body: AuthLoginRequestBody): Promise<string> {
    return await axios
      .post('api/rest/auth/login', {
        ...body,
      })
      .then((response) => {
        localStorage.setItem('jwt', response.data);
        return response.data;
      })
      .catch((error) => {
        return new Promise((resolve, reject) => {
          reject(error?.response.data);
        });
      });
  }

  public async logout() {
    await axiosAuth()
      .post('api/rest/auth/logout')
      .catch((err) => console.log(err));
    localStorage.removeItem('jwt');
    store.dispatch(userSlice.actions.removeCurrentUser());
  }

  public async register(body: AuthRegisterRequestBody): Promise<string | null> {
    return await axios
      .post(
        'api/rest/auth/register',
        {
          ...body,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => console.log(err));
  }

  public async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const response = await axios.get(
        'api/rest/auth/isUsernameAvailable/' + username
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
    return true;
  }

  public async isEmailAvailable(email: string): Promise<boolean> {
    try {
      const response = await axios.get(
        'api/rest/auth/isEmailAvailable/' + email
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
    return true;
  }

  public async isTokenValid(): Promise<number | null> {
    if (localStorage.getItem('jwt')) {
      return await axiosAuth()
        .post('api/rest/auth/secure-echo', { message: 'test' })
        .then((res) => {
          return res.status;
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem('jwt');
          return null;
        });
    }
    return null;
  }

  public async userDetails(): Promise<UserData> {
    return await axiosAuth()
      .get('api/rest/auth/userDetails')
      .then((response) => {
        store.dispatch(
          userSlice.actions.setCurrentUser({
            username: response.data.username,
            email: response.data.email,
          })
        );
        return response.data;
      })
      .catch((error) => {
        return new Promise((resolve, reject) => {
          console.log('ERROR', error?.response.data);
          reject(error?.response.data);
        });
      });
  }
}

export const authenticationService = new AuthenticationService();
