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

    // Select fields to return
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

    /**
     * Find a single admin by ID
     * @param id - The ID of the admin
     * @returns The admin object if found
     * @throws NotFoundException if the admin is not found
     */
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

    /**
     * Find a user admin by email
     * @param email - The email of the user admin
     * @returns The user admin object if found
     * @throws NotFoundException if the user admin is not found
     */
    async findUserAdmin(email: string): Promise<UserResponseType> {
        const userAdmin = await this._userService.findOneByEmail(email)

        if (!userAdmin) {
            throw new NotFoundException(`Admin user not found`)
        }
        return userAdmin
    }

    /**
     * Find a single admin by email
     * @param email - The email of the admin
     * @returns The admin object if found
     */
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

    /**
     * Find all admins
     * @param adminPaginationQuery - The pagination query parameters
     * @returns The list of admins
     */
    async findMany(adminPaginationQuery: PaginationQueryDto): Promise<AdminsResponseType> {
        const { page = 1, limit = 10, search = undefined } = adminPaginationQuery

        // Search for admins
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

        // Get the total count of admins and the list of admins
        const totalCount = await this._prismaService.admin.count({
            ...where
        })

        // Get the list of admins
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

    /**
     * Update an admin
     * @param id - The ID of the admin
     * @param updateAdminDto - The update admin DTO
     * @returns The updated admin object
     * @throws NotFoundException if the admin is not found
     * @throws BadRequestException if the email is already taken
     * @throws UnauthorizedException if the password is incorrect
     */
    async update(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminResponseType> {
        // Find the admin
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
        // Check if the admin exists
        if (!admin) throw new NotFoundException(`Admin not found`)

        // Check if the email is already taken
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

        // Check if the password is correct
        const comparePassword = await AuthenticationProvider.comparePassword(updateAdminDto.password, admin.password)
        if (!comparePassword) throw new UnauthorizedException(`Incorrect password`)

        // Update the admin
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

    /**
     * Delete an admin
     * @param id - The ID of the admin
     * @param requestAdmin - The request admin object
     * @returns The deleted admin object
     * @throws UnauthorizedException if the admin tries to self-delete
     */
    async delete(id: string, requestAdmin: AdminResponseType): Promise<AdminResponseType> {
        if (requestAdmin.id === id) throw new UnauthorizedException('You cannot self-delete.')

        return this._prismaService.admin.delete({
            where: { id },
            ...this._select
        })
    }

    /**
     * Create an admin
     * @param createAdminDto - The create admin DTO
     * @returns The created admin object
     * @throws BadRequestException if the email is already taken
     */
    async create(createAdminDto: CreateAdminDto): Promise<AdminResponseType> {
        const admin = await this.findOneByEmail(createAdminDto.email)
        if (admin) {
            throw new BadRequestException(`Email is already taken`)
        }

        // Hash the password
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
