export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string
    phone: string | null
    avatarUrl: string | null
    role: number
    isEmailVerified: boolean
    createdAt: string
}
