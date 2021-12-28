import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): any {
        console.log('handle request', user, info, context, status)
    }
    
    // logIn<TRequest extends { logIn: Function; } = any>(request: TRequest): Promise<void> {
    //     console.log('login', request)
    //     return null;
    // }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log('can Active', context)
        return true;
    }
}
