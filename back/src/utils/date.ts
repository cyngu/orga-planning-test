import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  getISODay,
  startOfMonth,
  subMonths,
} from 'date-fns';

export const parseDateString = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export const ListOfWorkDays = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
];

export const isSameIsoDay = (day: string, date: Date): boolean => {
  const index: number = ListOfWorkDays.findIndex((dayName) => dayName === day);
  return getISODay(date) === index + 1;
};

export const setRangeDate = (date: string): Date[] => {
  const dateFormat = new Date(date);
  const start = new Date(startOfMonth(subMonths(dateFormat, 1)));
  const end = new Date(endOfMonth(addMonths(dateFormat, 1)));
  return eachDayOfInterval({ start, end });
};
