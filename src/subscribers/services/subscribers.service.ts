import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PaginationQueryDto } from 'src/common/dtos'
import { Prisma } from '@prisma/client'
import { SubscriberDto, UpdateSubscriberDto } from '../dtos'

@Injectable()
export class SubscribersService {
    constructor(private readonly _prismaService: PrismaService) {}

    // Define the select fields for the subscriber

    private readonly _select = {
        select: {
            id: true,
            email: true,
            isActive: true,
            isAgree: true,

            createdAt: true,
            updatedAt: true,
            deletedAt: true
        }
    }

    /*
     * Find a single subscriber by ID
     * @param id - The ID of the subscriber
     * @returns The subscriber object if found
     */
    async findOne(id: string) {
        const subscriber = await this._prismaService.subscriber.findFirst({
            where: {
                id
            },
            ...this._select
        })
        return subscriber
    }

    /*
     * Find all subscribers
     * @param paginationQuery - The pagination query
     * @returns The list of subscribers
     */
    async findAll(paginationQuery: PaginationQueryDto) {
        const { page = 1, limit = 10, search = undefined } = paginationQuery

        // Define the OR condition for the search
        const or = search
            ? {
                  OR: [{ email: { contains: search } }]
              }
            : {}

        // Get the total count and the data
        const [totalCount, data] = await Promise.all([
            this._prismaService.subscriber.count({
                where: {
                    ...or
                }
            }),
            this._prismaService.subscriber.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    ...or
                },
                orderBy: { id: Prisma.SortOrder.desc },
                select: this._select.select
            })
        ])

        return {
            data: data,
            totalCount
        }
    }

    /*
     * Create a new subscriber
     * @param createData - The data for creating the subscriber
     * @returns The created subscriber
     *  object
     */
    async create(createData: SubscriberDto) {
        return await this._prismaService.subscriber.create({
            data: {
                ...createData
            },
            ...this._select
        })
    }

    /*
     * Update a subscriber
     * @param id - The ID of the subscriber
     * @param updateData - The data for updating the subscriber
     * @param imageFile - The image file for the subscriber
     * @returns The updated subscriber object
     */
    async update(id: string, updateData: UpdateSubscriberDto) {
        return await this._prismaService.subscriber.update({
            where: { id },
            data: {
                ...updateData
            },
            ...this._select
        })
    }

    /*
     * Subscribe to the newsletter
     * @param email - The email to subscribe
     * @returns The updated subscriber object
     */
    async unSubscribe(email: string) {
        return await this._prismaService.subscriber.update({
            where: { email },
            data: {
                isAgree: false
            },
            ...this._select
        })
    }

    /*
     * Delete a subscriber
     * @param id - The ID of the subscriber
     * @returns The deleted subscriber
     *  object
     */
    async delete(id: string) {
        return this._prismaService.subscriber.update({
            data: {
                deletedAt: new Date()
            },
            where: { id }
        })
    }

    /*
     * Restore a subscriber
     * @param id - The ID of the subscriber
     * @returns The restored subscriber
     *  object
     */
    async restore(id: string) {
        return this._prismaService.subscriber.update({
            data: {
                deletedAt: null
            },
            where: { id }
        })
    }
}
