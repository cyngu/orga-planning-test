'use client';
import { ConfigProvider, DatePicker, Form, Spin, Switch } from 'antd';
import locale from 'antd/locale/fr_FR';
import dayjs from 'dayjs';
import 'dayjs/locale/fr-ch';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';
import { hourAmRange, hourPmRange, minutesList, verifyLunchBreakTimeIsCorrect, verifyTimeRange } from '~/lib/utils/calendarGeneral.utils';
import { useAdminConfigurationStore } from '~/module/admin/admin-configuration/_store/adminConfiguration.store';
import { useCalendarStore } from '../_store/calendar.store';
import { LocationWorkEnum, workCase } from '../calendar.utils';
import { useCalendarFormStore } from './_store/calendarForm.store';
import {
    EventDataType,
    formatData,
    HourlyCaseEnum,
    PresenceEventType
} from './calendarForm.utils';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';

dayjs.locale('fr-ch');

const CalendarForm: React.FC = () => {
    const [form] = Form.useForm();
    const { userId } = useAuthenticationStore()
    const {
        hourAmEnd,
        hourAmStart,
        hourPmEnd,
        hourPmStart,
        minuteAmEnd,
        minuteAmStart,
        minutePmEnd,
        minutePmStart,
        selectedDate,
        isLoading,
        setSelectedDate,
        setSelectedTimeValue,
        resetData,
        createEvents,
    } = useCalendarFormStore();
    const { timeRange, getTimeRange } = useAdminConfigurationStore()
    const { date, setEvents } = useCalendarStore();
    const router = useRouter();
    const [titleAm, setTitleAm] = useState<LocationWorkEnum>(LocationWorkEnum.HOME);
    const [titlePm, setTitlePm] = useState<LocationWorkEnum>(LocationWorkEnum.HOME);
    const [parkingChoice, setParkingChoice] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const variantsList = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const variantsItem = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0 },
    };



    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PresenceEventType>();

    const onSubmit: SubmitHandler<PresenceEventType> = async data => {

        let parking: boolean = parkingChoice
        if (titleAm !== LocationWorkEnum.OFFICE && titlePm !== LocationWorkEnum.OFFICE) {
            parking = false
        }
        const eventData: EventDataType = formatData({
            hourAmEnd,
            hourAmStart,
            hourPmEnd,
            hourPmStart,
            minuteAmEnd,
            minuteAmStart,
            minutePmEnd,
            minutePmStart,
            parking,
            titleAm,
            titlePm,
            userId,
            selectedDate,
        });
        const { hourlyAm, hourlyPm } = eventData
        if (workCase.includes(titleAm)) {
            if (verifyTimeRange(hourlyAm, timeRange, true)) {
                toast.error('La plage horaire du matin est incorrecte.')
                return;
            }
        }
        if (workCase.includes(titlePm)) {
            if (verifyTimeRange(hourlyPm, timeRange, false)) {
                toast.error('La plage horaire de l\'après-midi est incorrecte.')
                return;
            }
        }

        if (workCase.includes(titleAm) && workCase.includes(titlePm)) {
            if (!verifyLunchBreakTimeIsCorrect(hourlyAm, hourlyPm)) {
                return;
            }
        }
        await createEvents(eventData);
        await setEvents(userId, date);
        setValue('hourlyAm', LocationWorkEnum.HOME);
        setValue('hourlyPm', LocationWorkEnum.HOME);
        setTitleAm(LocationWorkEnum.HOME);
        setTitlePm(LocationWorkEnum.HOME);
        setParkingChoice(false)
        setSelectedDate([]);
        form.resetFields();
        resetData();
    };

    useEffect(() => {
        getTimeRange();
    }, [getTimeRange])

    const onChange = (date: string, dateString: string | string[]) => {
        setSelectedDate(dateString as string[]);
    };

    const onChangeParkingChoice = (checked: boolean) => {
        setParkingChoice(checked);
    }

    return (
        <motion.div
            ref={ref}
            variants={variantsList}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="w-full relative py-2 mt-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col justify-center items-center gap-3">

                    <motion.div variants={variantsItem} className="w-[90%] border shadow-lg rounded-lg py-3 px-5">
                        <h2 className="text-lg font-bold">Sélection des dates</h2>
                        <Form form={form}>
                            <Form.Item name="selectedDate" rules={[{ required: true }]}>
                                <ConfigProvider locale={locale}>
                                    <div className="flex justify-center mt-5">
                                        <div className="flex flex-col justify-center items-end w-full gap-3">
                                            {/* Date */}
                                            <div className="relative w-full flex items-center">
                                                <p className="w-[50%] pl-5 text-lg">Dates : </p>
                                                <DatePicker
                                                    multiple
                                                    maxTagCount="responsive"
                                                    onChange={onChange}
                                                    defaultPickerValue={dayjs(date)}
                                                    format="DD/MM/YYYY"
                                                    className="shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </ConfigProvider>
                            </Form.Item>
                        </Form>
                    </motion.div>

                    {/* HourlyAM */}
                    <motion.div variants={variantsItem} className="w-[90%] border shadow-lg rounded-lg py-3 px-5">
                        <h2 className="text-lg font-bold">Matin</h2>
                        <div className="flex justify-center mt-5">
                            <div className="flex flex-col justify-center items-end min-w-[50%]">
                                {/* Start */}
                                <div className={`${!workCase.includes(titleAm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p>Début : </p>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.HAMS)}
                                            value={hourAmStart}
                                        >
                                            <option disabled>Heures</option>
                                            {hourAmRange.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Heures</p>
                                    </div>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.MAMS)}
                                            value={minuteAmStart}
                                        >
                                            <option disabled>Minutes</option>
                                            {minutesList.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Minutes</p>
                                    </div>
                                </div>
                                {/* End */}
                                <div className={`${!workCase.includes(titleAm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p>Fin : </p>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.HAME)}
                                            value={hourAmEnd}
                                        >
                                            <option disabled>Heures</option>
                                            {hourAmRange.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Heures</p>
                                    </div>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.MAME)}
                                            value={minuteAmEnd}
                                        >
                                            <option disabled>Minutes</option>
                                            {minutesList.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Minutes</p>
                                    </div>
                                </div>
                                {/* Presence  AM*/}
                                <div className="relative w-full flex justify-between items-center mt-5">
                                    <p className="w-[50%] pl-5">Présence : </p>
                                    <select
                                        className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center "
                                        {...register('titleAm', { required: true })}
                                        onChange={event => setTitleAm(event.target.value as LocationWorkEnum)}
                                        value={titleAm}
                                    >
                                        <option disabled>État de présence</option>
                                        {Object.values(LocationWorkEnum).map((location, index) => (
                                            <option key={index} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.titleAm?.type === 'required' && (
                                        <span className="text-red-500 text-xs">La présence est obligatoire</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* HourlyPM*/}
                    <motion.div variants={variantsItem} className="w-[90%] border shadow-lg rounded-lg py-3 px-5">
                        <h2 className="text-lg font-bold">Après-midi</h2>
                        <div className="flex justify-center mt-5">
                            <div className="flex flex-col justify-center items-end min-w-[50%] max-md:gap-5 max-md:items-center">
                                {/* Start */}
                                <div className={`${!workCase.includes(titlePm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p>Début : </p>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.HPMS)}
                                            value={hourPmStart}
                                        >
                                            <option disabled>Heures</option>
                                            {hourPmRange.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Heures</p>
                                    </div>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.MPMS)}
                                            value={minutePmStart}
                                        >
                                            <option disabled>Minutes</option>
                                            {minutesList.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Minutes</p>
                                    </div>
                                </div>
                                {/* End */}
                                <div className={`${!workCase.includes(titlePm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p>Fin : </p>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.HPME)}
                                            value={hourPmEnd}
                                        >
                                            <option disabled>Heures</option>
                                            {hourPmRange.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Heures</p>
                                    </div>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.MPME)}
                                            value={minutePmEnd}
                                        >
                                            <option disabled>Minutes</option>
                                            {minutesList.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Minutes</p>
                                    </div>
                                </div>
                                {/* Presence  PM*/}
                                <div className="relative w-full flex justify-between items-center mt-5">
                                    <p className="w-[50%] pl-5">Présence : </p>
                                    <select
                                        className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center "
                                        {...register('titlePm', { required: true })}
                                        onChange={event => setTitlePm(event.target.value as LocationWorkEnum)}
                                        value={titlePm}
                                    >
                                        <option disabled>État de présence</option>
                                        {Object.values(LocationWorkEnum).map((location, index) => (
                                            <option key={index} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.titlePm?.type === 'required' && (
                                        <span className="text-red-500 text-xs">La présence est obligatoire</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={variantsItem} className={`${titleAm === LocationWorkEnum.OFFICE || titlePm === LocationWorkEnum.OFFICE ? "" : "hidden"} w-[90%] border shadow-lg rounded-lg py-3 px-5`}>
                        <h2 className="text-lg font-bold">Parking</h2>
                        <div className='flex justify-around mt-5 mb-3'>
                            <p>Je prends une place de parking</p>
                            <Switch onChange={onChangeParkingChoice} value={parkingChoice} />
                        </div>
                    </motion.div>

                    {/* Enregistrer */}
                    <motion.div variants={variantsItem} className="w-[90%] flex flex-row-reverse">
                        <button
                            className="px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
                            disabled={isLoading}
                            onClick={handleSubmit(onSubmit)}
                        >
                            {' '}
                            {isLoading ? (
                                <Spin spinning={isLoading} />
                            ) : (
                                <div className="flex justify-center items-center gap-3 text-white">
                                    <p className="text-sm">Enregistrer</p>
                                </div>
                            )}
                        </button>
                    </motion.div>
                </div>
            </form>
        </motion.div>
    );
};
export default CalendarForm;
