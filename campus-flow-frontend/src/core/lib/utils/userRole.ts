export const UserRole = {
    Student: 'student',
    Teacher: 'teacher',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];