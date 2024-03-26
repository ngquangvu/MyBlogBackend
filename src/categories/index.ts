import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { CategoriesController } from './controllers'
import { CategoriesService } from './services'
import { CategoriesAdminController } from './controllers/categories.admin.controller'

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [CategoriesService],
    controllers: [CategoriesController, CategoriesAdminController],
    exports: [CategoriesService]
})
export class CategoryModule {}
