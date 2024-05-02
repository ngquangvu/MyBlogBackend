import { Controller, Get, Request, Post, Body, Bind, Param, Delete, UseGuards, Query, Patch } from '@nestjs/common'
import { PaginationQueryDto } from 'src/common/dtos'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { SubscriberDto, UpdateSubscriberDto } from '../dtos'
import { SubscribersService } from '../services'

@Controller('admin/subscribers')
@UseGuards(JwtAdminAuthGuard)
export class SubscribersAdminController {
    constructor(private readonly _subscriberService: SubscribersService) {}

    @Post()
    @Bind(Request())
    async create(@Body() createSubscriber: SubscriberDto) {
        return await this._subscriberService.create(createSubscriber)
    }

    @Patch(':id')
    @Bind(Request())
    async updateAdmin(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto) {
        return await this._subscriberService.update(id, updateSubscriberDto)
    }

    @Get()
    async findAll(@Query() subscriberPaginationQuery: PaginationQueryDto) {
        return await this._subscriberService.findAll(subscriberPaginationQuery)
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this._subscriberService.findOne(id)
    }

    @Delete(':id')
    @UseGuards(JwtAdminAuthGuard)
    async delete(@Param('id') id: string) {
        return await this._subscriberService.delete(id)
    }

    @Patch('/restore/:id')
    @Bind(Request())
    async restore(@Param('id') id: string) {
        return await this._subscriberService.restore(id)
    }
}
