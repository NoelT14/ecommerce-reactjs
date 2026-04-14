export const ROLE = {
    CUSTOMER: 1,
    STAFF: 2,
    VENDOR: 3,
    ADMIN: 4,
} as const

export type RoleValue = typeof ROLE[keyof typeof ROLE]
