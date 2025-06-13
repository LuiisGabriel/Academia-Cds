import { useTreinamentos, useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import defaultProfilePhoto from '../assets/profile.png';
import defaultBannerPhoto from '../assets/CDSSistemas.jpg';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import pencilEdit from '../assets/pencil-edit.svg';
import config from '../assets/config.svg';
import axios from 'axios';
import { API_ROUTES } from '../utils/constants';

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
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [dirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const [page, setPage] = useState(0);

  useEffect(() => {
    if (user) {
      setUserFirstname(user.firstname);
      setUserLastname(user.lastname);
      setUserEmail(user.email);
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

  const sections = [

    {
      title: 'Minhas informações',
      content: (
        <div className='w-full px-16'>

          <div className='w-full flex items-center justify-end py-8 gap-8'>
            {!isEditUser && (

              <img
                onClick={() => {
                  setIsEditUser(true);
                }}
                className='size-5 hover:scale-115 transition-all duration-300 ease-in-out'
                src={pencilEdit}
              />

            )}
          </div>

          <div className='w-full flex flex-col items-center justify-center py-8 gap-4'>

            <div className=' w-2/4 flex items-center justify-between'>
              <h1 className='text-nowrap'>
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
                  className='px-2 rounded-lg border-2 outline-none'
                  placeholder='Nome'
                />

              )}
            </div>

            <div className='w-2/4 flex items-center justify-between gap-4'>
              <h1 className='text-nowrap'>
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
                  className='px-2 rounded-lg border-2 outline-none'
                  placeholder='Sobre-nome'
                />
              )}
            </div>

            <div className='w-2/4 flex items-center justify-between gap-4'>
              <h1 className='text-nowrap'>
                Email:
              </h1>

              <h1>
                {userEmail}
              </h1>

            </div>

            <div className='w-2/4 flex items-center justify-between gap-4'>
              <h1 className='text-nowrap'>
                Senha:
              </h1>

              <h1>
                **********
              </h1>
            </div>

          </div>

          {isEditUser && (

            <div className='w-full flex items-center justify-between'>

              {dirty && (<button
                onClick={
                  () => {
                    updateUser();
                  }
                }
                className='p-2 text-white rounded-lg bg-gray-800 hover:scale-105 hover:bg-gray-800/70 transition-all duration-300 ease-in-out'>
                Salvar
              </button>)}

              <button
                onClick={() => {
                  setUserFirstname(user?.firstname);
                  setUserLastname(user?.lastname);
                  setIsDirty(false);
                  setIsEditUser(false);
                }}
                className='text-red-500 p-2 hover:scale-105 transition-all duration-300 ease-in-out'>
                Cancelar
              </button>
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
                className="flex items-center justify-between p-4 gap-8 bg-gray-500 rounded-lg w-full "
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
                    className="flex items-center justify-between p-4 gap-8 bg-gray-500 rounded-lg w-full mt-2"
                  >
                    <h1 className='font-semibold'>
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
        <div className='flex flex-col items-center justify-center p-16'>
          <h1 className='text-lg font-semibold'>
            Em breve
          </h1>
        </div>
      )
    },

  ];

  return (
    <>
      <div className="w-full h-auto min-h-screen bg-gray-300">
        <nav className="sticky top-0 z-50"><Navbar /></nav>
        <div className='w-full flex flex-col justify-center items-center'>

          <div className='w-full flex flex-col items-center justify-center'>

            <div
              style={{ '--image-url': `url(${bannerUrl ? bannerUrl : defaultBannerPhoto})` }}
              className='w-full flex flex-col items-center justify-center bg-[image:var(--image-url)] bg-cover bg-no-repeat bg-center'>

              <div className='w-full flex flex-col items-center justify-center pt-16 select-none backdrop-brightness-40'>
                <div className=' pb-4 flex items-center justify-center select-none'>
                  <img
                    className='rounded-full size-25 hover:scale-105 hover:contrast-50 transition-all duration-300 ease-in-out'
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

                <div className='w-full h-full flex items-bottom px-4 justify-between transition-all duration-300 ease-in-out select-none overflow-x-auto'>
                  {sections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setPage(index);
                      }}
                      style={{
                        '--color': page === index ? '#d1d5db' : '',
                        '--text-color': page === index ? '#000000' : '#FFFFFF',
                      }}
                      className='w-full bg-(--color) text-(--text-color) flex items-center justify-center p-4 rounded-t-lg'>
                      <h1
                        style={{
                          '--size': page === index ? '1' : '1.05',
                        }}
                        className='hover:scale-(--size) transition-all duration-300 ease-in-out'
                      >
                        {section.title}
                      </h1>
                    </button>
                  ))}
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