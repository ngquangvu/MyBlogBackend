import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { SubscribersAdminController } from './controllers'
import { SubscribersController } from './controllers/subscribers.controller'
import { SubscribersService } from './services'

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [SubscribersService],
    controllers: [SubscribersController, SubscribersAdminController],
    exports: [SubscribersService]
})
export class SubscriberModule {}
