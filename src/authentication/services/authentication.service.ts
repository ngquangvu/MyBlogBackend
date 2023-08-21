import { PrismaService } from 'src/prisma/service'
import { UserService } from 'src/users/services'
import { RegisterUserDto } from '../dtos'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthenticationProvider } from '../providers'

@Injectable()
export class AuthService {
    constructor(private readonly _prismaService: PrismaService, private readonly _userService: UserService) {}

    async registration(registrationDto: RegisterUserDto) {
        return await this._userService.userRegister(registrationDto)
    }

    async validateUser(email: string, password: string): Promise<boolean> {
        const user = await this._prismaService.user.findFirst({
            where: { email, deletedAt: null }
        })

        if (!user || !user.password) {
            throw new UnauthorizedException()
        }

        const comparePassword = await AuthenticationProvider.comparePassword(password, user.password)

        if (user && comparePassword) {
            return true
        }

        return false
    }
}
