import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { AdminController } from './controllers'
import { AdminService } from './services'
import { AuthenticationProvider } from 'src/authentication/providers'
import { UserModule } from 'src/users'

@Module({
    imports: [PrismaModule, ConfigModule, UserModule, AuthenticationProvider],
    providers: [AdminService],
    controllers: [AdminController],
    exports: [AdminService]
})
export class AdminModule {}
