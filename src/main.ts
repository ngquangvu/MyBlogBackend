import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app'
import * as cookieParser from 'cookie-parser'
import { PrismaService } from './prisma/service'
import * as express from 'express'
import { NODE_ENV } from './app/constants'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const reflector = app.get(Reflector)
    const configService = app.get(ConfigService)
    const PORT = +configService.get<number>('PORT')

    const prismaService = app.get(PrismaService)
    app.setGlobalPrefix(configService.get<string>('API_PREFIX'))
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

    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))
    app.enableCors({
        origin: [configService.get<string>('FRONT_URL'), configService.get<string>('ADMIN_DOMAIN')],
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
        credentials: true
    })
    app.use(cookieParser())

    if (configService.get<string>('NODE_ENV') === NODE_ENV.DEVELOPMENT) {
        app.use('/media', express.static(`${configService.get<number>('UPLOADED_FILES_PATH')}`))
    }

    await app.listen(PORT)
}
bootstrap()
