import * as Joi from '@hapi/joi'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from 'src/users'
import { NODE_ENV } from './constants'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { TransformInterceptor } from 'src/common/core/interceptors'
import { AdminModule } from 'src/admins'
import { AuthenticationModule } from 'src/authentication'
import { TokenModule } from 'src/token'
import { HttpExceptionFilter } from 'src/common/core/httpExceptionFilters/httpExceptionFilters'

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                NODE_ENV: Joi.string().required().valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION),
                FRONT_URL: Joi.string().required(),
                ADMIN_URL: Joi.string().required(),
                ADMIN_DOMAIN: Joi.string().required(),
                JWT_ACCESS_SECRET: Joi.string().required(),
                JWT_ACCESS_EXPIRATION_TIME: Joi.number().required(),
                JWT_REFRESH_SECRET: Joi.string().required(),
                JWT_REFRESH_EXPIRATION_TIME: Joi.number().required(),
                JWT_ADMIN_ACCESS_SECRET: Joi.string().required(),
                JWT_ADMIN_ACCESS_EXPIRATION_TIME: Joi.number().required(),
                JWT_ADMIN_REFRESH_SECRET: Joi.string().required(),
                JWT_ADMIN_REFRESH_EXPIRATION_TIME: Joi.number().required()
            })
        }),
        TokenModule,
        AuthenticationModule,
        UserModule,
        AdminModule
    ],
    providers: [
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }
    ]
})
export class AppModule {}
