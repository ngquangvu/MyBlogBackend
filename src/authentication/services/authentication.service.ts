import { PrismaService } from 'src/prisma/service'
import { UserService } from 'src/users/services'
import { RegisterUserDto } from '../dtos'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthenticationProvider } from '../providers'

@Injectable()
export class AuthService {
    constructor(private readonly _prismaService: PrismaService, private readonly _userService: UserService) {}

    /*
     * Register a new user
     * @param registrationDto - The registration data
     * @returns The user object
     */
    async registration(registrationDto: RegisterUserDto) {
        return await this._userService.userRegister(registrationDto)
    }

    /*
     * Validate the user credentials
     * @param email - The email of the user
     * @param password - The password of the user
     * @returns True if the user is valid
     * @throws UnauthorizedException if the user is not valid
     */
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
