import { AuthLoginRequestBody } from '../common/auth/AuthLoginBody';
import { AuthRegisterRequestBody } from '../common/auth/AuthRegisterBody';
import axios from 'axios';
import axiosAuth from '../helpers/axiosAuth';
import { Simulate } from 'react-dom/test-utils';

class AuthenticationService {
  public async login(body: AuthLoginRequestBody) {
    return await axios
      .post('api/rest/auth/login', {
        ...body,
      })
      .then((response) => {
        localStorage.setItem('jwt', response.data);
        return response.data;
        console.log(response);
      })
      .catch((error) => {
        return new Promise((resolve, reject) => {
          console.log('ERROR', error?.response.data);
          reject(error);
          return null;
        });
      });
  }

  public async logout() {
    await axiosAuth()
      .post('api/rest/auth/logout')
      .catch((err) => console.log(err));
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
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

  public async loginWithFetch(
    body: AuthLoginRequestBody
  ): Promise<string | null> {
    try {
      const response = await fetch('api/rest/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const result = await response.json();
      console.log(result);
      localStorage.setItem('jwt', result);
      return result;
    } catch (e) {
      console.log(e);
    }
    return null;
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
}

export const authenticationService = new AuthenticationService();
