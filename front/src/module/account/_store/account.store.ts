import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { AccountStoreType } from '../account.utils';
import { getWorkTypeByUserIdApi } from './account.api';

const useAccountStore = create<AccountStoreType>(set => ({
    isLoading: false,
    workType: null,
    getWorkType: async (userId: string) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const workType = await getWorkTypeByUserIdApi(userId, tokenAuth);
            set({ workType: workType.name, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}));

export { useAccountStore };
