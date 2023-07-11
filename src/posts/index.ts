import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { PostsController } from './controllers'
import { PostService } from './services'

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [PostService],
    controllers: [PostsController],
    exports: [PostService]
})
export class UserModule {}
