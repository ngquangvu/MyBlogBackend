import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAdminRefreshAuthGuard extends AuthGuard('jwt-admin-refresh') {}
