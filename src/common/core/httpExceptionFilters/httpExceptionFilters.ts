import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import { Types } from 'src/common/types'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception.getStatus()

        response.status(200).json({
            status: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            type: Types.ERROR,
            message: exception.message,
            data: null
        })
    }
}
