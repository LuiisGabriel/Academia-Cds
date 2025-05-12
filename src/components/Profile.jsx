import React from 'react';
import { useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import defaultProfilePhoto from '../assets/profile.png';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, authenticated } = useUser();
  const [profilePhoto, setProfilePhoto] = useState('');
  const photoUrl = user?.photo?.url;
  const [watchedvideosmesage, setWatchedvideosmesage] = useState();
  const watchedVideos = user?.watchedVideos?.map((watchedVideo) => (watchedVideo.id));
  const isCorrectColor = "#dc2626";
  const [open, setOpen] = useState(false);
  const [valuationId, setValuationId] = useState('');
  const [valuationTitle, setValuationTitle] = useState('');
  const [answerOptions, setAnswerOptions] = useState([]);

  useEffect(() => {
    if (photoUrl == null) {
      setProfilePhoto(defaultProfilePhoto);
    }
    else {
      setProfilePhoto(photoUrl);
    }
  }, [photoUrl]);

  useEffect(() => {
    if (watchedVideos?.length > 1) {
      setWatchedvideosmesage(`você assistiu ${watchedVideos?.length} videos`);
    } else if (watchedVideos?.length === 1) {
      setWatchedvideosmesage(`você assistiu ${watchedVideos?.length} video`);
    } else if (user) {
      setWatchedvideosmesage("você não assistiu nenhum video");
    }
  }, [user]);

  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  return (
    <>
      <div className="w-full h-auto min-h-screen  bg-gray-300">
        <nav className="sticky top-0 z-50"><Navbar /></nav>
        <div className='flex justify-center items-center pt-16'>


          <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                  transition
                  className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-5/6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                >

                  <div className='flex justify-end items-end p-4'>
                    <h1
                      onClick={() => setOpen(false)}
                      className='hover:scale-110 cursor-pointer text-lg'>
                      X
                    </h1>
                  </div>
                  <div className="flex items-start w-full pb-4">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left px-8 w-full">
                      <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        {valuationTitle}
                      </DialogTitle>
                      <div className="flex flex-col py-4 gap-4">
                        {answerOptions.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 gap-8 bg-(--color)/70 rounded-lg"
                            style={{
                              '--color': option.isCorrect === true ? "#84cc16" : isCorrectColor,
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


          <div className="w-4/5 sm:w-8/9 h-full shadow-lg rounded-md bg-white p-8 flex flex-col">
            <div className='flex justify-center items-center'>
              <div className='flex flex-col justify-center items-end'>
                <img
                  alt={photoUrl}
                  src={profilePhoto}
                  className="size-24 rounded-full hover:scale-105 hover:opacity-80 transition-all duration-300 ease-in-out"
                />
              </div>
            </div>
            <h1 className="text-center font-medium text-2xl ">
              {user.firstname} {user.lastname}
            </h1>
            <h1 className='flex justify-center text-2xl mb-4 text-gray-400'>
              {user.email}
            </h1>
            <h1 className='text-center font-medium text-2xl'>
              {watchedvideosmesage}
            </h1>
            <div className='flex flex-col justify-center items-center h-full w-full'>
              <h1 className='p-4 pt-8 w-full flex'>
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
                      className="flex items-center justify-between p-4 gap-8 bg-gray-300 rounded-lg w-full hover:scale-101 transition-all duration-300 ease-in-out"

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
