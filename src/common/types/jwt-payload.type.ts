export type JwtPayloadUser = {
  userId: string;
  roleId: string;
  exp?: number; // expiration (timestamp)
  iat?: number; // issued at (timestamp)
};
