"use client"
import { useEffect } from 'react'
import { useAuthenticationStore } from '../authentication/_store/authentication.store'
import { useAccountStore } from './_store/account.store'

const Account = () => {
    const {userFirstName, userLastName, userTrigramme, userId} = useAuthenticationStore()
    const {workType, isLoading, getWorkType} = useAccountStore()

    useEffect(() => {
        if(userId){
            getWorkType(userId)
        }
    }, [getWorkType, userId])

  return (
    <>
        <div className='flex flex-col justify-center items-center w-[500px] max-md:w-[98%] max-md:ml-6'>
            <h1 className='text-2xl font-bold cursor-default'>
                Détails du compte
            </h1>
            <div className='flex flex-col gap-5 mt-10 shadow-lg px-10 py-5 w-full border rounded-lg'>
                <div className='flex items-center justify-between'>
                    <p className='font-semibold cursor-default'>Prénom</p>
                    <p className='shadow-md w-[130px] py-1 text-center rounded-lg bg-gradient-to-br from-white to-slate-100 cursor-default transition duration-100'>{userFirstName}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='font-semibold cursor-default'>Nom</p>
                    <p className='shadow-md w-[130px] py-1 text-center rounded-lg bg-gradient-to-br from-white to-slate-100 cursor-default transition duration-100'>{userLastName}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='font-semibold cursor-default'>Trigramme</p>
                    <p className='shadow-md w-[130px] py-1 text-center rounded-lg bg-gradient-to-br from-white to-slate-100 cursor-default transition duration-100'>{userTrigramme}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='font-semibold cursor-default'>Type de travail</p>
                    <p className='shadow-md w-[130px] py-1 text-center rounded-lg bg-gradient-to-br from-white to-slate-100 cursor-default transition duration-100 capitalize'>{isLoading ? 'Chargement...' : workType}</p>
                </div>
            </div>
        </div>
       
    </>
  )
}

export default Account