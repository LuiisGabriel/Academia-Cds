import React from 'react';
import { APP_ROUTES } from '../utils/constants';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VisitNavbar from './VisitNavBar';
import { Carousel, Typography, Button } from '@material-tailwind/react';
import Logo from '../assets/LOGO.png'
import FrenteDeLoja from '../assets/FrenteDeLoja.jpg';
import Retaguarda from '../assets/Retaguarda.jpg';
import Otica from '../assets/Ótica.jpg';
import Fabrica from '../assets/Fabrica.jpg';
import PetShop from '../assets/PetShop.jpg';
import Nfe from '../assets/MóduloNfe.jpg';
import Light from '../assets/Light.jpg';
import LandingImage from '../assets/image.jpg';
import CDSDESKTOP from '../assets/CDSDESKTOP.png';
import GitHubWhite from '../assets/github-mark-white.png';

const imagens = [
  {
    id: 1,
    Src: FrenteDeLoja,
    Alt: 'FrenteDeLoja',
    titulo: 'Frente de loja',
    descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    href1: APP_ROUTES.CDSWEB,
    href2: APP_ROUTES.CDSDESKTOP,

  },
  {
    id: 2,
    Src: Retaguarda,
    Alt: 'Retaguarda',
    titulo: 'Frente de loja',
    descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    href1: APP_ROUTES.CDSWEB,
    href2: APP_ROUTES.CDSDESKTOP,

  },
  {
    id: 3,
    Src: PetShop,
    Alt: 'PetShop',
    titulo: 'PetShop',
    descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    href1: APP_ROUTES.CDSWEB,
    href2: APP_ROUTES.CDSDESKTOP,

  },
  {
    id: 4,
    Src: Light,
    Alt: 'Light',
    titulo: 'Light',
    descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    href1: APP_ROUTES.CDSWEB,
    href2: APP_ROUTES.CDSDESKTOP,

  },
  {
    id: 5,
    Src: Otica,
    Alt: 'Ótica',
    titulo: 'Ótica',
    descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    href1: APP_ROUTES.CDSWEB,
    href2: APP_ROUTES.CDSDESKTOP,

  },
  {
    id: 6,
    Src: Fabrica,
    Alt: 'Fábrica',
    titulo: 'Fábrica',
    descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    href1: APP_ROUTES.CDSWEB,
    href2: APP_ROUTES.CDSDESKTOP,

  },

]

