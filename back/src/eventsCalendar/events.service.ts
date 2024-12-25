import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from './models/event.model';
import { parseDateString, setRangeDate } from 'src/utils/date';
import { CreateEventInput } from './dto/createEvent.input';
import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from 'apollo-server-express';
import { addHours, eachDayOfInterval, format, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LocationWorkEnum } from 'src/utils/enum';
import { DeleteEventInput } from './dto/deleteEvent.input';
import { UpdateEventInput } from './dto/updateEvent.input';
import { SetRttInput } from './dto/setRtt.input';
import { ReportInput } from './dto/report.input';
import {
  calculateTotalOffDay,
  calculateTotalWorkDayOfficeForParking,
  calculateTotalWorkDayPresence,
} from 'src/utils/reportPdf.utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Holidays = require('date-holidays');

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getEvents(): Promise<Event[]> {
    return this.prisma.eventCalendar.findMany();
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return this.prisma.eventCalendar.findMany({
      where: {
        userId,
      },
    });
  }

  async getEventsByUserIdAndDate(
    userId: string,
    date: string,
  ): Promise<Event[]> {
    // TODO : A ameliorer, voir la creation devent diff entre prod et dev
    // VOir pour eventuellement ajouter ou supprimer des heures en creation pour uniformiser je sais pas
    const rangeDate = setRangeDate(date);
    const rangeDateFormated = rangeDate.map((date) => addHours(date, 1));
    const events = await this.prisma.eventCalendar.findMany({
      where: {
        userId,
        start: {
          in: rangeDate,
        },
      },
    });

    if (events.length === 0) {
      const eventsBase = await this.prisma.eventCalendar.findMany({
        where: {
          userId,
          start: {
            in: rangeDateFormated,
          },
        },
      });

      return eventsBase;
    }
    return events;
  }

  async getParkinglacesGettedCount(date: Date): Promise<number> {
    return this.prisma.eventCalendar.count({
      where: {
        start: date,
        parking: true,
      },
    });
  }

  async createEvent(createEventInput: CreateEventInput) {
    try {
      const {
        userId,
        date,
        hourlyAm,
        hourlyPm,
        titleAm,
        titlePm,
        parking,
        workTime,
      } = createEventInput;

      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }
      const userExist = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userExist) {
        throw new UserInputError('User does not exist');
      }
      for (const eventDate of date) {
        const parsedDate = parseDateString(eventDate);
        if (parsedDate < new Date()) {
          throw new UserInputError('On ne peut pas créer un événement passé');
        }
        const eventExist = await this.prisma.eventCalendar.findFirst({
          where: {
            userId,
            start: parsedDate,
          },
        });
        if (eventExist) {
          throw new UserInputError('Event already exist');
        }

        if (parking) {
          const parkingPlaces =
            await await this.prisma.adminConfiguration.findFirst({
              where: {
                name: 'ParkingPlace',
              },
              select: {
                value: true,
              },
            });

          if (!parkingPlaces) {
            throw new UserInputError('Parking places not found');
          }

          const parkingPlacesGetted = await this.prisma.eventCalendar.count({
            where: {
              start: parsedDate,
              parking: true,
            },
          });

          if (parkingPlacesGetted >= parseInt(parkingPlaces.value)) {
            throw new UserInputError(
              `Le nombre de places de parking est atteint pour le ${format(parsedDate, 'EEEE dd MMMM yyyy', { locale: fr })}`,
            );
          }
        }

        const officeDay = await this.prisma.adminConfiguration.findFirst({
          where: {
            name: 'OfficeDay',
          },
          select: {
            value: true,
          },
        });

        await this.prisma.eventCalendar.create({
          data: {
            hourlyAm,
            hourlyPm,
            titleAm:
              officeDay.value === format(parsedDate, 'EEEE', { locale: fr }) &&
              titleAm === LocationWorkEnum.HOME
                ? LocationWorkEnum.OFFICE
                : titleAm,
            titlePm:
              officeDay.value === format(parsedDate, 'EEEE', { locale: fr }) &&
              titleAm === LocationWorkEnum.HOME
                ? LocationWorkEnum.OFFICE
                : titlePm,
            workTime,
            userId,
            parking,
            start: parsedDate,
            end: parsedDate,
          },
        });
      }
      return 'Event(s) created';
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async deleteEvent(deleteEventInput: DeleteEventInput) {
    try {
      const { id, userId } = deleteEventInput;
      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }
      const eventExist = await this.prisma.eventCalendar.findUnique({
        where: { id },
      });
      if (!eventExist) {
        throw new UserInputError('Event does not exist');
      }
      if (eventExist.userId !== userId) {
        throw new AuthenticationError(
          'User not authorized to delete this event',
        );
      }
      if (eventExist.start <= new Date()) {
        throw new UserInputError(
          'On ne peu supprimer un evenement présent ou actuel',
        );
      }
      await this.prisma.eventCalendar.delete({
        where: { id },
      });
      return 'Event deleted';
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async updateEvent(updateEventInput: UpdateEventInput) {
    try {
      const {
        id,
        userId,
        date,
        hourlyAm,
        hourlyPm,
        titleAm,
        titlePm,
        parking,
        workTime,
      } = updateEventInput;
      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }

      const eventExist = await this.prisma.eventCalendar.findUnique({
        where: { id },
      });
      if (!eventExist) {
        throw new UserInputError("l'événement n'existe pas");
      }
      if (eventExist.userId !== userId) {
        throw new AuthenticationError(
          "Vous ne pouvez pas modifier cet événement car vous n'êtes pas l'auteur",
        );
      }
      const parsedDate = date ? parseDateString(date) : eventExist.start;
      if (eventExist.start <= new Date()) {
        throw new UserInputError(
          'On ne peu supprimer un evenement présent ou actuel',
        );
      }

      if (parking) {
        const parkingPlaces =
          await await this.prisma.adminConfiguration.findFirst({
            where: {
              name: 'ParkingPlace',
            },
            select: {
              value: true,
            },
          });

        if (!parkingPlaces) {
          throw new UserInputError('Pas de places de parking trouvées');
        }

        const parkingPlacesGetted = await this.prisma.eventCalendar.count({
          where: {
            start: eventExist.start,
            parking: true,
          },
        });

        if (parkingPlacesGetted >= parseInt(parkingPlaces.value)) {
          throw new UserInputError(
            `Le nombre de places de parking est atteint pour le ${format(eventExist.start, 'EEEE dd MMMM yyyy', { locale: fr })}`,
          );
        }
      }

      await this.prisma.eventCalendar.update({
        where: { id },
        data: {
          start: parsedDate,
          end: parsedDate,
          hourlyAm: hourlyAm ?? eventExist.hourlyAm,
          hourlyPm: hourlyPm ?? eventExist.hourlyPm,
          titleAm: titleAm ?? eventExist.titleAm,
          titlePm: titlePm ?? eventExist.titlePm,
          parking: parking ?? eventExist.parking,
          workTime: workTime ?? eventExist.workTime,
        },
      });

      return 'Event updated';
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async updateOrCreateHoliday(year: number): Promise<string> {
    try {
      const hd = new Holidays('FR');
      const holidays = hd.getHolidays(year);
      const allUsersId = await this.prisma.user.findMany({
        select: {
          id: true,
        },
      });

      if (!allUsersId) {
        throw new UserInputError('Aucun utilisateur trouvé');
      }

      for (const holiday of holidays) {
        for (const user of allUsersId) {
          const holidayDate = new Date(holiday.date);
          const eventExist = await this.prisma.eventCalendar.findFirst({
            where: {
              userId: user.id,
              start: holidayDate,
            },
          });
          if (!eventExist) {
            await this.prisma.eventCalendar.create({
              data: {
                start: holidayDate,
                end: holidayDate,
                hourlyAm: '00:00',
                hourlyPm: '00:00',
                titleAm: holiday.name,
                titlePm: holiday.name,
                workTime: '0',
                userId: user.id,
                parking: false,
              },
            });
          } else {
            await this.prisma.eventCalendar.update({
              where: { id: eventExist.id },
              data: {
                titleAm: holiday.name,
                titlePm: holiday.name,
                workTime: '0',
                parking: false,
              },
            });
          }
        }
      }
      return 'Les jours fériés ont été mis à jour';
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async adminCreateOrUpdateEventByUser(
    createEventInput: CreateEventInput,
  ): Promise<string> {
    try {
      const {
        date,
        hourlyAm,
        hourlyPm,
        parking,
        titleAm,
        titlePm,
        userId,
        workTime,
      } = createEventInput;
      if (!userId) {
        throw new AuthenticationError('Utilisateur non authentifié');
      }
      const userExist = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userExist) {
        throw new UserInputError('Utilisateur non trouvé');
      }
      for (const eventDate of date) {
        const parsedDate = parseDateString(eventDate);
        const eventExist = await this.prisma.eventCalendar.findFirst({
          where: {
            userId,
            start: parsedDate,
          },
        });

        if (parking) {
          const parkingPlaces =
            await await this.prisma.adminConfiguration.findFirst({
              where: {
                name: 'ParkingPlace',
              },
              select: {
                value: true,
              },
            });

          if (!parkingPlaces) {
            throw new UserInputError('Parking places not found');
          }

          const parkingPlacesGetted = await this.prisma.eventCalendar.count({
            where: {
              start: parsedDate,
              parking: true,
            },
          });

          if (parkingPlacesGetted >= parseInt(parkingPlaces.value)) {
            throw new UserInputError(
              `Le nombre de places de parking est atteint pour le ${format(parsedDate, 'EEEE dd MMMM yyyy', { locale: fr })}`,
            );
          }
        }

        if (eventExist) {
          await this.prisma.eventCalendar.update({
            where: { id: eventExist.id },
            data: {
              start: parsedDate,
              end: parsedDate,
              hourlyAm: hourlyAm ?? eventExist.hourlyAm,
              hourlyPm: hourlyPm ?? eventExist.hourlyPm,
              titleAm: titleAm ?? eventExist.titleAm,
              titlePm: titlePm ?? eventExist.titlePm,
              parking: parking ?? eventExist.parking,
              workTime: workTime ?? eventExist.workTime,
            },
          });
          return 'Les modifications ont été effectuées';
        } else {
          await this.prisma.eventCalendar.create({
            data: {
              hourlyAm,
              hourlyPm,
              titleAm,
              titlePm,
              workTime,
              userId,
              parking,
              start: parsedDate,
              end: parsedDate,
            },
          });
          return 'Les evenements ont été créés';
        }
      }
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async setRttEmployerEvent(setRttInput: SetRttInput): Promise<string> {
    try {
      const { date, titleAm, usersId } = setRttInput;

      for (const userId of usersId) {
        const userExist = await this.prisma.user.findUnique({
          where: { id: userId },
        });
        if (!userExist) {
          throw new UserInputError('User does not exist');
        }
        for (const eventDate of date) {
          const parsedDate = parseDateString(eventDate);
          const eventExist = await this.prisma.eventCalendar.findFirst({
            where: {
              userId,
              start: parsedDate,
            },
          });

          if (eventExist) {
            await this.prisma.eventCalendar.update({
              where: { id: eventExist.id },
              data: {
                start: parsedDate,
                end: parsedDate,
                hourlyAm: eventExist.hourlyAm,
                hourlyPm: eventExist.hourlyPm,
                titleAm: titleAm,
                titlePm: titleAm,
                parking: eventExist.parking,
                workTime: eventExist.workTime,
              },
            });
          } else {
            await this.prisma.eventCalendar.create({
              data: {
                hourlyAm: '00:00',
                hourlyPm: '00:00',
                titleAm,
                titlePm: titleAm,
                workTime: '0',
                userId,
                parking: false,
                start: parsedDate,
                end: parsedDate,
              },
            });
          }
        }
      }
      return 'Les RTT ont été ajoutés';
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async createEventAdmin(createEventInput: CreateEventInput) {
    try {
      const {
        userId,
        date,
        hourlyAm,
        hourlyPm,
        titleAm,
        titlePm,
        parking,
        workTime,
      } = createEventInput;

      const userExist = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userExist) {
        throw new UserInputError('User does not exist');
      }
      for (const eventDate of date) {
        const parsedDate = parseDateString(eventDate);
        const eventExist = await this.prisma.eventCalendar.findFirst({
          where: {
            userId,
            start: parsedDate,
          },
        });
        if (eventExist) {
          throw new UserInputError("L'événement existe déjà");
        }

        if (parking) {
          const parkingPlaces =
            await await this.prisma.adminConfiguration.findFirst({
              where: {
                name: 'ParkingPlace',
              },
              select: {
                value: true,
              },
            });

          if (!parkingPlaces) {
            throw new UserInputError('Parking places not found');
          }

          const parkingPlacesGetted = await this.prisma.eventCalendar.count({
            where: {
              start: parsedDate,
              parking: true,
            },
          });

          if (parkingPlacesGetted >= parseInt(parkingPlaces.value)) {
            throw new UserInputError(
              `Le nombre de places de parking est atteint pour le ${format(parsedDate, 'EEEE dd MMMM yyyy', { locale: fr })}`,
            );
          }
        }

        const officeDay = await this.prisma.adminConfiguration.findFirst({
          where: {
            name: 'OfficeDay',
          },
          select: {
            value: true,
          },
        });

        await this.prisma.eventCalendar.create({
          data: {
            hourlyAm,
            hourlyPm,
            titleAm:
              officeDay.value === format(parsedDate, 'EEEE', { locale: fr })
                ? LocationWorkEnum.OFFICE
                : titleAm,
            titlePm:
              officeDay.value === format(parsedDate, 'EEEE', { locale: fr })
                ? LocationWorkEnum.OFFICE
                : titlePm,
            workTime,
            userId,
            parking,
            start: parsedDate,
            end: parsedDate,
          },
        });
      }
      return 'Event(s) created';
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async updateEventAdmin(updateEventInput: UpdateEventInput) {
    try {
      const {
        id,
        userId,
        date,
        hourlyAm,
        hourlyPm,
        titleAm,
        titlePm,
        parking,
        workTime,
      } = updateEventInput;
      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }

      const eventExist = await this.prisma.eventCalendar.findUnique({
        where: { id },
      });
      if (!eventExist) {
        throw new UserInputError("l'événement n'existe pas");
      }
      const parsedDate = date ? parseDateString(date) : eventExist.start;

      if (parking) {
        const parkingPlaces =
          await await this.prisma.adminConfiguration.findFirst({
            where: {
              name: 'ParkingPlace',
            },
            select: {
              value: true,
            },
          });

        if (!parkingPlaces) {
          throw new UserInputError('Parking places not found');
        }

        const parkingPlacesGetted = await this.prisma.eventCalendar.count({
          where: {
            start: eventExist.start,
            parking: true,
          },
        });

        if (parkingPlacesGetted >= parseInt(parkingPlaces.value)) {
          throw new UserInputError(
            `Le nombre de places de parking est atteint pour le ${format(eventExist.start, 'EEEE dd MMMM yyyy', { locale: fr })}`,
          );
        }
      }

      await this.prisma.eventCalendar.update({
        where: { id },
        data: {
          start: parsedDate,
          end: parsedDate,
          hourlyAm: hourlyAm ?? eventExist.hourlyAm,
          hourlyPm: hourlyPm ?? eventExist.hourlyPm,
          titleAm: titleAm ?? eventExist.titleAm,
          titlePm: titlePm ?? eventExist.titlePm,
          parking: parking ?? eventExist.parking,
          workTime: workTime ?? eventExist.workTime,
        },
      });

      return 'Event updated';
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async deleteEventAdmin(deleteEventInput: DeleteEventInput) {
    try {
      const { id, userId } = deleteEventInput;
      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }
      const eventExist = await this.prisma.eventCalendar.findUnique({
        where: { id },
      });
      if (!eventExist) {
        throw new UserInputError('Event does not exist');
      }
      await this.prisma.eventCalendar.delete({
        where: { id },
      });
      return 'Event deleted';
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async getReportPresence(reportInput: ReportInput) {
    try {
      const { userId, datesString } = reportInput;
      const dataReturn = [];
      if (datesString.length === 0) {
        throw new UserInputError('Les dates ne peuvent pas être vide');
      }
      if (datesString.length !== 2) {
        throw new UserInputError('Les dates ne peuvent pas être plus de 2');
      }
      const datesStringFormatedInterval = datesString.map((date) =>
        parseDateString(date),
      );

      const datesStringFormated = eachDayOfInterval({
        // On récupère les jours entre les deux dates et on exclu les week end
        start: datesStringFormatedInterval[0],
        end: datesStringFormatedInterval[1],
      }).filter((date) => isWeekend(date) === false);
      for (const id of userId) {
        const userExist = await this.prisma.user.findFirst({
          where: {
            id,
          },
        });
        if (!userExist) {
          throw new UserInputError("L'utilisateur n'existe pas");
        }

        const workType = await this.prisma.workType.findFirst({
          where: {
            id: userExist.workTypeId,
          },
        });
        const events = await this.prisma.eventCalendar.findMany({
          where: {
            userId: id,
            start: {
              in: datesStringFormated,
            },
          },
        });

        const remoteWorkHalfDays = calculateTotalWorkDayPresence(
          events,
          LocationWorkEnum.HOME,
        );

        const onsiteWorkHalfDays = calculateTotalWorkDayPresence(
          events,
          LocationWorkEnum.OFFICE,
        );

        const onSiteWorkDaysForParking =
          calculateTotalWorkDayOfficeForParking(events);

        const parkingPlaceTaked = events.filter(
          (event) => event.parking,
        ).length;

        const totalDays = datesStringFormated.length;
        const offDay = calculateTotalOffDay(
          datesStringFormatedInterval,
          datesStringFormated,
        );

        const businessDays = totalDays - offDay;

        const parkingUsagePercentage =
          onsiteWorkHalfDays > 0
            ? Math.round((parkingPlaceTaked / onSiteWorkDaysForParking) * 100)
            : 0;

        const totalWorkDays = (onsiteWorkHalfDays + remoteWorkHalfDays) / 2;

        const workDaysPercentage =
          totalWorkDays > 0 && totalDays > 0
            ? Math.round((totalWorkDays / totalDays) * 100)
            : 0;

        const noApplyEvent = totalDays - events.length;
        dataReturn.push({
          userId: id,
          userName: `${userExist.firstName} ${userExist.lastName}`,
          workTypeName: workType.name,
          remoteWorkDays: remoteWorkHalfDays / 2,
          onsiteWorkDays: onsiteWorkHalfDays / 2,
          onsiteWorkPercentage: Math.round(
            (onsiteWorkHalfDays / 2 / totalDays) * 100,
          ),
          parkingUsagePercentage,
          totalWorkDays,
          totalDays,
          workDaysPercentage,
          businessDays,
          noApplyEvent,
        });
      }

      return dataReturn;
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }
}
