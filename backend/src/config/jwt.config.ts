import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (): Promise<JwtModuleOptions> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set!');
  }
  return {
    secret,
  };
};
