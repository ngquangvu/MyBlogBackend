import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service'
import { AdminResponseType, AdminsResponseType } from '../types'
import { PaginationQueryDto } from 'src/common/dtos'
import { CreateAdminDto, UpdateAdminDto } from '../dto'
import { AuthenticationProvider } from 'src/authentication/providers'
import { UserResponseType } from 'src/users/types'
import { UserService } from 'src/users/services'

@Injectable()
export class AdminService {
    constructor(private readonly _prismaService: PrismaService, private readonly _userService: UserService) {}

    private readonly _select = {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    }

    async findOne(id: string): Promise<AdminResponseType> {
        const admin = await this._prismaService.admin.findFirst({
            where: {
                id,
                deletedAt: null
            },
            ...this._select
        })

        if (!admin) {
            throw new NotFoundException(`Admin not found`)
        }
        return admin
    }

    async findUserAdmin(email: string): Promise<UserResponseType> {
        const userAdmin = await this._userService.findOneByEmail(email)

        if (!userAdmin) {
            throw new NotFoundException(`Admin user not found`)
        }
        return userAdmin
    }

    async findOneByEmail(email: string): Promise<AdminResponseType> {
        const admin = await this._prismaService.admin.findFirst({
            where: {
                email,
                deletedAt: null
            },
            ...this._select
        })

        return admin
    }

    async findMany(adminPaginationQuery: PaginationQueryDto): Promise<AdminsResponseType> {
        const { page = 1, limit = 10, search = undefined } = adminPaginationQuery

        const where = {
            where: {
                deletedAt: null,
                OR: search
                    ? [
                          { email: { contains: search } },
                          { firstName: { contains: search } },
                          { lastName: { contains: search } }
                      ]
                    : undefined
            }
        }

        const totalCount = await this._prismaService.admin.count({
            ...where
        })

        const admins = await this._prismaService.admin.findMany({
            skip: (page - 1) * limit,
            take: limit,
            ...where,
            orderBy: { createdAt: 'desc' },
            ...this._select
        })

        return {
            data: admins,
            totalCount
        }
    }

    async update(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminResponseType> {
        const admin = await this._prismaService.admin.findFirst({
            where: {
                id,
                deletedAt: null
            },
            select: {
                email: true,
                password: true
            }
        })

        if (!admin) throw new NotFoundException(`Admin not found`)

        const checkEmailAvailability = await this._prismaService.admin.findFirst({
            where: {
                email: updateAdminDto.email,
                deletedAt: null
            },
            select: {
                email: true
            }
        })
        if (checkEmailAvailability) {
            throw new BadRequestException(`Email is already taken`)
        }

        const comparePassword = await AuthenticationProvider.comparePassword(updateAdminDto.password, admin.password)

        if (!comparePassword) throw new UnauthorizedException(`Incorrect password`)

        if (updateAdminDto.password) {
            const hashedPassword = await AuthenticationProvider.generatePassword(updateAdminDto.newPassword)
            updateAdminDto.newPassword = hashedPassword
            delete updateAdminDto.confirmPassword
        }

        return this._prismaService.admin.update({
            where: { id },
            data: {
                email: updateAdminDto.email
            },
            ...this._select
        })
    }

    async delete(id: string, requestAdmin: AdminResponseType): Promise<AdminResponseType> {
        if (requestAdmin.id === id) throw new UnauthorizedException('You cannot self-delete.')

        return this._prismaService.admin.delete({
            where: { id },
            ...this._select
        })
    }

    async create(createAdminDto: CreateAdminDto): Promise<AdminResponseType> {
        const admin = await this.findOneByEmail(createAdminDto.email)
        if (admin) {
            throw new BadRequestException(`Email is already taken`)
        }

        const hashedRegistrationDto = {
            ...createAdminDto,
            password: await AuthenticationProvider.generatePassword(createAdminDto.password)
        }
        return this._prismaService.admin.create({
            data: { ...hashedRegistrationDto },
            ...this._select
        })
    }
}