const LandingPage = () => {


  const [navColor, setnavColor] = useState("transparent");
  const [textSize, settextSize] = useState("");
  const listenScrollEvent = () => {
    window.scrollY > 10 ? setnavColor("#1e2939") : setnavColor("transparent");
    window.scrollY > 10 ? settextSize("") : setsettextSize("");
  };
  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);

  const navigate = useNavigate();

  const handleHref1Click = (href1) => () => {
    navigate(href1);
  }

  const handleHref2Click = (href2) => () => {
    navigate(href2);
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gray-800"
        style={{
          backgroundColor: navColor,
          transition: "all 1s"
        }}><VisitNavbar /></nav>

      <div className='flex items-center justify-center'>
        <div
          style={{ '--image-url': `url(${LandingImage})` }}
          className="fixed h-auto h-screen w-screen top-0 py-70 px-16 items-center justify-center bg-[image:var(--image-url)] bg-cover bg-no-repeat bg-center">
          <div className="text-center">
            <h2 className="text-6xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
              Bem vindo ao CDS academy.
            </h2>
            <p className="mt-6 text-lg/8 text-pretty text-white">
              teste teste teste teste teste teste teste teste teste teste teste teste.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 ">
              <a
                href={APP_ROUTES.SIGN_UP}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white "
              >
                Comece
              </a>
              <a href={APP_ROUTES.ABOUT} className="text-sm/6 font-bold text-white hover:scale-105 hover:text-gray-300">
                Sobre nós <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <div className='z-1 w-full pt-50 pointer-events-none'>
          <div className="flex justify-center pt-128">

            <Carousel
              className="w-[57rem] h-150 rounded-t-3xl bg-white/5 pointer-events-auto"
              autoplay={true}
              loop={true}
              transition={{ duration: 1 }}
              autoplayDelay={7000}
              navigation={({ setActiveIndex, activeIndex, length }) => (
                <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                  {new Array(length).fill("").map((_, i) => (
                    <span
                      key={i}
                      className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                        }`}
                      onClick={() => setActiveIndex(i)}
                    />
                  ))}
                </div>
              )}
            >
              {imagens.map((imagem) => (
                <div className="relative h-full w-full">
                  <img
                    src={imagem.Src}
                    alt="image 1"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
                    <div className="w-3/4 text-center md:w-2/4">
                      <Typography
                        variant="h1"
                        color="white"
                        className="mb-4 text-3xl md:text-4xl lg:text-5xl"
                      >
                        {imagem.titulo}
                      </Typography>
                      <Typography
                        variant="lead"
                        color="white"
                        className="mb-12 opacity-80 pt-6"
                      >
                        {imagem.descricao}
                      </Typography>
                      <div className="flex justify-center gap-2">
                        <Button size="lg" color="white" className='hover:bg-gray-300 hover:scale-105' onClick={handleHref1Click(imagem.href1)}>
                          Descubra
                        </Button>
                        <Button size="lg" color="white" variant="text" className='hover:scale-105' onClick={handleHref2Click(imagem.href2)}>
                          Sei lá
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          <div className='h-100 w-full py-16 bg-gray-300 flex justify-end pointer-events-auto'>

            <div className=' w-1/2 flex justify-center items-center'>
              <img src={CDSDESKTOP} />
            </div>

            <div className='rounded-l-[10vw] bg-gray-800 transition-all duration-300 ease-in-out w-2/4 hover:w-3/5 h-full flex flex-col items-center justify-center shadow-lg/30'>
              <h1 className='text-4xl font-bold text-center text-gray-300'>Ambiente Web</h1>
            </div>

          </div>

          <div className='h-100 bg-gray-300 py-16 flex pointer-events-auto'>

            <div className='rounded-r-[10vw] bg-gray-800 transition-all duration-300 ease-in-out w-2/4  hover:w-3/5 h-full flex flex-col items-center justify-center shadow-lg/30'>
              <h1 className='text-4xl font-bold text-center text-gray-300'>Ambiente Desktop</h1>
            </div>

            <div className='w-1/2 flex justify-center items-center'>
              <img src={CDSDESKTOP} />
            </div>

          </div>

          <div className='bg-gray-300 h-100 py-16 flex items-center justify-center pointer-events-auto'>

            <h1>Mais conteúdo em breve!</h1>

          </div>

          <div className="bg-gray-800 h-full flex pointer-events-auto justify-start py-16 text-gray-300 font-medium antialised">
            <div className='w-1/4 flex-col flex items-center gap-8'>
              <img src={Logo} className='size-30' />
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
            </div>

            <div className='w-1/4 flex-col flex items-center gap-8'>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
            </div>

            <div className='w-1/4 flex-col flex items-center gap-8'>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
            </div>

            <div className='w-1/4 flex-col flex items-center gap-8'>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
              <h1>asdasdasdsad</h1>
            </div>
          </div>

          <div className=" bg-gray-800 pointer-events-auto flex flex-col items-center justify-center text-gray-300 font-medium antialised">
            <div className="w-1/4 text-center ">
              <h1 className="font-medium text-sm">
                Cds Academy © 2025. Todos os direitos reservados.
              </h1>
            </div>
            <div className='flex items-center justify-center'>
              <h1 className='text-sm'>desenvolvido por:</h1>
              <a className='flex flex-col items-center p-4 gap-1 hover:scale-105 transition-all duration-50 ease-in-out antialised' href='https://github.com/LuiisGabriel' >
                <img src={GitHubWhite} className='size-5'></img>
                <h1 className='text-xs'>Luis Gabriel</h1>
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
export default LandingPage;
