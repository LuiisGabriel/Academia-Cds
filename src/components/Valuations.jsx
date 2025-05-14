import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { APP_ROUTES } from '../utils/constants';
import CDSWEB from '../assets/CDSWEB.png';
import CDSDESKTOP from '../assets/CDSDESKTOP.png';
import { useAvaliacoes, useUser, useVideos } from '../lib/customHooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Valuations = () => {

  const { user, authenticated } = useUser();
  const valuations = useAvaliacoes();

  const navigate = useNavigate();

  const [modulo, setModulo] = useState();
  const [subModulo, setSubModulo] = useState();
  const [ambiente, setAmbiente] = useState();

  const videos = useVideos();


  const [filteredValuations, setFilteredValuations] = useState(valuations);

  const filterColor = '#1f2937';
  const filterHoverColor = '#374151';

  const filtros = [
    { id: 0, titulo: 'Limpar', tipo: 'limpar' },
    ...Array.from(new Set(valuations.map((t) => t.ambiente)))
      .filter(Boolean)
      .map((ambiente, index) => ({ id: index + 1, titulo: ambiente, tipo: 'ambiente' })),
    ...Array.from(new Set(valuations.map((t) => t.modulo)))
      .filter(Boolean)
      .map((modulo, index) => ({ id: index + 100, titulo: modulo, tipo: 'modulo' })),
    ...Array.from(new Set(valuations.map((t) => t.subModulo)))
      .filter(Boolean)
      .map((subModulo, index) => ({ id: index + 200, titulo: subModulo, tipo: 'submodulo' })),
  ];

  useEffect(() => {
    if (!ambiente && !modulo && !subModulo) {
      setFilteredValuations(valuations);
    } else {
      const filterValuations = valuations.filter(
        (valuation) =>
          (!ambiente || valuation.ambiente === ambiente) &&
          (!modulo || valuation.modulo === modulo) &&
          (!subModulo || valuation.subModulo === subModulo)
      );
      setFilteredValuations(filterValuations);
    }
  }, [ambiente, modulo, subModulo, valuations]);

  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  const handleValuationClick = (ambiente, modulo, subModulo, valuationTitle, valuationDescription, valuationId) => {

    const userWatchedVideos = user?.watchedVideos?.map((video) => video.id) || [];

    const relatedVideos = videos.filter(
      (video) =>
        (!ambiente || video.ambiente === ambiente) &&
        (!modulo || video.modulo === modulo) &&
        (!subModulo || video.subModulo === subModulo)
    ).map((video) => video.id);

    const hasWatchedAll = relatedVideos.every((videoId) => userWatchedVideos.includes(videoId));

    const hasAnswered = user?.answeredValuations?.some((valuation) => valuation.valuationId === valuationId);

    if (hasAnswered) {
      alert("Você já respondeu essa avaliação");
      return;
    }

    if (!hasWatchedAll || relatedVideos.length === 0) {
      alert('Você precisa assistir a todos os vídeos relacionados antes de realizar esta avaliação.');
      return;
    }


    navigate(APP_ROUTES.VALUATION, {
      state: {
        ambiente: ambiente,
        modulo: modulo,
        subModulo: subModulo,
        valuationId: valuationId,
        valuationTitle: valuationTitle,
        valuationDescription: valuationDescription,
      }
    });
  };

  return (
    <>
      <div className="bg-gray-300 h-auto min-h-screen ">
        <nav className="sticky top-0 z-50"><Navbar /></nav>

        <div className='flex flex-col justify-center items-center w-full select-none'>
          <div className='py-28 flex flex-col justify-center items-center w-full'>

            <div className='flex justify-start items-center w-8/9 max-w-screen overflow-x-auto gap-2 sm:gap-4'>
              {filtros.map((filtro) => {
                const isActive =
                  filtro.titulo === ambiente ||
                  filtro.titulo === modulo ||
                  filtro.titulo === subModulo;
                return (
                  <div
                    onClick={() => {
                      if (filtro.tipo === 'limpar') {
                        setAmbiente('');
                        setModulo('');
                        setSubModulo('');
                      } else if (filtro.tipo === 'ambiente') {
                        setAmbiente((prev) => (prev === filtro.titulo ? '' : filtro.titulo));
                      } else if (filtro.tipo === 'modulo') {
                        setModulo((prev) => (prev === filtro.titulo ? '' : filtro.titulo));
                      } else if (filtro.tipo === 'submodulo') {
                        setSubModulo((prev) => (prev === filtro.titulo ? '' : filtro.titulo));
                      }
                    }}
                    key={filtro.id}
                    style={{
                      '--color': filtro.tipo === 'limpar' ? '#dc2626' : isActive ? '#10b981' : filterColor,
                      '--hoverColor': filtro.tipo === 'limpar' ? '#f87171' : isActive ? '#34d399' : filterHoverColor,
                    }}
                    className="bg-(--color) text-white text-nowrap rounded-lg max-h-10 w-full flex justify-center p-2 cursor-pointer hover:bg-(--hoverColor) transition duration-300 ease-in-out"
                  >
                    <h1>{filtro.titulo}</h1>
                  </div>
                );
              })}
            </div>

            <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-4 xl:gap-x-8 py-8 px-8">
              {filteredValuations.map((valuation) => (
                <div
                  key={valuation.titulo}
                  className="group flex flex-col items-center justify-center"
                  onClick={() => {
                    handleValuationClick(valuation.ambiente, valuation.modulo, valuation.subModulo, valuation.titulo, valuation.descricao, valuation.id);
                  }}
                >
                  <div className='bg-white h-full flex flex-col justify-between rounded-lg pb-8 group-hover:scale-102 transition-all duration-300 ease-in-out shadow-lg/30'>
                    <img
                      alt={valuation.imageAlt}
                      src={valuation.imageSrc}
                      className="aspect-square w-full rounded-t-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                    />
                    <h1 className="text-center p-4 text-semibold">{valuation.titulo} </h1>
                    <h1 className='text-sm px-6'>{valuation.descricao}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Valuations;