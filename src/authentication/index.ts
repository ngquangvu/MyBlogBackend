import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma'
import { AuthAdminService, AuthService } from 'src/authentication/services'
import { AuthenticationProvider } from 'src/authentication/providers'
import { UserModule } from 'src/users'
import { TokenModule } from 'src/token'
import { AuthController } from './controllers/authentication.controller'
import { AuthAdminController } from './controllers/authentication.admin.controller'
import { AdminModule } from 'src/admins'

@Module({
    imports: [PrismaModule, UserModule, AdminModule, TokenModule],
    providers: [AuthService, AuthAdminService, AuthenticationProvider],
    controllers: [AuthController, AuthAdminController],
    exports: [AuthService, AuthAdminService]
})
export class AuthenticationModule {}
