import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { CreateUserDTO, UpdateUserDTO } from '../dtos'

@Injectable()
export class UserService {
    constructor(private readonly _prismaService: PrismaService) {}

    async findOne(id: string) {
        const User = await this._prismaService.user.findFirst({
            where: {
                id
            }
        })
        return User
    }

    async findAll() {
        return this._prismaService.user.findMany({})
    }

    async create(createUserDTO: CreateUserDTO) {
        return this._prismaService.user.create({
            data: {
                ...createUserDTO
            }
        })
    }

    async update(id: string, updateUserDTO: UpdateUserDTO) {
        return this._prismaService.user.update({
            where: { id },
            data: {
                ...updateUserDTO
            }
        })
    }

    async delete(id: string) {
        await this.findOne(id)

        return this._prismaService.user.delete({ where: { id } })
    }
}
