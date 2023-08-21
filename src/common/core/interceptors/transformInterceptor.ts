import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Types } from 'src/common/types'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest()
        return next.handle().pipe(
            map((data) => {
                const modifiedResponse = {
                    statusCode: 200,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    type: Types.SUCCESS,
                    data: data
                }
                return modifiedResponse
            })
        )
    }
}
