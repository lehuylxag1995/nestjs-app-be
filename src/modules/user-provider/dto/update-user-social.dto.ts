import { SocialType } from '@prisma/client';

export class UpdateUserSocialDto {
  social: SocialType;
  socialId: string;
  displayName: string;
  userId: string;
  avatarUrl: string;
}
