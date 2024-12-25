'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import CalendarSample from '~/module/calendar/calendar.component';
import CalendarForm from '~/module/calendar/calendarForm/calendarForm.component';

const CalendarPage = () => {
    const [isHydrating, setIsHydrating] = useState<boolean>(false);
    useEffect(() => {
        setIsHydrating(true);
    }, []);

    return (
        <>
            {isHydrating ? (
                <div className="relative w-[98%] shadow-lg flex max-md:flex-col bg-white gap-3">
                    <div className="w-[60%] max-md:w-[90%] py-2 pl-2">
                        <CalendarSample />
                    </div>
                    <div className="w-[40%] max-md:w-[90%] py-2 pl-2">
                        <CalendarForm />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center mt-15 h-screen">
                    <Spin size="large" />
                </div>
            )}
        </>
    );
};

export default CalendarPage;
