import { useTreinamentos, useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import defaultProfilePhoto from '../assets/profile.png';
import defaultBannerPhoto from '../assets/CDSSistemas.png';
import pencilEdit from '../assets/pencil-edit.svg';
import axios from 'axios';
import { API_ROUTES } from '../utils/constants';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

const Profile = () => {
  const { user, authenticated } = useUser();
  const treinamentos = useTreinamentos();
  const bannerUrl = user?.photo?.url;
  const photoUrl = user?.photo?.url;

  const [valuationId, setValuationId] = useState('');
  const [valuationTitle, setValuationTitle] = useState('');
  const [answerOptions, setAnswerOptions] = useState([]);

  const [isEditUser, setIsEditUser] = useState(false);
  const [isConfig, setIsConfig] = useState(false);
  const [open, setOpen] = useState(false);

  const [userFirstname, setUserFirstname] = useState('');
  const [userLastname, setUserLastname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmationPhrase, setConfirmationPhrase] = useState('');

  const [dirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedefinePassword, setIsRedefinePassword] = useState(false);
  const [isDeleteAccount, setIsDeleteAccount] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const [page, setPage] = useState(0);

  useEffect(() => {
    if (user) {
      setUserFirstname(user.firstname);
      setUserLastname(user.lastname);
      setUserEmail(user.email);
      setUserRole(user.role);
    }
  }, [user]);

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
        setIsEditUser(false);
      }
    } catch (error) {
      console.error('Error updating NextUser:', error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  function getConcluedTrainments(userWatchedVideos) {
    return treinamentos.filter((treinamento) => {

      const videoIds = (treinamento.videos || []).map(video => video.videoId);

      const hasWatchedAllVideos = videoIds.length > 0 && videoIds.every(videoId =>
        userWatchedVideos?.includes(videoId)
      );
      return hasWatchedAllVideos;
    })
  };

  const redefinePassword = async () => {
    event.preventDefault();
    try {
      const response = await axios.post(API_ROUTES.REDEFINE_PASSWORD, {
        email: userEmail,
        newPassword,
      });
      if (response?.data) {
        setNewPassword('');
        setConfirmNewPassword('');
        setIsDirty(false);
        alert('Senha redefinida com sucesso!!!');
        setIsRedefinePassword(false);
      } else {
        console.log('Algo deu errado durante a redefinição de senha: ', response);
        return;
      }
    } catch (error) {
      console.error('Error updating NextUser:', error.response?.data || error);
      alert(error.response?.data?.message);
    }
  }

  const deleteUser = async () => {

    if (confirmationPhrase != userEmail) {
      return;
    }
    if (confirm('Você tem certeza de que quer excluir sua conta?')) {
      try {
        setIsLoading(true);
        const deleteResponse = await axios.post(API_ROUTES.DELETE_NEXTUSER, {
          email: userEmail,
        });
        if (!deleteResponse?.data) {
          alert('Algo deu errado durante a remoção!');
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

  const sections = [

    {
      title: 'Minhas informações',
      content: (
        <div className='w-full sm:px-16'>

          <div className='w-full flex items-center justify-end py-8 gap-8'>
            {!isEditUser && (

              <img
                onClick={() => {
                  setIsEditUser(true);
                }}
                className='size-5 hover:scale-115 transition-all duration-300 ease-in-out cursor-pointer'
                src={pencilEdit}
              />

            )}
          </div>

          <div className='w-full flex flex-col items-center justify-center py-8 gap-4 divide-y-1 divide-gray-500/10'>

            <div className='w-3/4 flex items-center justify-between'>
              <h1 className='text-nowrap w-1/2'>
                Nome:
              </h1>
              {!isEditUser ? (
                <h1>
                  {userFirstname}
                </h1>
              ) : (

                <input
                  onChange={
                    (e) => {
                      setIsDirty(true);
                      setUserFirstname(e.target.value);
                    }
                  }
                  type='text'
                  value={userFirstname}
                  required
                  className='px-2 rounded-lg border-2 outline-none w-1/2 text-center'
                  placeholder='Nome'
                />

              )}
            </div>

            <div className='w-3/4 flex items-center justify-between'>
              <h1 className='text-nowrap w-1/2'>
                Sobre-nome:
              </h1>
              {!isEditUser ? (
                <h1>
                  {userLastname}
                </h1>
              ) : (
                <input
                  onChange={
                    (e) => {
                      setIsDirty(true);
                      setUserLastname(e.target.value);
                    }
                  }
                  type='text'
                  value={userLastname}
                  required
                  className='px-2 rounded-lg border-2 outline-none w-1/2 text-center'
                  placeholder='Sobre-nome'
                />
              )}
            </div>

            <div className='w-3/4 flex items-center justify-between '>
              <h1 className='text-nowrap w-1/2'>
                Email:
              </h1>

              <h1 className='w-1/2 text-end'>
                {userEmail}
              </h1>

            </div>

            <div className='w-3/4 flex items-center justify-between'>
              <h1 className='text-nowrapw-1/2'>
                Tipo de usuário:
              </h1>

              <h1 className='w-1/2 text-end'>
                {userRole == 'ADMIN' ? 'Administrador' : 'Usuário'}
              </h1>

            </div>

          </div>

          {isEditUser && (
            <div className='w-ful flex items-center justify-center'>
              <div className={`w-1/2 sm:w-1/4 flex items-center ${dirty ? 'justify-between' : 'justify-center'}`}>

                {dirty && (<button
                  onClick={
                    () => {
                      updateUser();
                    }
                  }
                  className='p-2 text-white rounded-lg bg-gray-800 cursor-pointer hover:scale-105 hover:bg-gray-800/70 transition-all duration-300 ease-in-out'>
                  Salvar
                </button>)}

                <button
                  onClick={() => {
                    if (dirty) {
                      if (confirm('Isso irá apagar as alterações feitas. continuar?')) {
                        setUserFirstname(user?.firstname);
                        setUserLastname(user?.lastname);
                        setIsDirty(false);
                        setIsEditUser(false);
                      } else {
                        return;
                      }
                    } else {
                      setUserFirstname(user?.firstname);
                      setUserLastname(user?.lastname);
                      setIsDirty(false);
                      setIsEditUser(false);
                    }
                  }}
                  className='text-red-500 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer'>
                  Cancelar
                </button>
              </div>
            </div>
          )}

        </div>
      )
    },

    {
      title: 'Avaliações',
      content: (
        <div className='p-16 w-full'>

          {user?.answeredValuations?.length > 0 ? (
            <div className='w-full flex items-center justify-center'>
              <h1 className='text-lg font-semibold'>
                Avaliações respondidas por você:
              </h1>
            </div>
          ) : (
            <div className='w-full flex items-center justify-center'>
              <h1 className='text-lg font-semibold'>
                Você ainda não respondeu nenhuma avaliação
              </h1>
            </div>
          )}

          {user?.answeredValuations?.map((valuation) => (
            <div
              onClick={() => { }}
              key={valuation.valuationId}
              className='flex justify-between items-center w-full py-2'>
              <div
                className="flex items-center justify-between p-4 gap-8 bg-gray-800 rounded-lg w-full "
              >
                <h1 className='font-semibold text-white'>
                  {valuation.valuationTitle}
                </h1>
                <h1 className='font-semibold text-nowrap text-white'>
                  {valuation.score} / {valuation.results.length}
                </h1>
              </div>
            </div>
          ))}


        </div>
      )
    },

    {
      title: 'Treinamentos',
      content: (
        <div className='w-full p-16'>

          {(() => {
            const concluedTrainments = getConcluedTrainments(
              (user?.watchedVideos || []).map(v => v.videoId)
            );
            return concluedTrainments.length > 0 ? (
              concluedTrainments.map((treinamento) => (
                <div
                  onClick={() => { }}
                  key={treinamento.titulo}
                  className='flex flex-col justify-between items-center w-full'>
                  <div className='w-full flex items-center justify-center'>
                    <h1 className='text-lg font-semibold'>
                      Treinamentos concluídos por você:
                    </h1>
                  </div>
                  <div
                    className="flex items-center justify-between p-4 gap-8 bg-gray-800 rounded-lg w-full mt-2"
                  >
                    <h1 className='font-semibold text-white'>
                      {treinamento.titulo}
                    </h1>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center w-full'>
                <h1 className='text-lg font-semibold'>
                  Você ainda não concluiu nenhum treinamento
                </h1>
              </div>
            );
          })()}

        </div>
      )
    },

    {
      title: 'Configurações',
      content: (
        <div className='flex flex-col items-center justify-center p-16 '>
          <div className='flex flex-col sm:w-3/4 w-full divide-y-1 divide-gray-500/10 gap-4'>

            <div
              onClick={() => {
                setIsRedefinePassword(true);
              }}
              className='hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-md px-4 flex items-center justify-between'>
              <h1 className='text-lg  '>
                Redefinir senha
              </h1>
            </div>

            <div
              onClick={() => {
                setIsDeleteAccount(true);
              }}
              className='hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-md px-4'>
              <h1 className='text-lg text-red-500'>
                Excluir minha conta
              </h1>
            </div>

          </div>
        </div>
      )
    },

  ];

  return (
    <>
      <div className="w-full h-auto min-h-screen bg-gray-300">
        <nav className="sticky top-0 z-5">
          <Navbar />
        </nav>
        <div className='w-full flex flex-col justify-center items-center'>
          <div className='w-full flex flex-col items-center justify-center'>

            <Dialog open={isRedefinePassword} onClose={() => { }}
              className="relative z-10 select-none">
              <DialogBackdrop
                transition
                className="fixed inset-0 h-full bg-black/60 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
              />

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
                <div className="flex min-h-screen justify-center text-center items-center">
                  <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white w-3/4 p-8 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                  >
                    <div className='w-full flex items-center justify-center py-4'>
                      <h1 className='text-xl font-semibold'>
                        Redefina sua senha!
                      </h1>
                    </div>
                    <div className='w-full gap-2 flex flex-col items-center justify-start select-none'>

                      <div className='flex flex-col items-center justify-center w-3/4'>
                        <div className='py-2 w-full'>
                          <h1 className='font-semibold'>
                            Senha:
                          </h1>
                          <input
                            onChange={
                              (e) => {
                                setIsDirty(true);
                                setNewPassword(e.target.value);
                              }
                            }
                            type='password'
                            value={newPassword}
                            required
                            className='p-2 rounded-lg border-2 outline-none w-full'
                            placeholder='Digite a nova senha'
                          />
                        </div>
                        <div className='py-2 w-full'>
                          <h1 className='font-semibold'>
                            Confirme a senha:
                          </h1>
                          <input
                            onChange={
                              (e) => {
                                setIsDirty(true);
                                setConfirmNewPassword(e.target.value);
                              }
                            }
                            type='password'
                            value={confirmNewPassword}
                            required
                            className=' p-2 rounded-lg border-2 outline-none w-full'
                            placeholder='Confirme a nova senha'
                          />
                        </div>
                      </div>
                      <div className={`flex items-center ${newPassword && confirmNewPassword ? 'justify-between' : 'justify-center'}  w-1/2`}>
                        {newPassword && confirmNewPassword && (
                          <div>
                            <button
                              onClick={() => {
                                redefinePassword();
                              }}
                              className='p-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:scale-105 hover:bg-gray-800/70 transition-all duration-300 ease-in-out'>
                              Salvar
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setNewPassword('');
                            setConfirmNewPassword('');
                            setIsDirty(false);
                            setIsRedefinePassword(false);
                          }}
                          className='p-2 text-red-500 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out'>
                          Cancelar
                        </button>
                      </div>
                    </div>

                  </DialogPanel>
                </div>
              </div>
            </Dialog>

            <Dialog open={isDeleteAccount} onClose={() => { }}
              className="relative z-10 select-none">
              <DialogBackdrop
                transition
                className="fixed inset-0 h-full bg-black/60 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
              />

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
                <div className="flex min-h-screen justify-center text-center items-center">
                  <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white w-3/4 p-8 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                  >

                    <div className='w-full flex flex-col items-center justify-center'>
                      <div className='w-full flex flex-col items-center justify-center pb-8 gap-4'>

                        <div className='bg-red-500/30 rounded-full p-4'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                          </svg>
                        </div>

                        <h1 className='text-lg font-semibold text-center'>
                          Deseja excluir sua conta?
                        </h1>

                        <div className='w-full flex flex-col items-center justify-center'>
                          <div className='w-3/4 flex flex-col items-start justify-center font-semibold border-2 rounded-lg p-4'>

                            <div className='w-full flex items-center justify-center'>
                              <h1 className='pb-8'>
                                Ao excluir sua conta você tem ciência de que :
                              </h1>
                            </div>

                            <div className='gap-4 flex flex-col items-start justify-center'>

                              <h1>
                                ° Suas ações não poderão ser revertidas posteriormente.
                              </h1>

                              <h1>
                                ° Todos os dados presentes nesta conta serão excluídos.
                              </h1>

                              <h1>
                                ° Processos de avaliação ou treinamento vinculados á sua conta serão apagados.
                              </h1>

                            </div>

                          </div>

                        </div>

                      </div>

                      <div className='w-full flex flex-col items-center justify-center'>
                        <div className='w-full flex flex-col gap-4'>

                          <div className='w-full flex items-center justify-center'>
                            <h1>
                              Reescreva a frase abaixo:
                            </h1>
                          </div>

                          <div className='w-full bg-red-500/30 mb-6 rounded-lg flex items-center justify-center'>
                            <h1 className='p-2 text-lg font-semibold'>
                              {userEmail}
                            </h1>
                          </div>

                        </div>
                      </div>

                      <div className='w-full'>
                        <input
                          onChange={
                            (e) => {
                              setIsDirty(true);
                              setConfirmationPhrase(e.target.value);
                            }
                          }
                          type='text'
                          value={confirmationPhrase}
                          required
                          className='p-2 rounded-lg border-2 outline-none w-full text-center'
                          placeholder='Rescreva aqui a frase de confirmação'
                        />
                      </div>

                      <div className={`sm:w-1/3 gap-8 flex items-center ${confirmationPhrase === userEmail ? 'justify-between' : 'justify-center'} pt-8`}>

                        <button
                          onClick={() => {
                            setConfirmationPhrase('');
                            setIsDirty(false)
                            setIsDeleteAccount(false);
                          }}
                          className='p-2 cursor-pointer rounded-lg bg-gray-800 hover:scale-105 hover:bg-gray-800/70 transition-all duration-300 ease-in-out'>
                          <h1 className='text-white'>
                            Cancelar
                          </h1>
                        </button>

                        {confirmationPhrase === userEmail && (<button
                          onClick={() => {
                            setIsDirty(false);
                            deleteUser();
                          }}
                          className='p-2 cursor-pointer text-red-500 hover:scale-105 transition-all duration-300 ease-in-out'>
                          Excluir
                        </button>)}

                      </div>

                    </div>

                  </DialogPanel>
                </div>
              </div>
            </Dialog>

            <div
              style={{ '--image-url': `url(${bannerUrl ? bannerUrl : defaultBannerPhoto})` }}
              className='w-full flex flex-col items-center justify-center bg-[image:var(--image-url)] bg-cover bg-no-repeat bg-center'>

              <div className='w-full flex flex-col items-center justify-center pt-16 select-none backdrop-brightness-40'>
                <div className=' pb-4 flex items-center justify-center select-none'>
                  <img
                    className='rounded-full size-25 hover:scale-105 hover:contrast-50 cursor-pointer transition-all duration-300 ease-in-out'
                    src={photoUrl ? photoUrl : defaultProfilePhoto}
                  />
                </div>

                <div className='w-full flex items-center justify-center gap-2 text-white font-semibold pb-16'>
                  <h1 className='text-2xl'>
                    {userFirstname}
                  </h1>
                  <h1 className='text-2xl'>
                    {userLastname}
                  </h1>
                </div>

                <div className='w-full h-full bg-black/30 flex items-bottom px-4 justify-between transition-all duration-300 ease-in-out select-none overflow-x-auto'>
                  {sections.map((section, index) => {

                    const isActive = index === page;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setPage(index);
                        }}
                        style={{
                          '--color': isActive ? '#d1d5db' : '',
                          '--text-color': isActive ? '#000000' : '#FFFFFF',
                        }}
                        className={`w-full bg-(--color) text-(--text-color) flex items-center justify-center p-4 rounded-t-lg cursor-pointer`}>
                        <h1
                          style={{
                            '--size': isActive ? '1' : '1.05',
                          }}
                          className='hover:scale-(--size) transition-all duration-300 ease-in-out'
                        >
                          {section.title}
                        </h1>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className='h-full w-full flex items-center justify-center'>

              <div className='w-full'>
                <h1>
                  {sections[page].content}
                </h1>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
export default Profile;
