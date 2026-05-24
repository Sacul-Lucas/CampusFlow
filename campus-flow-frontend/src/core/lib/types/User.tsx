export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'teacher' | 'student' | 'admin';
    password?: string;
    createdAt?: string;
    updatedAt?: string;
}