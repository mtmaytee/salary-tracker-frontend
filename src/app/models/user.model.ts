export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  phoneNumber?: string;
  role?: string;
  active?: boolean;
}
