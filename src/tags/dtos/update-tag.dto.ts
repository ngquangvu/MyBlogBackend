import { PartialType } from '@nestjs/mapped-types'
import { TagDto } from './tags.dto'

export class UpdateTagDto extends PartialType(TagDto) {}
