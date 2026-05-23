export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
}
