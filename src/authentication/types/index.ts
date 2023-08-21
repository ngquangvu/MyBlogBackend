import { Admin, User } from '@prisma/client'

export type AuthenticationResponseType = Pick<User, 'id' | 'email'>

export type AuthenticationAdminResponseType = Pick<Admin, 'id' | 'email'>
