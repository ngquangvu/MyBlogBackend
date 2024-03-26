import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { PostsController } from './controllers'
import { PostService } from './services'
import { TagModule } from 'src/tags'
import { PostsAdminController } from './controllers/posts.admin.controller'

@Module({
    imports: [PrismaModule, ConfigModule, TagModule],
    providers: [PostService],
    controllers: [PostsController, PostsAdminController],
    exports: [PostService]
})
export class PostModule {}
