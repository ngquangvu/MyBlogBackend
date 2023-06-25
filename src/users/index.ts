import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { UsersController } from './controllers'
import { UserService } from './services'

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [UserService],
    controllers: [UsersController],
    exports: [UserService]
})
export class UserModule {}
