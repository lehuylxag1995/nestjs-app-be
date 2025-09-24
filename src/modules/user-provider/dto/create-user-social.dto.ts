import { SocialType } from '@prisma/client';

export class CreateUserSocialDto {
  social: SocialType;
  socialId: string;
  displayName: string;
  userId: string;
  avatarUrl: string;
}
