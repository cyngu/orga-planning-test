import { Event } from 'src/eventsCalendar/models/event.model';
import { LocationWorkEnum } from './enum';
import { eachYearOfInterval, getYear } from 'date-fns';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Holidays = require('date-holidays');

export const calculateTotalWorkDayPresence = (
  events: Event[],
  presenceType: LocationWorkEnum,
): number => {
  const workHalfDaysAm = events.filter(
    (event) => event.titleAm === presenceType,
  ).length;

  const workHalfDaysPm = events.filter(
    (event) => event.titlePm === presenceType,
  ).length;

  return workHalfDaysAm + workHalfDaysPm;
};

export const calculateTotalWorkDayOfficeForParking = (
  events: Event[],
): number => {
  const workDay = events.filter(
    (event) =>
      event.titleAm === LocationWorkEnum.OFFICE ||
      event.titlePm === LocationWorkEnum.OFFICE,
  ).length;

  return workDay;
};

export const calculateTotalOffDay = (
  datesStringFormatedInterval: Date[],
  datesStringFormated: Date[],
): number => {
  const hd = new Holidays('FR');

  // Obtenir toutes les années dans l'intervalle
  const years = eachYearOfInterval({
    start: datesStringFormatedInterval[0],
    end: datesStringFormatedInterval[1],
  }).map(getYear);

  // Créer un ensemble unique de jours fériés pour l'intervalle d'années
  const holidaysSet = new Set(
    years.flatMap((year) =>
      hd
        .getHolidays(year)
        .map((holiday) => new Date(holiday.date).toDateString()),
    ),
  );

  // Filtrer les dates pour ne garder que celles qui sont des jours fériés
  const offDayCount = datesStringFormated.filter((date) =>
    holidaysSet.has(date.toDateString()),
  ).length;

  return offDayCount;
};
