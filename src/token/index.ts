import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AdminModule } from 'src/admins'
import { AuthenticationModule } from 'src/authentication'
import { TokenAdminService, TokenService } from 'src/token/services'
import {
    JwtAdminRefreshStrategy,
    JwtAdminStrategy,
    JwtRefreshStrategy,
    JwtStrategy,
    AdminAuthStrategy,
    UserAuthStrategy
} from 'src/token/strategies'
import { UserModule } from 'src/users'

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule,
        forwardRef(() => AuthenticationModule),
        UserModule,
        AdminModule
    ],
    providers: [
        TokenService,
        UserAuthStrategy,
        JwtStrategy,
        JwtRefreshStrategy,
        TokenAdminService,
        AdminAuthStrategy,
        JwtAdminStrategy,
        JwtAdminRefreshStrategy
    ],
    exports: [TokenService, TokenAdminService]
})
export class TokenModule {}
