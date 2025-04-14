import Cookies from 'js-cookie';

export enum EnumTokens {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken'
}

export const getAccessToken = (): string | null => {
  const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);
  return accessToken || null;
};

export const saveTokenStorage = (accessToken: string): void => {
  Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
    domain: 'localhost',
    sameSite: 'strict',
    expires: 1 // 1 день
  });
};

export const removeFromStorage = (): void => {
  Cookies.remove(EnumTokens.ACCESS_TOKEN);
  Cookies.remove(EnumTokens.REFRESH_TOKEN);
};