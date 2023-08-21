import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PostDto } from '../dtos'

@Injectable()
export class PostService {
    constructor(private readonly _prismaService: PrismaService) {}

    private readonly _select = {
        select: {
            authorId: true,
            parentId: true,
            title: true,
            metaTitle: true,
            slug: true,
            summary: true,
            content: true,
            thumbnail: true,
            url: true,
            published: true,
            createdAt: true,
            updatedAt: true
        }
    }

    async findOne(id: string) {
        const post = await this._prismaService.post.findFirst({
            where: {
                id
            },
            ...this._select
        })
        return post
    }

    async findAll() {
        return this._prismaService.post.findMany({
            ...this._select
        })
    }

    async create(createData: PostDto) {
        console.log(createData)

        return await this._prismaService.post.create({
            data: {
                ...createData
            },
            ...this._select
        })
    }

    async update(updateData: PostDto, id: string) {
        return await this._prismaService.post.update({
            where: { id },
            data: {
                ...updateData
            },
            ...this._select
        })
    }

    async delete(id: string) {
        return this._prismaService.post.delete({ where: { id } })
    }
}
