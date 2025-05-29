
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_ROUTES } from '../utils/constants';
import Navbar from './Navbar';
import { useAmbientes, useModulos, useSubModulos, useTreinamentos, useUser } from '../lib/customHooks';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import getVideoId from 'get-video-id';
import lixeira from '../assets/lixeira.svg'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const CreateTrainment = () => {

    const { user, authenticated } = useUser();

    const modulos = useModulos();
    const subModulos = useSubModulos();
    const ambientes = useAmbientes();
    const treinamentos = useTreinamentos();

    const [titulo, setTitulo] = useState('');
    const [ambiente, setAmbiente] = useState('');
    const [modulo, setModulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [subModulo, setSubModulo] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isSetVideoTitle, setIsSetVideoTitle] = useState(false);
    const [videos, setVideos] = useState([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        if (!isSetVideoTitle) {
            setVideoTitle('');
        }
    }, [isSetVideoTitle]);

    useEffect(() => {
        if (
            titulo ||
            descricao ||
            ambiente ||
            modulo ||
            subModulo ||
            videos.length ||
            videoUrl ||
            videoTitle
        ) {
            setDirty(true);
        } else {
            setDirty(false);
        }
    }, [
        titulo,
        descricao,
        ambiente,
        modulo,
        subModulo,
        videos,
        videoUrl,
        videoTitle
    ])

    if (!user || !authenticated || user.role !== 'ADMIN') {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    window.onbeforeunload = function () {
        return dirty ? "" : null;
    };

    const createTrainment = async () => {
        event.preventDefault();
        try {
            if (!titulo || !descricao || !ambiente || !modulo || !subModulo) {
                alert('Preencha todos os campos!');
                return;
            } else if (treinamentos.filter(treinamento => treinamento.titulo === titulo).map((treinamento) => (treinamento.titulo)).length > 0) {
                alert('Uma avaliação com este titulo já foi cadastrada anteriormente');
                return;
            } else if (videos.length < 1) {
                alert('Cadastre pelo menos um vídeo');
                return;
            }
            setIsLoading(true);
            const response = await axios({
                method: 'POST',
                url: API_ROUTES.CREATE_TRAINMENT,
                data: {
                    titulo,
                    descricao,
                    ambiente,
                    modulo,
                    subModulo,
                    videos
                }
            });
            if (response?.data) {
                setTitulo('');
                setAmbiente('');
                setModulo('');
                setSubModulo('');
                setDescricao('');
                setVideos([]);
                setIsLoading(false);
                alert('Treinamento salvo com sucesso!');
            } else {
                console.log('Algo deu errado durante o salvamento: ', response);
                return;
            }
        }
        catch (err) {
            console.log('Ocorreu algum erro no cadastro: ', err);
        } finally {
            setIsLoading(false);
        }
    };

    const createAndPublishTrainment = async () => {
        event.preventDefault();
        try {
            if (!titulo || !descricao || !ambiente || !modulo || !subModulo) {
                alert('Preencha todos os campos!');
                return;
            } else if (treinamentos.filter(treinamento => treinamento.titulo === titulo).map((treinamento) => (treinamento.titulo)).length > 0) {
                alert('Uma avaliação com este titulo já foi cadastrada anteriormente');
                return;
            } else if (videos.length < 1) {
                alert('Cadastre pelo menos um vídeo');
                return;
            }
            setIsLoading(true);
            const createResponse = await axios({
                method: 'POST',
                url: API_ROUTES.CREATE_TRAINMENT,
                data: {
                    titulo,
                    descricao,
                    ambiente,
                    modulo,
                    subModulo,
                    videos
                }
            });
            const publishResponse = await axios.post(API_ROUTES.PUBLISH_TRAINMENT, {
                titulo,
            });

            if (!createResponse?.data) {
                alert('Algo deu errado durante o cadastro!')
                console.log('Algo deu errado durante o cadastro: ', response);
                return;
            } else if (!publishResponse?.data) {
                alert('Algo deu errado durante a publicação!')
                console.log('Algo deu errado durante a publicação: ', response);
                return;
            }

            else {
                setTitulo('');
                setAmbiente('');
                setModulo('');
                setSubModulo('');
                setDescricao('');
                setVideos([]);
                setDirty(false);
                alert('Treinamento cadastrado com sucesso!');
            }
        }
        catch (err) {
            console.log('Ocorreu algum erro no cadastro: ', err);
        } finally {
            setIsLoading(false);
        }
    };

    const removeVideo = (index) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
    };

    const addVideo = async () => {
        event.preventDefault();

        const { id: videoId } = getVideoId(videoUrl);

        if (!videoId) {
            console.log(videoId)
            alert('URL inválida. Por favor, insira um link válido do YouTube.');
            return;
        }

        try {
            if (isSetVideoTitle && !videoTitle) {
                alert('Você optou por escolher um titulo para o video. Preencha o campo de titulo!')
                return;
            }

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
            const ytVideoTitle = videoDetails.title;
            const videoDescription = videoDetails.description;

            if (videos.some(video => video.videoId === videoId)) {
                alert('Este vídeo já foi adicionado.');
                return;
            }

            setVideos(prev => ([
                ...prev,
                { titulo: !isSetVideoTitle ? ytVideoTitle : videoTitle, description: videoDescription, url: videoUrl, videoId: videoId }
            ]));

            setVideoTitle('');
            setVideoUrl('');
            setIsSetVideoTitle(false);

            setOpen(false);

        } catch (err) {
            console.log('Ocorreu algum erro no cadastro: ', err);
        }
    }

    const increaseIndex = (index, video) => {
        setVideos(prev => {
            if (index >= prev.length - 1) return prev;
            const newArr = [...prev];

            newArr.splice(index, 1);

            newArr.splice(index + 1, 0, video);
            return newArr;
        });
    }

    const decreaseIndex = (index, video) => {
        setVideos(prev => {
            if (index >= prev.length + 1) return prev;
            const newArr = [...prev];

            newArr.splice(index, 1);

            newArr.splice(index - 1, 0, video);
            return newArr;
        });
    }

    return (
        <>

            <div className="w-full min-h-screen h-full bg-gray-300">
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='flex justify-center items-center py-16'>

                    <Dialog open={open} onClose={() => {
                        setOpen(false);
                    }}
                        className="relative z-10 select-none">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 h-full bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto pt-16">
                            <div className="flex min-h-screen justify-center text-center items-center">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white p-8 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 w-5/6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >

                                    <div className='flex flex-col justify-center items-center w-full gap-8'>
                                        <div className='flex flex-col justify-center items-center w-full gap-8'>
                                            <div className="flex flex-col justify-center items-center gap-2 w-full">
                                                <div className='flex items-center justify-start gap-2 w-full'>
                                                    <h1>
                                                        Eu quero escrever o título
                                                    </h1>
                                                    <input
                                                        className='rounded-full size-3'
                                                        type='checkbox'
                                                        checked={isSetVideoTitle}
                                                        onChange={(e) => setIsSetVideoTitle(e.target.checked)}
                                                    />
                                                </div>
                                                {isSetVideoTitle && (
                                                    <input
                                                        className="border-2 outline-none p-2 rounded-md w-full"
                                                        type="text"
                                                        placeholder="Titulo"
                                                        value={videoTitle}
                                                        required
                                                        onChange={(e) => { setVideoTitle(e.target.value); }}
                                                    />
                                                )}
                                            </div>

                                            <div className='w-full md:flex justify-start items-center gap-8'>
                                                <input
                                                    className="border-2 outline-none p-2 rounded-md w-full"
                                                    type="text"
                                                    placeholder="Url"
                                                    value={videoUrl}
                                                    required
                                                    onChange={(e) => { setVideoUrl(e.target.value); }}
                                                />
                                            </div>

                                            <div className='w-full flex flex-col items-center justify-center gap-8'>
                                                <button
                                                    className="flex justify-center p-2 rounded-md w-1/2 self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                                    onClick={() => {
                                                        addVideo();
                                                    }}
                                                >
                                                    <span>
                                                        Inserir video
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>

                    <div className=" w-5/6 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col select-none">
                        <h2 className="text-center font-medium text-2xl mb-8">
                            Cadastre um treinamento
                        </h2>
                        <form className="flex flex-1 flex-col justify-center gap-8">
                            <input
                                className="border-2 outline-none p-2 rounded-md"
                                type="text"
                                placeholder="Titulo"
                                value={titulo}
                                required
                                onChange={(e) => { setTitulo(e.target.value); }}
                            />
                            <input
                                className="border-2 outline-none p-2 rounded-md"
                                type="text"
                                placeholder="Descrição"
                                value={descricao}
                                required
                                onChange={(e) => { setDescricao(e.target.value); }}
                            />
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
                            <div className='flex flex-col items-center justify-center w-full'>
                                {videos.length > 0 ? (
                                    <div className='w-full'>
                                        <div className='flex items-center justify-start w-full pb-4'>
                                            <h1>
                                                Videos adicionados:
                                            </h1>
                                        </div>
                                        <div className='space-y-8 w-full'>
                                            {videos.map((video, index) => (
                                                <div className='flex items-center justify-center gap-2 w-full' key={video.videoId}>
                                                    <div className='bg-gray-300 p-4 w-full rounded-lg flex items-center justify-between gap-4'>
                                                        <h1>{video.titulo}</h1>
                                                        <div className='flex items-center justify-center gap-8'>
                                                            <img
                                                                className='size-5 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer'
                                                                onClick={() => removeVideo(index)}
                                                                src={lixeira} />

                                                            <div className=''>
                                                                <h1
                                                                    style={{
                                                                        color: index === 0 ? 'gray' : 'black',
                                                                        pointerEvents: index === 0 ? 'none' : 'auto',
                                                                    }}
                                                                    className='hover:scale-115 transition-all duration-300 ease-in-out'
                                                                    onClick={() => decreaseIndex(index, video)}
                                                                >
                                                                    ^
                                                                </h1>
                                                                <h1
                                                                    style={{
                                                                        color: index === videos.length - 1 ? 'gray' : 'black',
                                                                        pointerEvents: index === videos.length - 1 ? 'none' : 'auto',
                                                                    }}
                                                                    className='hover:scale-115 rotate-180 transition-all duration-100 ease-in-out'
                                                                    onClick={() => increaseIndex(index, video)}
                                                                >
                                                                    ^
                                                                </h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : 'As informações dos videos adicionados aparecerão aqui.'}
                            </div>

                            <div className='w-full flex justify-center items-center'>
                                <div
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                    className='rounded-full bg-gray-300 size-10 flex items-center justify-center cursor-pointer select-none shadow-lg/30 hover:scale-105 hover:shadow-lg/50 transition-all duration-300 ease-in-out'>
                                    <h1 className='text-2xl '>
                                        +
                                    </h1>
                                </div>
                            </div>

                            <div className='w-full flex items-center justify-between'>
                                <button
                                    className="flex justify-center p-2 rounded-md w-1/3 self-center bg-gray-800 text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out "
                                    onClick={createAndPublishTrainment}
                                >
                                    {
                                        isLoading ?
                                            <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : <span> Cadastrar e publicar </span>
                                    }

                                </button>

                                <button
                                    className="flex justify-center p-2 rounded-md w-1/3 self-center bg-gray-800 text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out "
                                    onClick={createTrainment}
                                >
                                    {
                                        isLoading ?
                                            <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : <span> Salvar </span>
                                    }

                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateTrainment;