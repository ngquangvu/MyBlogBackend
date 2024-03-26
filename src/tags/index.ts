import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { TagsService } from './services'
import { TagsController } from './controllers/tags.controller'
import { TagsAdminController } from './controllers'

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [TagsService],
    controllers: [TagsController, TagsAdminController],
    exports: [TagsService]
})
export class TagModule {}
