import { useEffect } from 'react';
import Navbar from './Navbar';
import { APP_ROUTES } from '../utils/constants';
import { useAvaliacoes, useTreinamentos, useUser } from '../lib/customHooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Valuations = () => {

  const { user, authenticated } = useUser();
  const navigate = useNavigate();

  const valuations = useAvaliacoes();
  const treinamentos = useTreinamentos();

  const [modulo, setModulo] = useState('');
  const [subModulo, setSubModulo] = useState('');
  const [ambiente, setAmbiente] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [filters, setFilters] = useState([]);

  const userWatchedVideos = user?.watchedVideos?.map((video) => video.videoId);

  const [filteredValuations, setFilteredValuations] = useState(valuations);

  const avaliableValuations = filteredValuations.filter((valuation) => {
    const hasAnswered = user?.answeredValuations?.some(
      (answered) => answered.valuationId === valuation.id
    );
    const concluedTrainments = getConcluedTrainments(userWatchedVideos || []);
    const hasWatchedAllVideos = concluedTrainments.some((trainment) => {
      return trainment.ambiente === valuation.ambiente &&
        trainment.modulo === valuation.modulo &&
        trainment.subModulo === valuation.subModulo
    })
    const isPublished = valuation.documentInStages.length > 0;
    return !hasAnswered && isPublished && hasWatchedAllVideos;
  })

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
    let filtered = valuations.filter(valuation => valuation.documentInStages.length > 0);
    if (searchTitle) {
      filtered = filtered.filter(valuation =>
        valuation.titulo.toLowerCase().includes(searchTitle.toLowerCase()));
    }
    if (filters.length > 0) {
      filtered = filtered.filter(valuation =>
        filters.every(filter =>
          [valuation.ambiente, valuation.modulo, valuation.subModulo].includes(filter)
        ));
    }
    setFilteredValuations(filtered);
  }, [filters, searchTitle, valuations]);

  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  function getConcluedTrainments(userWatchedVideos) {
    return treinamentos.filter((treinamento) => {
      const videoIds = (treinamento.videos || []).map(video => video.videoId);
      const hasWatchedAllVideos = videoIds.length > 0 && videoIds.every(videoId =>
        userWatchedVideos?.includes(videoId)
      );
      return hasWatchedAllVideos;
    })
  }

  const handleValuationClick = (ambiente, modulo, subModulo, valuationTitle, valuationDescription, valuationId, valuationQuestions) => {
    navigate(APP_ROUTES.VALUATION, {
      state: {
        ambiente: ambiente,
        modulo: modulo,
        subModulo: subModulo,
        valuationId: valuationId,
        valuationTitle: valuationTitle,
        valuationDescription: valuationDescription,
        valuationQuestions: valuationQuestions
      },
    });
  };

  return (
    <>
      <div className="bg-gray-300 h-auto min-h-screen">
        <nav className="sticky top-0 z-5"><Navbar /></nav>
        <div className='flex flex-col justify-center items-center w-full select-none'>
          <div className='flex flex-col justify-center items-center w-full pt-20'>
            <div className=' w-3/4 flex items-center justify-between mb-8 rounded-full outline-3 outline-white shadow-lg'>

              <div className='flex w-1/2 items-center justify-between'>
                <input
                  className='rounded-l-lg w-full focus:outline-none p-2 px-4'
                  placeholder='Pesquisar'
                  value={searchTitle}
                  onChange={(e) => { setSearchTitle(e.target.value); }} />
                {searchTitle && (
                  <div className='pr-4'>
                    <h1
                      onClick={() => {
                        setSearchTitle('');
                      }}
                      className='hover:scale-115 cursor-pointer transition-all duration-300 ease-in-out'>
                      X
                    </h1>
                  </div>
                )}
              </div>

              <div className='p-2 px-4 w-1/2 gap-2 rounded-full flex items-center justify-center bg-white'>

                <select
                  type="text"
                  onChange={(e) => {
                    if (filters.includes(e.target.value)) {
                      return;
                    } else {
                      setFilters(prev => ([
                        ...prev,
                        e.target.value
                      ]));
                    }
                  }}
                  required
                  value={ambiente}
                  className="w-1/3 text-center cursor-pointer focus:outline-none">
                  <option disabled={true} value="">Ambiente</option>
                  {filtros.filter(filtro => filtro.tipo === 'ambiente').map((ambiente) => (
                    <option
                      key={ambiente.id}
                      value={ambiente.titulo} >
                      {ambiente.titulo}
                    </option>
                  ))}
                </select>

                <select
                  type="text"
                  onChange={(e) => {
                    if (filters.includes(e.target.value)) {
                      return;
                    } else {
                      setFilters(prev => ([
                        ...prev,
                        e.target.value
                      ]));
                    }
                  }}
                  value={modulo}
                  required
                  className="w-1/3 text-center cursor-pointer focus:outline-none">
                  <option disabled={true} value="">Modulo</option>
                  {filtros.filter(filtro => filtro.tipo === 'modulo').map((modulo) => (
                    <option
                      key={modulo.id}
                      value={modulo.titulo}>
                      {modulo.titulo}
                    </option>
                  ))}
                </select>

                <select
                  type="text"
                  onChange={(e) => {
                    if (filters.includes(e.target.value)) {
                      return;
                    } else {
                      setFilters(prev => ([
                        ...prev,
                        e.target.value
                      ]));
                    }
                  }}
                  required
                  value={subModulo}
                  className="w-1/3 text-center cursor-pointer focus:outline-none">
                  <option disabled={true} value="">Sub-modulo</option>
                  {filtros.filter(filtro => filtro.tipo === 'submodulo').map((subModulo) => (
                    <option
                      key={subModulo.id}
                      value={subModulo.titulo}>
                      {subModulo.titulo}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {filters.length > 0 && (
              <div className='flex flex-wrap items-center justify-center gap-4 w-3/4'>
                {filters.map((filter, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-white shadow-lg'>
                    <h1>
                      {filter}
                    </h1>

                    <h1
                      onClick={() => {
                        setFilters(prev => prev.filter((_, i) => i !== index));
                      }}
                      className='hover:scale-105 transition-all duration-300 ease-in-out font-semibold cursor-pointer'
                    >
                      x
                    </h1>
                  </div>
                ))}
                <div className='w-1/4 flex items-center justify-center'>
                  <h1
                    className='hover:scale-105 text-red-500 transition-all duration-300 ease-in-out cursor-pointer'
                    onClick={() => {
                      setFilters([])
                    }}>
                    Limpar
                  </h1>
                </div>
              </div>
            )}

            {avaliableValuations.length > 0 ? (
              <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 md:grid-cols-4 xl:gap-x-4 py-8 px-8'>
                {avaliableValuations.map((valuation) => (
                  <div
                    key={valuation.titulo}
                    className="group flex flex-col items-center justify-center"
                    onClick={() => {
                      handleValuationClick(
                        valuation.ambiente,
                        valuation.modulo,
                        valuation.subModulo,
                        valuation.titulo,
                        valuation.descricao,
                        valuation.id,
                        valuation.valuationQuestions
                      );
                    }}>
                    <div className="bg-white h-full flex flex-col justify-between rounded-lg pb-8 group-hover:scale-102 transition-all duration-300 ease-in-out shadow-lg/30 cursor-pointer">
                      <img
                        alt={valuation.imageAlt}
                        src={valuation.imageSrc}
                        className="aspect-square w-full rounded-t-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8" />
                      <h1 className="text-center p-4 text-semibold">{valuation.titulo}</h1>
                      <h1 className="text-sm px-6">{valuation.descricao}</h1>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-8'>
                <h1 className='text-lg font-semibold'>
                  Nenhuma avaliação encontrada
                </h1>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
export default Valuations;