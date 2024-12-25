'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nabBarItems, nabBarItemsAdmin } from './navBar.utils';
import { useAuthenticationStore } from '../authentication/_store/authentication.store';

const NavBar = () => {
    const { userRole } = useAuthenticationStore()
    const router = useRouter();
    const pathName = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (userRole) {
            setIsAdmin(userRole.includes('admin'));
        }
    }, [userRole]);

    return (
        <div className="flex justify-center items-center w-screen h-14 bg-white border-b-2 gap-5 overflow-hidden">
            {nabBarItems.map(item => (
                <div
                    key={item.id}
                    className={`h-full flex justify-center items-center px-2 hover:border-b-2 hover:border-primary hover:pt-[2px] transition duration-150 ease-in-out cursor-pointer group ${
                        pathName === item.path ? 'border-b-2 border-primary pt-[2px] ' : ''
                    }`}
                >
                    <button
                        onClick={() => router.push(item.path)}
                        className={`text-slate-500 group-hover:text-slate-700 font-medium h-full ${
                            pathName === item.path ? 'text-slate-700' : ''
                        }`}
                    >
                        {item.title}
                    </button>
                </div>
            ))}
            {isAdmin &&
                nabBarItemsAdmin.map(item => (
                    <div
                        key={item.id}
                        className={`h-full flex justify-center items-center px-2 hover:border-b-2 hover:border-primary hover:pt-[2px] transition duration-150 ease-in-out cursor-pointer group ${
                            pathName.includes(item.path) ? 'border-b-2 border-primary pt-[2px] ' : ''
                        }`}
                    >
                        <button
                            onClick={() => router.push(item.path)}
                            className={`text-slate-500 group-hover:text-slate-700 font-medium h-full ${
                                pathName.includes(item.path) ? 'text-slate-700' : ''
                            }`}
                        >
                            {item.title}
                        </button>
                    </div>
                ))}
        </div>
    );
};

export default NavBar;
