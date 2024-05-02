import { PartialType } from '@nestjs/mapped-types'
import { SubscriberDto } from './subscribers.dto'

export class UpdateSubscriberDto extends PartialType(SubscriberDto) {}
