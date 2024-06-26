import { PrismaService } from 'src/prisma/service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthenticationProvider } from '../providers'

@Injectable()
export class AuthAdminService {
    constructor(private readonly _prismaService: PrismaService) {}

    /*
     * Validate the admin credentials
     * @param email - The email of the admin
     * @param password - The password of the admin
     * @returns True if the admin is valid
     * @throws UnauthorizedException if the admin is not valid
     */
    async validateAdmin(email: string, password: string): Promise<boolean> {
        const admin = await this._prismaService.admin.findFirst({
            where: { email, deletedAt: null }
        })

        if (!admin || !admin.password) {
            throw new UnauthorizedException()
        }

        const comparePassword = await AuthenticationProvider.comparePassword(password, admin.password)

        if (admin && comparePassword) {
            return true
        }

        return false
    }
}
