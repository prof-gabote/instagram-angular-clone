// models/user.model.ts
export interface User {
  username: string;
  password: string;
  email: string;
  name: string;
  token?: string;
  birthdate?: Date;
  title?: string;
  description?: string;
  profilePicUrl?: string;
  followers?: string;
  following?: string;
}
