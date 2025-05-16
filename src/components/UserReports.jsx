import React, { useEffect, useState } from 'react';
import { useQuestions, useUser, useUsers } from '../lib/customHooks';
import Navbar from '../components/Navbar';
import { APP_ROUTES } from '../utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../utils/constants';
import axios from 'axios';
import defaultProfilePhoto from '../assets/profile.png';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const UserReports = () => {

    const { user, authenticated } = useUser();
    const users = useUsers();

    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [userFirstname, setUserFirstname] = useState('');
    const [userLastname, setUserLastname] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userPhotoUrl, setUserPhotoUrl] = useState('');
    const [userAnsweredValuations, setUserAnsweredValuations] = useState([]);
    const [userWatchedVideos, setUserWatchedVideos] = useState([]);
    const [open, setOpen] = useState(false);
    const isCorrectColor = "#dc2626"

    if (!user || !authenticated) {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    return (
        <>
            <div className='bg-gray-300 w-full h-auto min-h-screen'>
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='flex flex-col justify-center items-center'>

                    <Dialog open={open} onClose={() => {
                        setOpen(false);
                    }}
                        className="relative z-10 select-none">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto h-full">
                            <div className="flex min-h-full justify-center p-4 text-center items-center p-0">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden h-3/4 rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-9/10 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                    <div className="flex items-start w-full py-8 ">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left px-8 w-full">
                                            <div className='flex justify-start items-center gap-2 pb-4 select-text'>
                                                <h1 className='text-sm font-semibold select-none'>
                                                    id:
                                                </h1>
                                                <h1 className='text-sm'>
                                                    {userId}
                                                </h1>
                                            </div>
                                            <DialogTitle as="h3" className="text-base font-semibold text-xl">
                                                {userFirstname} {userLastname}
                                            </DialogTitle>
                                            <div className='flex flex-col justify-start items-center space-y-4 py-4'>
                                                <div className='flex justify-start items-center w-full gap-2'>
                                                    <h1>
                                                        Este usuário é :
                                                    </h1>
                                                    <h1 className='font-semibold'>
                                                        {userRole === 'ADMIN' ? 'Administrador' : 'Usuário'}
                                                    </h1>
                                                </div>
                                            </div>
                                            <h1 className=''>
                                                avaliações respondidas:
                                            </h1>
                                            <div className='py-4'>
                                                {userAnsweredValuations?.length > 0 ? (
                                                    <div>
                                                        {userAnsweredValuations?.map((valuation) => (
                                                            <Menu
                                                                key={valuation.valuationId}
                                                                as="div"
                                                                className="relative text-left w-full bg-gray-300 p-4 rounded-lg sm:flex justify-between items-center">
                                                                <div className='flex flex-col sm:w-1/9 py-4 sm:p-0 items-center justify-center text-nowrap sm:order-2 order-1'>
                                                                    <h1 className='text-xs'>
                                                                        nota:
                                                                    </h1>
                                                                    <div className='flex items-center justify-center'>
                                                                        {valuation.score} / {valuation.results.length}
                                                                    </div>
                                                                </div>
                                                                <div className='px-2 w-full sm:order-1 order-2'>
                                                                    <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold ring-inset hover:bg-gray-50">
                                                                        {valuation.valuationTitle}
                                                                        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                                                                    </MenuButton>

                                                                    <MenuItems
                                                                        transition
                                                                        className="mt-2 rounded-md transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                                                    >
                                                                        <div className="flex flex-col gap-2 w-full">
                                                                            {valuation.results.map((result, index) => (
                                                                                <MenuItem
                                                                                    key={index}
                                                                                >
                                                                                    <div
                                                                                        className="flex items-center justify-between p-2 gap-8 bg-(--color)/70 rounded-lg"
                                                                                        style={{
                                                                                            '--color': result.isCorrect === true ? "#84cc16" : isCorrectColor,
                                                                                        }}
                                                                                    >
                                                                                        <h1>{result.question}</h1>
                                                                                        <h1>{result.isCorrect === true ? "certa" : "errada"}</h1>
                                                                                    </div>
                                                                                </MenuItem>
                                                                            ))}
                                                                        </div>
                                                                    </MenuItems>
                                                                </div>

                                                            </Menu>
                                                        ))}
                                                    </div>
                                                ) : "Este usuário não respondeu nenhuma avaliação"}
                                            </div>
                                        </div>
                                    </div>

                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>

                    <div className=' w-8/9 py-8'>
                        <div className='flex flex-col items-center justify-center p-8'>
                            <h1 className='text-xl text-center font-semibold'>
                                Aqui você encontrará todos os usuários do CDS Academy.
                            </h1>
                            <h1 className='text-sm'>
                                Caso queira informações mais detalhadas, basta clicar sobre um deles!
                            </h1>
                        </div>
                        <div className='flex flex-col justify-start w-full' id='form' >
                            {users.map((user, index) => (
                                <div
                                    onClick={() => {
                                        setUserId(user.id);
                                        setUserEmail(user.email);
                                        setUserFirstname(user.firstname);
                                        setUserLastname(user.lastname);
                                        setUserRole(user.role);
                                        setUserPhotoUrl(user?.photo?.url);
                                        setUserAnsweredValuations(user.answeredValuations);
                                        setUserWatchedVideos(user.watchedVideos);
                                        setOpen(true);
                                    }}
                                    className='p-4'
                                    key={index}>
                                    <div className='p-8 bg-white flex justify-between rounded-lg hover:scale-102 hover:shadow-lg/20 transition-all duration-300 ease-in-out '>
                                        <div>
                                            <div className='w-full flex items-center justify-start text-xs'>
                                                <h1 className='font-semibold'>
                                                    id:
                                                </h1>

                                                <h1 className='p-2 flex items-center justify-center'>
                                                    {user.id}
                                                </h1>
                                            </div>
                                            <div className='flex items-center justify-center'>
                                                <img
                                                    className='rounded-full size-10'
                                                    src={user?.photo?.url ? user.photo.url : defaultProfilePhoto}
                                                />
                                                <h1 className='text-xl font-semibold px-4 py-8 w-full '>
                                                    {user.firstname} {user.lastname}
                                                </h1>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserReports;
