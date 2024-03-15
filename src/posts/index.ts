import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { PostsController } from './controllers'
import { PostService } from './services'
import { TagModule } from 'src/tags'

@Module({
    imports: [PrismaModule, ConfigModule, TagModule],
    providers: [PostService],
    controllers: [PostsController],
    exports: [PostService]
})
export class PostModule {}
