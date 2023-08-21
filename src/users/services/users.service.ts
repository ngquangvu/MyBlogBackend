import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { UpdateUserDto } from '../dtos'
import { AuthenticationProvider } from 'src/authentication/providers'
import { RegisterUserDto } from 'src/authentication/dtos'

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

    async findAll() {
        return this._prismaService.user.findMany({
            where: {},
            ...this._select
        })
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
