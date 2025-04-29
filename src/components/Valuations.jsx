import React from 'react';
import { useUser } from '../lib/customHooks';
import Navbar from './Navbar';

// neededVideos.every(r => watchedVideos.includes(r))

const Valuations = () => {
  const { user, authenticated } = useUser();


  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }
  return (
    <>
      <nav className="sticky top-0 z-50"><Navbar /></nav>
      <div className='bg-gray-300 lg:flex items-center justify-center w-full h-auto py-38 '>

        <div className=" h-3/4 shadow-lg rounded-md bg-white p-8 mx-8  flex flex-col w-3/4 sm:w-3/4">
          <h2 className="text-center font-medium text-2xl ">
            Questão 1
          </h2>

          <div className="flex flex-1 flex-col justify-center items-start">
            <h1 className='p-8 flex '>
              1) perguntaperguntaperguntaperguntaperguntaperguntaperguntaperguntaperguntapergunta
            </h1>
            <form className='space-y-10 flex flex-col justify-start'>
              <div className='flex  gap-4'>
                <input
                  className="border-2 outline-none p-2 rounded-md"
                  type="checkbox"
                />
                resposta 1
              </div>
              <div className='flex  gap-4'>
                <input
                  className="border-2 outline-none p-2 rounded-md"
                  type="checkbox"
                />
                resposta 2
              </div>
              <div className='flex  gap-4'>
                <input
                  className="border-2 outline-none p-2 rounded-md"
                  type="checkbox"
                />
                resposta 3
              </div>
              <div className='flex  gap-4'>
                <input
                  className="border-2 outline-none p-2 rounded-md"
                  type="checkbox"
                />
                resposta 4
              </div>
            </form>
          </div>
        </div>

        <div className='h-full  flex-col flex justify-end w-1/4 items-center px-8'>
          <form className='flex-col flex gap-y-7 w-full'>
            
            <div className='flex justify-center items-center w-3/3 gap-4 bg-gray-800 rounded-lg p-4'>
              <h1 className='text-white'>
                Questão 1
              </h1>
            <input
              className='bg-gray-300 size-5 rounded-full'
            />
            </div>

            <div className='flex justify-center items-center gap-4 bg-gray-800 rounded-lg p-4'>
              <h1 className='text-white'>
              Questão 2
              </h1>
            <input
              className='bg-gray-600 size-5 rounded-full'
            />
            </div>

            <div className='flex justify-center items-center gap-4 bg-gray-800 rounded-lg p-4'>
              <h1 className='text-white'>
              Questão 3
              </h1>
            <input
              className='bg-gray-600 size-5 rounded-full'
            />
            </div>

            <div className='flex justify-center items-center gap-4 bg-gray-800 rounded-lg p-4'>
              <h1 className='text-white'>
              Questão 4
              </h1>
            <input
              className='bg-gray-600 size-5 rounded-full'
            />
            </div>

            <div className='flex justify-center items-center gap-4 bg-gray-800 rounded-lg p-4'>
              <h1 className='text-white'>
              Questão 5
              </h1>
            <input
              className='bg-gray-600 size-5 rounded-full'
            />
            </div>

          </form>
        </div>

      </div>
    </>
  );
}
export default Valuations;
