import { PartialType } from '@nestjs/mapped-types'
import { PostDto } from './posts.dto'

export class UpdatePostDto extends PartialType(PostDto) {}
