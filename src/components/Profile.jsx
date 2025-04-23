import React from 'react';
import { useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import defaultProfilePhoto from '../assets/profile.png';

const LandingPage = () => {
  const { user, authenticated } = useUser();
  const [profilePhoto, setProfilePhoto] = useState('');
  const photoUrl = user?.photo?.url;

  useEffect(() => {
    if (photoUrl == null) {
      setProfilePhoto(defaultProfilePhoto);
    }
    else {
      setProfilePhoto(photoUrl);
    }
  }, [photoUrl]);

  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }
  return (
    <>
      <nav className="sticky top-0 z-50"><Navbar /></nav>
      <div className="w-full h-screen flex justify-center items-center bg-gray-300">
        <div className="w-1/2 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col">
          <div className='flex justify-center items-center'>
            <img
              alt={photoUrl}
              src={profilePhoto}
              className="size-24 rounded-full"
            />
          </div>
          <h2 className="text-center font-medium text-2xl ">
            {user.firstname} {user.lastname}
          </h2>
          <h1 className='flex justify-center text-2xl mb-4 text-gray-400'>
            {user.email}
          </h1>
          <div className="flex flex-1 flex-col justify-evenly">

            <input
              className="border-2 outline-none p-2 rounded-md"
              type="text"
              placeholder="modulo"
            />
            <input
              className="border-2 outline-none p-2 rounded-md"
              type="text"
              placeholder="Sub-módulo"
              required
            />
            <input
              className="border-2 outline-none p-2 rounded-md"
              type="text"
              placeholder="Video id"
              required
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default LandingPage;