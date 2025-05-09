import React from 'react';
import { useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import defaultProfilePhoto from '../assets/profile.png';

const Profile = () => {
  const { user, authenticated } = useUser();
  const [profilePhoto, setProfilePhoto] = useState('');
  const photoUrl = user?.photo?.url;
  const [watchedvideosmesage, setWatchedvideosmesage] = useState();
  const isCorrectColor = "#dc2626"

  useEffect(() => {
    if (photoUrl == null) {
      setProfilePhoto(defaultProfilePhoto);
    }
    else {
      setProfilePhoto(photoUrl);
    }
  }, [photoUrl]);

  useEffect(() => {
    if (user?.watchedvideos?.length > 1) {
      setWatchedvideosmesage(`você assistiu ${user.watchedvideos.length} videos`);
    } else if (user?.watchedvideos?.length === 1) {
      setWatchedvideosmesage(`você assistiu ${user.watchedvideos.length} video`);
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
          <div className="w-4/5 sm:w-8/9 h-full shadow-lg rounded-md bg-white p-8 flex flex-col">
            <div className='flex justify-center items-center'>
              <img
                alt={photoUrl}
                src={profilePhoto}
                className="size-24 rounded-full"
              />
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
                  <div className='flex justify-between items-center w-full p-2'>
                    <div
                      key={valuation.valuationId}
                      className="flex items-center justify-between p-2 gap-8 bg-(--color)/70 rounded-lg w-full"
                      style={{
                        '--color': valuation.score / valuation.results.length > 0.7 ? "#84cc16" : isCorrectColor,
                      }}
                    >
                      <h1>
                        {valuation.valuationTitle}
                      </h1>
                      <h1>
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