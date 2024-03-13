import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { PostsController } from './controllers'
import { PostService } from './services'
import { CategoryModule } from 'src/categories'

@Module({
    imports: [PrismaModule, ConfigModule, CategoryModule],
    providers: [PostService],
    controllers: [PostsController],
    exports: [PostService]
})
export class PostModule {}
