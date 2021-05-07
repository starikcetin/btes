import { hasValue } from '../common/utils/hasValue';
import { useUsername } from './useUsername';

export const useIsAuthenticated = (): boolean => {
  const username = useUsername();
  return hasValue(username);
};
