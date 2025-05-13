import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES } from '../utils/constants';
import Navbar from './Navbar';
import { useAmbientes, useModulos, useSubModulos, useUser } from '../lib/customHooks';
import getVideoId from 'get-video-id';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const CreateVideo = () => {

  const { user, authenticated } = useUser();

  const modulos = useModulos();
  const subModulos = useSubModulos();
  const ambientes = useAmbientes();

  const [titulo, setTitulo] = useState('');
  const [ambiente, setAmbiente] = useState('');
  const [modulo, setModulo] = useState('');
  const [url, setUrl] = useState('');
  const [subModulo, setSubModulo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSetTitle, setIsSetTitle] = useState(false);

  if (!user || !authenticated || user.role !== 'ADMIN') {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  const createVideo = async () => {
    event.preventDefault();

    const { id: videoId } = getVideoId(url);

    if (!videoId) {
      alert('URL inválida. Por favor, insira um link válido do YouTube.');
      return;
    }

    try {
      setIsLoading(true);

      const youtubeResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: 'snippet',
            id: videoId,
            key: YOUTUBE_API_KEY,
          },
        }
      );

      if (!youtubeResponse?.data?.items?.length) {
        alert('Não foi possível obter os detalhes do vídeo. Verifique o link.');
        return;
      }

      const videoDetails = youtubeResponse.data.items[0].snippet;
      const videoTitle = videoDetails.title;
      const videoDescription = videoDetails.description;

      const response = await axios({
        method: 'POST',
        url: API_ROUTES.CREATE_VIDEO,
        data: {
          titulo: !isSetTitle ? videoTitle : titulo,
          descricao: videoDescription,
          ambiente,
          modulo,
          url,
          videoId: videoId,
          subModulo,
        },
      });

      if (!response?.data) {
        console.log('Algo deu errado durante o cadastro: ', response);
        return;
      } else {
        alert('Vídeo cadastrado com sucesso');
      }
    } catch (err) {
      console.log('Ocorreu algum erro no cadastro: ', err);
    } finally {
      setTitulo('');
      setAmbiente('');
      setModulo('');
      setSubModulo('');
      setUrl('');
      setIsSetTitle(false);
      setIsLoading(false);
    }
  };

  return (
    <>

      <div className="w-full h-auto min-h-screen bg-gray-300">
        <nav className="sticky top-0 z-50"><Navbar /></nav>
        <div className='flex flex-col justify-center items-center py-16'>
          <div className=" w-3/4 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col">
            <h2 className="text-center font-medium text-2xl mb-8">
              Cadastre um vídeo
            </h2>
            <form className="flex flex-1 flex-col justify-evenly gap-8">
              <div className="flex flex-col justify-center items-center gap-2 w-full">
                <div className='flex items-center gap-4'>
                  <h1>
                    Eu quero escrever o título
                  </h1>
                  <input
                    className='rounded-full size-3'
                    type='checkbox'
                    checked={isSetTitle}
                    onChange={(e) => setIsSetTitle(e.target.checked)}
                  />
                </div>
                {isSetTitle && (
                  <input
                    className="border-2 outline-none p-2 rounded-md w-full"
                    type="text"
                    placeholder="titulo"
                    value={titulo}
                    required
                    onChange={(e) => { setTitulo(e.target.value); }}
                  />
                )}
              </div>
              <select
                type="text"
                onChange={(e) => { setAmbiente(e.target.value); }}
                value={ambiente}
                className="border-2 outline-none p-2 rounded-md"
              >
                <option disabled={true} value="">Escolha um ambiente</option>
                {ambientes.map((ambiente) => (
                  <option
                    key={ambiente.nome}
                    value={ambiente.nome}
                  >
                    {ambiente.nome}
                  </option>
                ))}
              </select>
              <select
                type="text"
                onChange={(e) => { setModulo(e.target.value); }}
                value={modulo}
                className="border-2 outline-none p-2 rounded-md"
              >
                <option disabled={true} value="">Escolha um módulo</option>
                {modulos.map((modulo) => (
                  <option
                    key={modulo.nome}
                    value={modulo.nome}
                  >
                    {modulo.nome}
                  </option>
                ))}
              </select>
              <select
                type="text"
                onChange={(e) => { setSubModulo(e.target.value); }}
                value={subModulo}
                className="border-2 outline-none p-2 rounded-md"
              >
                <option disabled={true} value="">Escolha um sub-módulo</option>
                {subModulos.map((subModulo) => (
                  <option
                    key={subModulo.nome}
                    value={subModulo.nome}
                  >
                    {subModulo.nome}
                  </option>
                ))}
              </select>
              <input
                className="border-2 outline-none p-2 rounded-md"
                type="text"
                placeholder="Url"
                value={url}
                required
                onChange={(e) => { setUrl(e.target.value); }}
              />

              <button
                className="flex justify-center p-2 rounded-md w-1/2 self-center bg-gray-800 text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                onClick={createVideo}
              >
                {
                  isLoading ?
                    <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : null
                }
                <span>
                  Cadastrar
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateVideo;
