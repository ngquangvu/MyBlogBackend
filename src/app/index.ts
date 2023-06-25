import * as Joi from '@hapi/joi'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from 'src/users'
import { NODE_ENV } from './constants'

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                NODE_ENV: Joi.string().required().valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION)
            })
        }),

        UserModule
    ]
})
export class AppModule {}
