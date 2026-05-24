export const UserRole = {
    Student: 'student',
    Teacher: 'teacher',
} as const;

export const AdminUserRole = {
    Student: 'student',
    Teacher: 'teacher',
    Administrator: 'admin',
} as const;

export type AdminUserRole = typeof AdminUserRole[keyof typeof AdminUserRole];

export type UserRole = typeof UserRole[keyof typeof UserRole];