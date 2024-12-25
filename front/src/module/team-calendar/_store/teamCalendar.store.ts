import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import {
    formatTableDataEvent,
    formatTableDataParkingRessource,
    setDataColumnsDaysOfWeek,
    setDataColumnsParkingRessourcesDaysOfWeek,
    setDayInterval,
    setDefaultColumns,
    setDefaultParkingColumns,
    TABLE_CHOICE_ENUM,
    TeamCalendarStateType,
    UserTeamViewType,
} from '../teamCalendar.utils';
import { getAllUsersWithEventApi, getAllWorkTypeApi } from './teamCalendar.api';
import { UserConfigurationType } from '~/module/admin/user-configuration/user-list/userList.utils';

const useTeamCalendarStore = create<TeamCalendarStateType>(set => ({
    isLoading: false,
    isWorkTypeLoading: false,
    workTypeFilter: [],
    usersWithEventsList: [],
    nameWorkerFilter: [
        {
            name: '',
            id: '',
        }
    ],
    dataTableFormatted: [],
    daysOfWeek: setDayInterval(new Date()),
    dataColumns: [],
    workType: [
        {
            id: '1',
            name: 'commercial',
            monday: '0',
            tuesday: '0',
            wednesday: '0',
            thursday: '0',
            friday: '0',
            weeklyHour: '0',
        },
    ],

    setDaysOfWeek: date => {
        set({ daysOfWeek: setDayInterval(date) });
    },
    setUsersWithEventsList: async (dateList: Date[]) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const usersWithEventsList = await getAllUsersWithEventApi(tokenAuth, dateList);
            set({ isLoading: false, usersWithEventsList });
            set(state => {
                return {
                    dataTableFormatted: formatTableDataEvent(
                        state.usersWithEventsList,
                        state.daysOfWeek,
                        state.workType,
                        state.workTypeFilter
                    ),
                };
            });
            set(state => {
                return {
                    nameWorkerFilter: state.dataTableFormatted.map(data => { return { name: data.name, id: data.userId } }) as UserTeamViewType[],
                };
            });
            set(state => {
                return {
                    dataColumns: [
                        ...setDefaultColumns(state.nameWorkerFilter, state.workType),
                        ...setDataColumnsDaysOfWeek(state.daysOfWeek),
                    ],
                };
            });
        } catch (error) {
            set({ isLoading: true });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    setWorkType: async () => {
        try {
            set({ isWorkTypeLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const workType = await getAllWorkTypeApi(tokenAuth);
            set({ workType, isWorkTypeLoading: false, workTypeFilter: workType.map(type => type.name) });
        } catch (error) {
            set({ isWorkTypeLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    setWorkTypeFilter: (checked, workTypeName) => {
        set(state => {
            if (checked) {
                return {
                    workTypeFilter: [...state.workTypeFilter, workTypeName],
                };
            }
            return {
                workTypeFilter: state.workTypeFilter.filter(type => type !== workTypeName),
            };
        });
    },
}));

export { useTeamCalendarStore };
