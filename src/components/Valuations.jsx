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
    if (!ambiente && !modulo && !subModulo && !searchTitle) {
      setFilteredValuations(valuations);
    } else {
      const filterValuations = valuations.filter(
        (valuation) =>
          (!searchTitle || valuation.titulo.toLowerCase().includes(searchTitle.toLowerCase())) &&
          (!ambiente || valuation.ambiente === ambiente) &&
          (!modulo || valuation.modulo === modulo) &&
          (!subModulo || valuation.subModulo === subModulo)
      );
      setFilteredValuations(filterValuations);
    }
  }, [ambiente, modulo, subModulo, valuations, searchTitle]);

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
          <div className='flex flex-col justify-center items-center w-full py-28'>
            <div className=' w-3/4 flex items-center justify-between mb-8 rounded-full outline-3 outline-white shadow-lg'>
              <div className='flex items-center justify-between w-full'>
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
                      className='hover:scale-105 font-semibold cursor-pointer'>
                      X
                    </h1>
                  </div>
                )}
              </div>

              <div className='p-2 px-4 w-3/4 gap-2 rounded-full flex items-center justify-center bg-white'>
                <select
                  type="text"
                  onChange={(e) => { setAmbiente(e.target.value); }}
                  value={ambiente}
                  required
                  className="w-1/4 text-center cursor-pointer">
                  <option disabled={true} value="">Ambiente</option>
                  {filtros.filter(filtro => filtro.tipo === 'ambiente').map((ambiente) => (
                    <option
                      key={ambiente.id}
                      value={ambiente.titulo}>
                      {ambiente.titulo}
                    </option>
                  ))}
                </select>

                <select
                  type="text"
                  onChange={(e) => { setModulo(e.target.value); }}
                  value={modulo}
                  required
                  className="w-1/4 text-center cursor-pointer">
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
                  onChange={(e) => { setSubModulo(e.target.value); }}
                  value={subModulo}
                  required
                  className="w-1/4 text-center cursor-pointer">
                  <option disabled={true} value="">Sub-modulo</option>
                  {filtros.filter(filtro => filtro.tipo === 'submodulo').map((subModulo) => (
                    <option
                      key={subModulo.id}
                      value={subModulo.titulo}>
                      {subModulo.titulo}
                    </option>
                  ))}
                </select>

                <div className='w-1/4 flex items-center justify-center'>
                  <h1
                    className='hover:scale-105 text-red-500 transition-all duration-300 ease-in-out cursor-pointer'
                    onClick={() => {
                      setAmbiente('');
                      setModulo('');
                      setSubModulo('');
                    }}
                  >
                    Limpar
                  </h1>
                </div>
              </div>
            </div>

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
