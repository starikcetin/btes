import { CurrentUserData } from './data/CurrentUserData';

export interface CurrentUserSliceState {
  username: string | null;
  email: string | null;
}
