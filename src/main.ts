import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app'
import { PrismaService } from './prisma/service'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)
    const PORT = +configService.get<number>('PORT')

    const prismaService = app.get(PrismaService)
    app.setGlobalPrefix('/api')
    await prismaService.enableShutdownHooks(app)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        })
    )

    await app.listen(PORT)
}
bootstrap()
