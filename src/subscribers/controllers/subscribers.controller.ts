import { Controller, Request, Post, Body, Bind, Param, Patch } from '@nestjs/common'
import { SubscribersService } from '../services'
import { SubscriberDto } from '../dtos'

@Controller('subscribers')
export class SubscribersController {
    constructor(private readonly _subscriberService: SubscribersService) {}
    @Post()
    @Bind(Request())
    async create(@Body() createSubscriber: SubscriberDto) {
        return await this._subscriberService.create(createSubscriber)
    }

    @Patch('unSubscribe/:email')
    @Bind(Request())
    async unSubscribe(@Param('email') email: string) {
        return await this._subscriberService.unSubscribe(email)
    }
}
