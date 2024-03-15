import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma'
import { TagsController } from './controllers'
import { TagsService } from './services'

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [TagsService],
    controllers: [TagsController],
    exports: [TagsService]
})
export class TagModule {}
