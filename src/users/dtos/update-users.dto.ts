import { UserDTO } from './users.dto'

export class UpdateUserDTO implements Omit<UserDTO, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    email: string
    firstName: string
    lastName: string
    status: number
    userId: string
    title: string
    url: string
    publicAt: '' | Date
    closedAt: '' | Date
}
