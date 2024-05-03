import { Controller, Request, Post, Body, Bind, Param, Patch } from '@nestjs/common'
import { SubscribersService } from '../services'
import { SubscriberUserDto } from '../dtos/subscribers.user.dto'

@Controller('subscribers')
export class SubscribersController {
    constructor(private readonly _subscriberService: SubscribersService) {}
    @Post()
    @Bind(Request())
    async create(@Body() createSubscriber: SubscriberUserDto) {
        return await this._subscriberService.subscribe(createSubscriber)
    }

    @Patch('unSubscribe/:email')
    @Bind(Request())
    async unSubscribe(@Param('email') email: string) {
        return await this._subscriberService.unSubscribe(email)
    }
}
