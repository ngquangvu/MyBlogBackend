import * as Joi from '@hapi/joi'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from 'src/users'
import { NODE_ENV } from './constants'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TransformInterceptor } from 'src/common/api/interceptors/transform.interceptor'

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                NODE_ENV: Joi.string().required().valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION)
            })
        }),

        UserModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor
        }
    ]
})
export class AppModule {}
