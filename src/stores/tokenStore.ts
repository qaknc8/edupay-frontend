import { create } from 'zustand';
import Cookies from 'js-cookie';

interface TokenStoreType {
	accessToken: string | null;
	refreshToken: string | null;
	setTokens: (accessToken: string, refreshToken: string) => void;
	clearTokens: () => void;
}

export const useTokenStore = create<TokenStoreType>((set) => ({
	accessToken: Cookies.get('accessToken') || null,
	refreshToken: Cookies.get('refreshToken') || null,
	setTokens: (accessToken: string, refreshToken: string) => {
		Cookies.set('accessToken', accessToken, { expires: 1 }); // 1일 후 만료
		Cookies.set('refreshToken', refreshToken, { expires: 14 }); // 1일 후 만료
		set({ accessToken, refreshToken });
	},
	clearTokens: () => {
		Cookies.remove('accessToken');
		set({ accessToken: null, refreshToken: null });
	},
}));

export const getAccessToken = () => Cookies.get('accessToken') || null;
export const getRefreshToken = () => Cookies.get('refreshToken') || null;
