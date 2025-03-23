export interface User {
  _id: string;
  username: string;
  email?: string;
  displayName?: string;
  about?: string;
  profilePic?: string;
  createdAt: string;
  profilePicUrl?: string;
}
