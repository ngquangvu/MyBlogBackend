import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { UpdateUserDto } from '../dtos'
import { Role } from '@prisma/client'

@Injectable()
export class UserService {
    constructor(private readonly _prismaService: PrismaService) {}

    private readonly _select = {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
        }
    }

    async findOne(id: string) {
        const user = await this._prismaService.user.findFirst({
            where: {
                id,
                NOT: {
                    role: Role.ADMIN
                }
            },
            ...this._select
        })

        return user
    }

    async findAll() {
        return this._prismaService.user.findMany({
            where: {
                NOT: {
                    role: Role.ADMIN
                }
            },
            ...this._select
        })
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return this._prismaService.user.update({
            where: { id },
            data: {
                ...updateUserDto
            },
            ...this._select
        })
    }

    async delete(id: string) {
        await this.findOne(id)

        return this._prismaService.user.delete({ where: { id }, ...this._select })
    }
}
