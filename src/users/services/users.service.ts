import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { UpdateUserDto } from '../dtos'
import { AuthenticationProvider } from 'src/authentication/providers'
import { RegisterUserDto } from 'src/authentication/dtos'
import { PaginationQueryDto } from 'src/common/dtos'
import { Prisma } from '@prisma/client'

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

    async findOneByEmail(email: string) {
        return this._prismaService.user.findFirst({
            where: { email: email },
            ...this._select
        })
    }

    async findOne(id: string) {
        const user = await this._prismaService.user.findFirst({
            where: {
                id
            },
            ...this._select
        })

        return user
    }

    async findAll(userPaginationQuery: PaginationQueryDto) {
        const { page = 1, limit = 10, search = undefined } = userPaginationQuery

        const or = search
            ? {
                  OR: [
                      { firstName: { contains: search } },
                      { lastName: { contains: search } },
                      { email: { contains: search } }
                  ]
              }
            : {}

        const [totalCount, data] = await Promise.all([
            this._prismaService.user.count({
                where: {
                    ...or,
                    deletedAt: null
                }
            }),
            this._prismaService.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    ...or,
                    deletedAt: null
                },
                orderBy: { updatedAt: Prisma.SortOrder.desc },
                ...this._select
            })
        ])

        return {
            data,
            totalCount
        }
    }

    async userRegister(registerUserDto: RegisterUserDto) {
        const user = await this.findOneByEmail(registerUserDto.email)
        if (user) {
            throw new BadRequestException(`Email is already taken`)
        }

        const hashedRegistrationDto = {
            ...registerUserDto,
            password: await AuthenticationProvider.generatePassword(registerUserDto.password)
        }

        return this._prismaService.user.create({
            data: { ...hashedRegistrationDto },
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
