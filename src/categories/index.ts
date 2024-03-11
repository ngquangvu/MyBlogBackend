import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { CategoriesController } from './controllers'
import { CategoriesService } from './services'

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [CategoriesService],
    controllers: [CategoriesController],
    exports: [CategoriesService]
})
export class CategoryModule {}
