import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { UpdateUserDto } from '../dtos'
import { AuthenticationProvider } from 'src/authentication/providers'
import { RegisterUserDto } from 'src/authentication/dtos'
import { PaginationQueryDto } from 'src/common/dtos'
import { Prisma } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
    constructor(private readonly _prismaService: PrismaService, private readonly _configService: ConfigService) {}
    private readonly _pageLimit = this._configService.get<number>('PAGINATION_LIMIT')

    // Define the select fields for the user
    private readonly _select = {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            posts: {
                select: {
                    id: true
                }
            },
            role: true
        }
    }

    // Define the select fields for the user for admin
    private readonly _selectAdmin = {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            posts: {
                select: {
                    id: true
                }
            },
            role: true,

            createdAt: true,
            updatedAt: true,
            deletedAt: true
        }
    }

    /*
     * Find a single user by email
     * @param email - The email of the user
     * @returns The user object if found
     */
    async findOneByEmail(email: string) {
        return this._prismaService.user.findFirst({
            where: { email: email ? email : '' },
            ...this._select
        })
    }

    /*
     * Find a single user by ID
     * @param id - The ID of the user
     * @returns The user object if found
     */
    async findOne(id: string) {
        const user = await this._prismaService.user.findFirst({
            where: {
                id
            },
            ...this._select
        })

        return user
    }

    /*
     * Find all users
     * @param userPaginationQuery - The pagination query
     * @param byAdmin - Whether the request is by an admin
     * @returns The list of users
     */
    async findAll(userPaginationQuery: PaginationQueryDto, byAdmin = false) {
        const { page = 1, limit = this._pageLimit, search = undefined } = userPaginationQuery

        // Define the OR condition for the search
        const or = search
            ? {
                  OR: [
                      { firstName: { contains: search } },
                      { lastName: { contains: search } },
                      { email: { contains: search } }
                  ]
              }
            : {}

        // Get the total count of users and the list of users
        const [totalCount, data] = await Promise.all([
            this._prismaService.user.count({
                where: {
                    ...or
                }
            }),
            this._prismaService.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    ...or
                },
                orderBy: { createdAt: Prisma.SortOrder.desc },
                select: byAdmin ? this._selectAdmin.select : this._select.select
            })
        ])

        return {
            data,
            totalCount
        }
    }

    /*
     * Register a new user
     * @param registerUserDto - The registration data
     * @returns The user object
     */
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

    /*
     * Update a user
     * @param id - The ID of the user
     * @param updateUserDto - The data to update the user
     * @returns The updated user object
     */
    async update(id: string, updateUserDto: UpdateUserDto) {
        return this._prismaService.user.update({
            where: { id },
            data: {
                ...updateUserDto
            },
            ...this._select
        })
    }

    /*
     * Delete a user
     * @param id - The ID of the user
     * @returns The deleted user object
     */
    async delete(id: string) {
        await this.findOne(id)

        return this._prismaService.user.update({
            where: { id },
            data: {
                deletedAt: new Date()
            },
            ...this._select
        })
    }

    /*
     * Restore a user
     * @param id - The ID of the user
     * @returns The restored user object
     */
    async restore(id: string) {
        return this._prismaService.user.update({
            data: {
                deletedAt: null
            },
            where: { id }
        })
    }
}
