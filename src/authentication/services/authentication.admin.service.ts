import { PrismaService } from 'src/prisma/service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthenticationProvider } from '../providers'

@Injectable()
export class AuthAdminService {
    constructor(private readonly _prismaService: PrismaService) {}

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
