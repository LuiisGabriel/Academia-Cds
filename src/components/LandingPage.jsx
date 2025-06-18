import { APP_ROUTES } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VisitNavbar from './VisitNavBar';
import { Carousel, Typography, Button } from '@material-tailwind/react';
import Logo from '../assets/LOGO.png'
import FrenteDeLoja from '../assets/FrenteDeLoja.jpg';
import Retaguarda from '../assets/Retaguarda.jpg';
import Otica from '../assets/Ótica.jpg';
import Fabrica from '../assets/Fabrica.jpg';
import PetShop from '../assets/PetShop.jpg';
import Light from '../assets/Light.jpg';
import LandingImage from '../assets/image.jpg';
import CDSDESKTOP from '../assets/CDSDESKTOP.png';
import Facebook from '../assets/facebook.svg';
import Instagram from '../assets/instagram.svg';
import Linkedin from '../assets/linkedin.svg';
import Youtube from '../assets/youtube.svg';

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
    titulo: 'Retaguarda',
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
  const [opacityValue, setopacityValue] = useState("100");

  const listenScrollEvent = () => {
    window.scrollY > 370 ? setnavColor("#1e2939") : setnavColor("transparent");
    window.scrollY < 370 ? setopacityValue("100") : setopacityValue("0");
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
      <nav className="sticky top-0 z-5 bg-gray-800"
        style={{
          backgroundColor: navColor,
          transition: "all 1s"
        }}>
        <VisitNavbar />
      </nav>

      <div className='flex items-center justify-center select-none'>
        <div
          style={{ '--image-url': `url(${LandingImage})` }}
          className="fixed h-auto h-screen w-screen top-0  flex flex-col items-center justify-center bg-[image:var(--image-url)] bg-cover bg-no-repeat bg-center">
          <div
            style={{
              '--opacity-value': `${opacityValue}`,
              transition: "all 1s"
            }}
            className="w-full h-full text-center flex flex-col justify-center items-center opacity-[opacity:var(--opacity-value)] bg-cover bg-no-repeat bg-center backdrop-brightness-30">
            <h2 className="text-6xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
              Bem vindo ao CDS Academy.
            </h2>
            <p className="mt-6 text-lg/8 text-pretty text-white">
              Neste ambiente você vai encontrar tudo oque precisa para utilizar o sistema CDS.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 ">
              <a
                href={APP_ROUTES.SIGN_UP}
                className="transition-all duration-300 ease-in-out rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white "
              >
                Comece
              </a>
              <a href={APP_ROUTES.ABOUT} className="transition-all duration-300 ease-in-out text-sm/6 font-bold text-white hover:scale-105">
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
                        <Button size="lg" color="white" className='hover:scale-102 transition-all duration-300 ease-in-out' onClick={handleHref1Click(imagem.href1)}>
                          Descubra
                        </Button>
                        <Button size="lg" color="white" variant="text" className='transition-all duration-300 ease-in-out' onClick={handleHref2Click(imagem.href2)}>
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

            <div className=' transition-all duration-300 ease-in-out w-2/4 hover:w-3/5 flex justify-center items-center'>
              <img src={CDSDESKTOP} />
            </div>

            <div className='rounded-l-[10vw] bg-gray-800 transition-all duration-300 ease-in-out w-2/4 hover:w-3/5 h-full flex flex-col items-center justify-center shadow-lg/30'>
              <h1 className='text-4xl font-bold text-center text-white'>Ambiente Web</h1>
            </div>

          </div>

          <div className='h-100 bg-gray-300 py-16 flex pointer-events-auto'>

            <div className='rounded-r-[10vw] bg-gray-800 transition-all duration-300 ease-in-out w-2/4  hover:w-3/5 h-full flex flex-col items-center justify-center shadow-lg/30'>
              <h1 className='text-4xl font-bold text-center text-white'>Ambiente Desktop</h1>
            </div>

            <div className='transition-all duration-300 ease-in-out w-2/4  hover:w-3/5 flex justify-center items-center'>
              <img src={CDSDESKTOP} />
            </div>

          </div>

          <div className='bg-black/70 py-16 px-16 pointer-events-auto'>

            <div className="flex justify-center items-center pb-16">
              <h1 className='text-white text-4xl font-bold text-center'>Conheça mais sobre alguns dos treinamentos disponiveis!</h1>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ">
              {imagens.map((imagem) => (
                <div
                  key={imagem.id}
                  href={imagem.href1}
                  className="bg-gray-300 transition-all duration-300 ease-in-out bg-cover bg-no-repeat bg-center aspect-square w-full rounded-lg xl:aspect-7/8 items-center  flex flex-col text-gray-800"
                >

                  <img
                    src={imagem.Src}
                    className='rounded-t-lg'
                  />

                  <h1 className='p-8 text-2xl'>{imagem.titulo}</h1>
                  <h1 className='px-4'>{imagem.descricao}</h1>
                  <div className='py-6'>
                    <a
                      href={imagem.href1}
                      className='px-4 py-2 bg-gray-800 rounded-full text-gray-300 items-center justify-center flex text-md hover:scale-102 shadow-sm/40 transition-all duration-150 ease-in-out '>
                      Saiba mais
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-gray-800 flex flex-col items-center justify-center pointer-events-auto px-4 pb-16'>
            <div className='size-20 py-6 hover:scale-105 transition-all duration-150 ease-in-out'>
              <a href='https://cdssistemas.com/'>
                <img src={Logo} />
              </a>
            </div>
            <div className=" h-full flex pointer-events-auto justify-center text-white gap-4 sm:gap-8 py-6">
              <a className='hover:scale-105 transition-all duration-150 ease-in-out' href={APP_ROUTES.ABOUT}>Sobre</a>
              <a className='hover:scale-105 transition-all duration-150 ease-in-out' href=''>dfgdfgd</a>
              <a className='hover:scale-105 transition-all duration-150 ease-in-out' href=''>sdfdsfd</a>
              <a className='hover:scale-105 transition-all duration-150 ease-in-out' href=''>asdasdas</a>
              <a className='hover:scale-105 transition-all duration-150 ease-in-out' href=''>asdasdsa</a>
            </div>

            <div className=" h-full flex pointer-events-auto justify-center items-center text-white gap-10 pt-4 ">
              <a href='https://www.facebook.com/cdssistemas/'>
                <img src={Facebook} className='size-8 hover:scale-105 transition-all duration-150 ease-in-out' />
              </a>
              <a href='https://www.instagram.com/cdssistemas/'>
                <img src={Instagram} className='size-8 hover:scale-105 transition-all duration-150 ease-in-out' />
              </a>
              <a href='https://pt.linkedin.com/company/cds-consusltoria-e-desenvolvimento-de-sistemas'>
                <img src={Linkedin} className='size-8 hover:scale-105 transition-all duration-150 ease-in-out' />
              </a>
              <a href='https://www.youtube.com/channel/UCgRD73BibhKdP4H0bZNjEsQ'>
                <img src={Youtube} className='size-8 hover:scale-105 transition-all duration-150 ease-in-out' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default LandingPage;