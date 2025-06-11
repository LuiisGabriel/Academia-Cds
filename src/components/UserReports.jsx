import { useEffect, useState } from 'react';
import { useTreinamentos, useUser, useUsers } from '../lib/customHooks';
import Navbar from '../components/Navbar';
import defaultProfilePhoto from '../assets/profile.png';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import pencilEdit from '../assets/pencil-edit.svg'
import lixeira from '../assets/lixeira.svg'
import { API_ROUTES } from '../utils/constants';
import axios from 'axios';

const UserReports = () => {

    const { user, authenticated } = useUser();
    const users = useUsers();
    const treinamentos = useTreinamentos();

    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [userFirstname, setUserFirstname] = useState('');
    const [userLastname, setUserLastname] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userPhotoUrl, setUserPhotoUrl] = useState('');
    const [userAnsweredValuations, setUserAnsweredValuations] = useState([]);
    const [userWatchedVideos, setUserWatchedVideos] = useState([]);
    const [isEditUser, setIsEditUser] = useState(false);
    const [isRedefinePassword, setIsRedefinePassword] = useState(false);
    const [dirty, setIsDirty] = useState(false);
    const [open, setOpen] = useState(false);
    const isCorrectColor = "#dc2626";

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (newPassword || confirmNewPassword) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [newPassword, confirmNewPassword])

    if (!user || !authenticated || user.role !== 'ADMIN') {
        return (
            <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
                <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
            </div>
        )
    }

    function getConcluedTrainments(userWatchedVideos) {
        return treinamentos.filter((treinamento) => {

            const videoIds = (treinamento.videos || []).map(video => video.videoId);

            const hasWatchedAllVideos = videoIds.length > 0 && videoIds.every(videoId =>
                userWatchedVideos?.includes(videoId)
            );
            return hasWatchedAllVideos;
        })
    };

    const closeDialog = () => {
        if (!dirty) {
            setIsEditUser(false);
            setIsRedefinePassword(false);
            setOpen(false);
        } else {
            if (confirm('Você tem mudanças não salvas')) {
                setConfirmNewPassword('');
                setNewPassword('');
                setIsEditUser(false);
                setIsRedefinePassword(false);
                setIsDirty(false);
                setOpen(false)
            } else { }
        }
    };

    const deleteUser = async () => {
        if (userEmail === user.email) {
            alert('Por questões de sgurança um administrador não pode deletar a própria conta!')
            return;
        }
        if (confirm('Você quer deletar este usuário?')) {
            try {
                setIsLoading(true);
                const deleteResponse = await axios.post(API_ROUTES.DELETE_NEXTUSER, {
                    email: userEmail,
                });
                if (!deleteResponse?.data) {
                    alert('Algo deu errado durante a remoção!')
                    console.log('Algo deu errado durante a remoção: ', response);
                    return;
                } else {
                    window.location.reload();
                }
            } catch (err) {
                console.log('Ocorreu algum erro na remoção: ', err);
            } finally {
                setIsLoading(false);
            }
        } else { }
    };

    const updateUser = async () => {
        if (!dirty) {
            setIsEditUser(false);
            setIsRedefinePassword(false);
            return;
        }
        try {
            setIsLoading(true);

            if (newPassword && confirmNewPassword) {
                if (!newPassword || !confirmNewPassword) {
                    alert('Digite uma nova senha!')
                    return;
                }
                if (newPassword !== confirmNewPassword) {
                    alert('As senhas não conferem, tente novamente!')
                    return;
                }
                const response = await axios.post(API_ROUTES.UPDATE_NEXTUSER, {
                    email: userEmail,
                    firstname: userFirstname,
                    lastname: userLastname,
                    role: userRole,
                    answeredValuations: userAnsweredValuations ? userAnsweredValuations : [],
                });

                const redefinePasswordResponse = await axios.post(API_ROUTES.REDEFINE_PASSWORD, {
                    email: userEmail,
                    newPassword,
                });

                if (!response?.data) {
                    alert('Algo deu errado durante o salvamento!')
                    console.log('Algo deu errado durante o salvamento: ', response);
                    return;
                }

                if (!redefinePasswordResponse?.data) {
                    alert('Algo deu errado durante a redefinição de senha!')
                    console.log('Algo deu errado durante a redefinição de senha: ', response);
                    return;
                }

                if (response.data || redefinePasswordResponse.data) {
                    setIsDirty(false);
                    setIsEditUser(false);
                    setIsRedefinePassword(false);
                    window.location.reload();
                    alert('Alterações salvas com sucesso!!');
                }
            } else {
                const response = await axios.post(API_ROUTES.UPDATE_NEXTUSER, {
                    email: userEmail,
                    firstname: userFirstname,
                    lastname: userLastname,
                    role: userRole,
                    answeredValuations: userAnsweredValuations ? userAnsweredValuations : [],
                });

                if (!response?.data) {
                    alert('Algo deu errado durante o salvamento!')
                    console.log('Algo deu errado durante o salvamento: ', response);
                    return;
                }

                if (response.data) {
                    setIsDirty(false);
                    setIsEditUser(false);
                    setIsRedefinePassword(false);
                    window.location.reload();
                    alert('Alterações salvas com sucesso!!');
                }
            }
        } catch (error) {
            console.error('Error updating NextUser:', error.response?.data || error);
            alert(error.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    const removeValuation = (index) => {
        setIsDirty(true);
        setUserAnsweredValuations(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className='bg-gray-300 w-full h-auto min-h-screen'>
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='flex flex-col justify-center items-center'>

                    <Dialog open={open} onClose={() => { }}
                        className="relative z-10">

                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto h-full">
                            <div className="flex min-h-full justify-center p-4 text-center items-center py-15">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden h-full rounded-lg bg-white text-left shadow-xl transition-all data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 sm:w-9/10 data-closed:sm:translate-y-0"
                                >
                                    <div className="flex items-start w-full py-4 ">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left px-6 w-full">
                                            <div className='w-full flex justify-end items-center mb-8'>
                                                <button
                                                    className='text-lg font-bold hover:scale-115 transition-all duration-300 ease-in-out'
                                                    onClick={() => {
                                                        closeDialog();
                                                    }}>
                                                    X
                                                </button>
                                            </div>
                                            <div className='flex justify-between items-center gap-2 pb-4 select-text'>
                                                <div className='flex items-center justify-start gap-2'>
                                                    <h1 className='text-sm font-semibold select-none'>
                                                        id:
                                                    </h1>
                                                    <h1 className='text-sm'>
                                                        {userId}
                                                    </h1>
                                                </div>
                                                {!isEditUser && (<div>
                                                    <img
                                                        className='size-5 hover:scale-105 select-none'
                                                        src={pencilEdit}
                                                        onClick={() => {
                                                            setIsEditUser(true);
                                                        }}
                                                    />
                                                </div>)}
                                            </div>
                                            <DialogTitle as="h3" className="text-base font-semibold text-xl">
                                                {userFirstname} {userLastname}
                                            </DialogTitle>
                                            <div className='p-2'>
                                                <h1 className='text-md font-light text-gray-500'>
                                                    {userEmail}
                                                </h1>
                                            </div>

                                            {isEditUser ? (
                                                <div className='w-full max-h-15 py-4 gap-2 flex items-center justify-start select-none'>
                                                    <h1 className='font-semibold'>
                                                        Este usuário é :
                                                    </h1>
                                                    <select
                                                        type="text"
                                                        onChange={(e) => {
                                                            setIsDirty(true);
                                                            setUserRole(e.target.value);
                                                        }}
                                                        value={userRole}
                                                        className="border-2 outline-none rounded-md font-semibold"
                                                    >
                                                        <option value='USER'>
                                                            Usuário
                                                        </option>

                                                        <option value='ADMIN'>
                                                            Administrador
                                                        </option>

                                                    </select>
                                                </div>
                                            ) : (<div className='flex flex-col justify-start items-center space-y-4 py-4 select-none'>
                                                <div className='flex justify-start items-center w-full gap-2'>
                                                    <h1 className='font-semibold'>
                                                        Este usuário é :
                                                    </h1>
                                                    <h1 className=''>
                                                        {userRole === 'ADMIN' ? 'Administrador' : 'Usuário'}
                                                    </h1>
                                                </div>
                                            </div>)}

                                            {isRedefinePassword ? (
                                                <div className='w-full gap-2 sm:flex items-center justify-start select-none'>
                                                    <h1 className='flex items-center justify-start'>
                                                        Senha :
                                                    </h1>
                                                    <div className='sm:flex sm:gap-4 sm:items-center sm:justify-start'>
                                                        <div className='py-2'>
                                                            <input
                                                                onChange={
                                                                    (e) => {
                                                                        setNewPassword(e.target.value);
                                                                    }
                                                                }
                                                                type='password'
                                                                value={newPassword}
                                                                required
                                                                className='px-2 rounded-lg border-2 outline-none sm:w-auto w-full'
                                                                placeholder='Digite a senha Nova'
                                                            />
                                                        </div>
                                                        <div className='py-2'>
                                                            <input
                                                                onChange={
                                                                    (e) => {
                                                                        setConfirmNewPassword(e.target.value);
                                                                    }
                                                                }
                                                                type='password'
                                                                value={confirmNewPassword}
                                                                required
                                                                className=' px-2 rounded-lg border-2 outline-none sm:w-auto w-full'
                                                                placeholder='Confirme a senha Nova'
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => {
                                                                setNewPassword('');
                                                                setConfirmNewPassword('');
                                                                setIsRedefinePassword(false);
                                                            }}
                                                            className='p-2 text-red-500 hover:scale-105'>
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='flex justify-start items-center py-4 select-none gap-8'>
                                                    <div className='flex justify-start items-center gap-2'>
                                                        <h1 className='font-semibold'>
                                                            Senha :
                                                        </h1>
                                                        <h1>
                                                            *********
                                                        </h1>
                                                    </div>
                                                    {isEditUser && (
                                                        <div>
                                                            <button
                                                                onClick={() => {
                                                                    setIsRedefinePassword(true);
                                                                }}
                                                                className='bg-gray-800 p-2 rounded-lg text-white text-sm hover:scale-105 hover:bg-gray-800/70 tyransition-all duration-300 ease-in-out'>
                                                                Redefinir senha
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                            )}



                                            <h1 className='sm:pt-4 pt-4 select-none font-semibold'>
                                                avaliações respondidas:
                                            </h1>
                                            <div className='py-4 overflow-y-auto max-h-100 select-none'>
                                                {userAnsweredValuations?.length > 0 ? (
                                                    <div className='space-y-4'>
                                                        {userAnsweredValuations?.map((valuation, index) => (
                                                            <Menu
                                                                key={valuation.valuationId}
                                                                as="div"
                                                                className="relative text-left w-full bg-gray-300 p-4 rounded-lg sm:flex justify-between items-center">
                                                                <div className='px-2 w-full'>
                                                                    <MenuButton
                                                                        className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold ring-inset hover:bg-gray-50">
                                                                        {valuation.valuationTitle}
                                                                        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                                                                    </MenuButton>

                                                                    <MenuItems
                                                                        transition
                                                                        className="mt-2 rounded-md transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                                                    >
                                                                        <div className="flex flex-col gap-2 w-full pointer-events-none">
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
                                                                <div className='flex flex-col sm:w-1/9 py-4 sm:p-0 items-center justify-center text-nowrap'>
                                                                    <h1 className='text-xs'>
                                                                        nota:
                                                                    </h1>
                                                                    <div className='flex items-center justify-center'>
                                                                        {valuation.score} / {valuation.results.length}
                                                                    </div>
                                                                </div>
                                                                {isEditUser && (
                                                                    <div className='flex items-center justify-center gap-8'>
                                                                        <img
                                                                            className='size-5 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer'
                                                                            onClick={() => removeValuation(index)}
                                                                            src={lixeira} />
                                                                    </div>
                                                                )}
                                                            </Menu>
                                                        ))}
                                                    </div>
                                                ) : <div className='p-4'>Este usuário ainda não respondeu nenhuma avaliação</div>}
                                            </div>
                                            <h1 className='select-none font-semibold'>
                                                treinamentos concluídos:
                                            </h1>
                                            <div className='py-4 space-y-4 overflow-y-auto max-h-100 select-none'>
                                                {(() => {
                                                    const concluedTrainments = getConcluedTrainments(
                                                        (userWatchedVideos || []).map(v => v.videoId)
                                                    );
                                                    return concluedTrainments.length > 0 ? (
                                                        concluedTrainments.map((treinamento) => (
                                                            <div className='p-4 bg-gray-300 rounded-lg' key={treinamento.titulo}>
                                                                <h1 className='text-lg font-semibold'>
                                                                    {treinamento.titulo}
                                                                </h1>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className='p-4'>Este usuário ainda não concluiu nenhum treinamento</div>
                                                    );
                                                })()}
                                            </div>

                                            {isEditUser ? (
                                                <div className='flex items-center justify-center p-2 select-none'>
                                                    <button
                                                        onClick={
                                                            () => {
                                                                updateUser();
                                                            }
                                                        }
                                                        className='p-2 text-white rounded-lg bg-gray-800 hover:scale-105 hover:bg-gray-800/70 transition-all duration-300 ease-in-out'>
                                                        Salvar
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='flex items-center justify-center p-2 select-none'>
                                                    <button
                                                        onClick={
                                                            () => {
                                                                deleteUser();
                                                            }
                                                        }
                                                        className='p-2 text-red-500 hover:scale-105'>
                                                        Deletar
                                                    </button>
                                                </div>)}

                                        </div>
                                    </div>

                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog >

                    <div className=' w-8/9 py-8'>
                        <div className='flex flex-col items-center justify-center p-8 select-none'>
                            <h1 className='text-xl text-center font-semibold'>
                                Aqui você encontrará todos os usuários do CDS Academy.
                            </h1>
                            <h1 className='text-sm'>
                                Caso queira informações mais detalhadas, basta clicar sobre um deles!
                            </h1>
                        </div>
                        <div className='flex flex-col justify-start w-full' id='form' >
                            {users.map((userMap, index) => (
                                <div
                                    onClick={() => {
                                        setUserId(userMap.id);
                                        setUserEmail(userMap.email);
                                        setUserFirstname(userMap.firstname);
                                        setUserLastname(userMap.lastname);
                                        setUserRole(userMap.role);
                                        setUserPhotoUrl(userMap?.photo?.url);
                                        setUserAnsweredValuations(userMap.answeredValuations);
                                        setUserWatchedVideos(userMap.watchedVideos);
                                        setOpen(true);
                                    }}
                                    className='p-4'
                                    key={index}>
                                    <div className='p-8 bg-white flex justify-between rounded-lg hover:scale-102 hover:shadow-lg/20 transition-all duration-300 ease-in-out '>
                                        <div>
                                            <div className='w-full flex items-center justify-start text-xs'>
                                                <h1 className='font-semibold select-none'>
                                                    id:
                                                </h1>

                                                <h1 className='p-2 flex items-center justify-center'>
                                                    {userMap.id}
                                                </h1>
                                            </div>
                                            <div className='flex items-center justify-center select-none' >
                                                <img
                                                    className='rounded-full size-10'
                                                    src={userMap?.photo?.url ? userMap.photo.url : defaultProfilePhoto}
                                                />
                                                <h1 className='text-xl font-semibold px-4 py-8 w-full'>
                                                    {userMap.firstname} {userMap.lastname}
                                                </h1>
                                            </div>

                                        </div>

                                        {userMap.email === user.email && (<div className='flex flex-col items-center justify-center'>
                                            <h1 className='text-lg font-semibold'>
                                                Você
                                            </h1>
                                        </div>)}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};

export default UserReports;