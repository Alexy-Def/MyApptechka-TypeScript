import { USER_ROLE } from '@modules/users/constants';

export type AuthUserType = {
  id: number;
  role: USER_ROLE;
};
