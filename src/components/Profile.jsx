import { useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import defaultProfilePhoto from '../assets/profile.png';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import pencilEdit from '../assets/pencil-edit.svg'
import axios from 'axios';
import { API_ROUTES } from '../utils/constants';

const Profile = () => {
  const { user, authenticated } = useUser();
  const [profilePhoto, setProfilePhoto] = useState('');
  const photoUrl = user?.photo?.url;
  const [open, setOpen] = useState(false);
  const [valuationId, setValuationId] = useState('');
  const [valuationTitle, setValuationTitle] = useState('');
  const [answerOptions, setAnswerOptions] = useState([]);
  const [isEditUser, setIsEditUser] = useState(false);
  const [userFirstname, setUserFirstname] = useState('');
  const [userLastname, setUserLastname] = useState('');
  const [dirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  useEffect(() => {
    if (photoUrl == null) {
      setProfilePhoto(defaultProfilePhoto);
    }
    else {
      setProfilePhoto(photoUrl);
    }
  }, [photoUrl]);

  useEffect(() => {
    if (user) {
      setUserFirstname(user.firstname);
      setUserLastname(user.lastname);
    }
  }, [user])

  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  window.onbeforeunload = function () {
    return dirty ? "" : null;
  };

  const updateUser = async () => {
    if (!dirty) {
      setIsEditUser(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(API_ROUTES.UPDATE_NEXTUSER, {
        email: user.email,
        firstname: userFirstname,
        lastname: userLastname,
        role: user.role,
        answeredValuations: user.answeredValuations ? user.answeredValuations : [],
      });
      if (!response?.data) {
        alert('Algo deu errado durante o salvamento!')
        console.log('Algo deu errado durante o salvamento: ', response);
        return;
      } else {
        setIsDirty(false);
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 1000);
        setTimeout(() => setIsEditUser(false), 1000);
      }
    } catch (error) {
      console.error('Error updating NextUser:', error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-auto min-h-screen  bg-gray-300">
        <nav className="sticky top-0 z-50"><Navbar /></nav>
        <div className='flex justify-center items-center pt-16'>

          <Dialog open={open} onClose={() => {
            setOpen(false);
          }}
            className="relative z-10 select-none">
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full  justify-center p-4 text-center items-center sm:p-0">
                <DialogPanel
                  transition
                  className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-5/6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                >
                  <div className="flex items-start w-full py-8 ">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left px-8 w-full">
                      <div className='flex justify-start items-center gap-2 pb-4 select-text'>
                        <h1 className='text-sm font-semibold select-none'>
                          id:
                        </h1>
                        <h1 className='text-sm'>
                          {valuationId}
                        </h1>
                      </div>
                      <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        {valuationTitle}
                      </DialogTitle>
                      <div className="flex flex-col py-4 gap-4 ">
                        {answerOptions.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 gap-8 bg-(--color)/70 rounded-lg "
                            style={{
                              '--color': option.isCorrect === true ? "#84cc16" : "#dc2626",
                            }}
                          >
                            <h1>{option.question}</h1>
                            <h1>{option.isCorrect === true ? "certa" : "errada"}</h1>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </DialogPanel>
              </div>
            </div>
          </Dialog>

          <Dialog open={editSuccess} onClose={() => {
            setEditSuccess(false);
          }}
            className="relative z-10 select-none">
            <DialogBackdrop
              transition
              className="fixed inset-0 h-full bg-gray-500/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
              <div className="flex min-h-screen justify-center text-center items-center">
                <DialogPanel
                  transition
                  className="relative transform overflow-hidden rounded-lg bg-white p-8 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                >
                  <h1 className='w-full flex items-center justify-center text-center text-lg font-semibold'>
                    Alterações salvas com sucesso!
                  </h1>
                </DialogPanel>
              </div>
            </div>
          </Dialog>

          <div className="w-4/5 sm:w-8/9 h-full shadow-lg rounded-md bg-white p-8 flex flex-col select-none">
            <div className='w-full flex items-center justify-end'>
              {!isEditUser && (<img
                className='size-5 hover:scale-105'
                onClick={() => {
                  setIsEditUser(true);
                }}
                src={pencilEdit}
              />)}
            </div>
            <div className='flex justify-center items-center w-full'>
              <div className='relative flex items-start justify-center'>
                <img
                  alt={photoUrl}
                  src={profilePhoto}
                  className="size-24 rounded-full"
                />
                {isEditUser && (<img
                  className='size-3 hover:scale-115 absolute -right-2'
                  onClick={() => {

                  }}
                  src={pencilEdit}
                />)}
              </div>
            </div>
            <h1 className='flex justify-center text-xl text-gray-500'>
              {user.email}
            </h1>
            {!isEditUser ? (
              <h1 className="text-center font-medium text-2xl mt-4">
                {userFirstname} {userLastname}
              </h1>) : (
              <div className='w-full flex items-center justify-center p-2 gap-4 pt-4 pb-8'>
                <div className='flex flex-col items-center justify-start w-3/3 sm:w-1/4'>
                  <div className='w-full flex items-center justify-start'>
                    <h1 className='text-sm text-gray-500'>
                      Nome
                    </h1>
                  </div>
                  <input
                    className="border-2 outline-none px-2 rounded-md w-full"
                    type="text"
                    placeholder="Nome"
                    value={userFirstname}
                    required
                    onChange={(e) => {
                      setIsDirty(true);
                      setUserFirstname(e.target.value);
                    }}
                  />
                </div>

                <div className='flex flex-col items-center justify-start w-3/3 sm:w-1/4'>
                  <div className='w-full flex items-center justify-start'>
                    <h1 className='text-gray-500 text-sm'>
                      Sobre nome
                    </h1>
                  </div>
                  <input
                    className="border-2 px-2 outline-none rounded-md w-full"
                    type="text"
                    placeholder="Sobre Nome"
                    value={userLastname}
                    onChange={(e) => {
                      setIsDirty(true);
                      setUserLastname(e.target.value);
                    }}
                  />
                </div>
              </div>
            )}

            {isEditUser && (<div className='flex items-center justify-center gap-16 p-2 select-none mb-8'>
              <button
                onClick={
                  () => {
                    updateUser();
                  }
                }
                className='px-2 py-1 text-white rounded-lg bg-gray-800 hover:scale-105'>
                Salvar
              </button>

              <button
                onClick={
                  () => {
                    setUserFirstname(user.firstname);
                    setUserLastname(user.lastname);
                    setIsDirty(false);
                    setIsEditUser(false);
                  }
                }
                className='p-2 text-red-500 hover:scale-105'>
                Cancelar
              </button>
            </div>)}

            <div className='flex flex-col justify-center items-center h-full w-full'>
              <h1 className=' pt-8 w-full flex items-center justify-center'>
                avaliações respondidas:
              </h1>
              <div className='w-full'>
                <div className='flex justify-between items-center w-full p-2'>
                  <h1>
                    Avaliação
                  </h1>
                  <h1>
                    Nota
                  </h1>
                </div>
                {user?.answeredValuations?.map((valuation) => (
                  <div
                    onClick={() => {
                      setOpen(true);
                      setValuationId(valuation.valuationId);
                      setValuationTitle(valuation.valuationTitle);
                      setAnswerOptions(valuation.results);
                    }}
                    key={valuation.valuationId}
                    className='flex justify-between items-center w-full py-2'>
                    <div
                      className="flex items-center justify-between p-4 gap-8 bg-gray-300 cursor-pointer rounded-lg w-full hover:scale-101 transition-all duration-300 ease-in-out"
                    >
                      <h1 className='font-semibold'>
                        {valuation.valuationTitle}
                      </h1>
                      <h1 className='font-semibold text-nowrap'>
                        {valuation.score} / {valuation.results.length}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Profile;