import {
  AppAbility,
  CaslAbilityFactory,
} from '@Modules/casl/casl-ability.factory';
import { UsersService } from '@Modules/users/users.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from 'src/common/decorators/check-policy.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, //để đọc metadata (cụ thể là cái bạn gắn bằng @CheckPolicies).F
    private caslAbilityFactory: CaslAbilityFactory, // Tạo ability object
    private userService: UsersService, // Lấy thông tin user + permissions
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Lấy các policy được định nghĩa trong @CheckPolicies() decorator
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    // Lấy thông tin người dùng qua JWT
    const req = context.switchToHttp().getRequest();
    const userJWT = req.user;
    if (!userJWT) {
      throw new UnauthorizedException('Bạn chưa đăng nhập tài khoản !');
    }

    // Tìm vai trò - quyền hạn trong DB
    const user = await this.userService.findUserWithPermissionOnRole(
      userJWT.id,
    );

    // Theo CASL phải khởi tạo ability cho người dùng đó
    const ability = this.caslAbilityFactory.createForUser(user);
    req.ability = ability;

    // Dùng every (all true) thì mới return true (cho phép), còn false (cấm)
    return policyHandlers.every(
      // ( ổ khóa yêu cầu, chìa khóa đã cấp)
      (handler) => this.execPolicyHandler(handler, ability),
    );
  }

  // Kiểm tra kiểu truyền vào decorator là type gì ?
  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability); // Arrow function
    }
    return handler.handle(ability); // Class implement interface
  }
}
