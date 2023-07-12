import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient, Role } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super()
        this.$use(async (params, next) => {
            if (params.model === 'User') {
                if (
                    params.action === 'findFirst' ||
                    params.action === 'findMany' ||
                    params.action === 'findRaw' ||
                    params.action === 'findUnique'
                ) {
                }
            }

            const result = await next(params)

            return result
        })
    }

    async onModuleInit() {
        await this.$connect()
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close()
        })
    }
}
