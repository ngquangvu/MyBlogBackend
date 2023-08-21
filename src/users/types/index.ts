import { Role } from '@prisma/client'

export type UserResponseType = {
    id: string
    email: string
    firstName: string
    lastName: string
    role: Role
}

export interface UserRequest extends Request {
    user: UserResponseType
}

export type UsersResponseType = {
    data: UserResponseType[]
    totalCount: number
}
