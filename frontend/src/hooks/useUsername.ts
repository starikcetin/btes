import { useSelector } from 'react-redux';
import { RootState } from '../state/RootState';

export const useUsername = (): string | null => {
  return useSelector((state: RootState) => state.currentUser.username);
};
