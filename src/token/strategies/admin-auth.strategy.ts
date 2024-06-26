import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AdminService } from 'src/admins/services'
import { AdminResponseType } from 'src/admins/types'
import { AuthAdminService } from 'src/authentication/services'

@Injectable()
export class AdminAuthStrategy extends PassportStrategy(Strategy, 'admin-auth') {
    constructor(private readonly _authAdminService: AuthAdminService, private readonly _adminService: AdminService) {
        super({ usernameField: 'email' })
    }

    /*
     * Validate the admin credentials
     * @param email - The email of the admin
     * @param password - The password of the admin
     * @returns The admin response type
     * @throws UnauthorizedException if the admin is not valid
     */
    async validate(email: string, password: string): Promise<AdminResponseType> {
        const validatedAdmin = await this._authAdminService.validateAdmin(email, password)
        if (!validatedAdmin) {
            throw new UnauthorizedException()
        }

        return await this._adminService.findOneByEmail(email)
    }
}
