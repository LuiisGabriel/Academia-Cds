import React from 'react';
import { useUser } from '../lib/customHooks';
import { LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';
import { APP_ROUTES } from '../utils/constants';
import Navbar from './Navbar';
import FrenteDeLoja from '../assets/FrenteDeLoja.jpg';
import Retaguarda from '../assets/Retaguarda.jpg';
import Otica from '../assets/Ótica.jpg';
import Fabrica from '../assets/Fabrica.jpg';
import PetShop from '../assets/PetShop.jpg';
import Nfe from '../assets/MóduloNfe.jpg';
import Light from '../assets/Light.jpg';
import CdsDesktop from '../assets/CDSDESKTOP.png';
import CdsSistemasFiltered from '../assets/CdsSistemasFiltered.jpg';
import { Carousel } from '@material-tailwind/react';

const funcoes = [
  {
    id: 1,
    name: 'Treinamentos',
    href: APP_ROUTES.TRAINMENTS,
    imageSrc: Light,
    imageAlt: 'Treinamentos',

  },

  {
    id: 2,
    name: 'Avaliações',
    href: APP_ROUTES.VALUATIONS,
    imageSrc: CdsDesktop,
    imageAlt: 'Avaliações',

  },

  {
    id: 3,
    name: 'Sobre',
    href: APP_ROUTES.ABOUT,
    imageSrc: Otica,
    imageAlt: 'Sobre',

  },
]

const UserHomePage = () => {
  const { user, authenticated } = useUser();

  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  return (
    <>
      <nav className="sticky top-0 z-50"><Navbar /></nav>

      <div
        className="w-full h-auto min-h-screen flex justify-center p-16 bg-gray-300 bg-cover bg-no-repeat bg-center">
        <div className="flex flex-col items-center w-full">
          <div className=" sm:text-5xl pb-10">
            <h1 className="text-5xl text-center font-bold tracking-tight text-gray-900">
              Bem-vindo à Academia CDS, {user.firstname}!
            </h1>
          </div>
          <div className=" sm:text-4xl pb-4 w-2/3 text-center pb-8">
            <h1 className="text-3xl font-normal tracking-tight text-gray-700">
              Aqui você pode aprender tudo sobre o sistema CDS.
            </h1>
          </div>
        </div>
      </div>


<div className="flex justify-center items-center w-full pt-16">
  <h1>Ambiente Web</h1>
</div>

        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Retaguarda</h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {funcoes.map((product) => (
                <div key={product.id} className="group relative">
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <a href={product.href}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

    </>
  );
}
export default UserHomePage;