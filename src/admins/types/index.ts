import { AdminDto } from '../dto'

export type AdminResponseType = AdminDto & {
    id: string
    createdAt: Date
    updatedAt: Date
}

export interface AdminRequest extends Request {
    user: AdminResponseType
}

export type AdminsResponseType = {
    data: AdminResponseType[]
    totalCount: number
}
