import { useState } from 'react';
import { useTreinamentos, useUser } from '../lib/customHooks';
import Navbar from '../components/Navbar';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { API_ROUTES } from '../utils/constants';
import axios from 'axios';
import getVideoId from 'get-video-id';
import pencilEdit from '../assets/pencil-edit.svg'
import lixeira from '../assets/lixeira.svg'
import { DefaultUi, Player, Youtube } from '@vime/react';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const TrainmentReports = () => {
    const { user, authenticated } = useUser();
    const treinamentos = useTreinamentos();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [ambiente, setAmbiente] = useState('');
    const [modulo, setModulo] = useState('');
    const [subModulo, setSubModulo] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoId, setVideoId] = useState('');
    const [isWatchVideo, setIsWatchVideo] = useState(false);
    const [isSetVideoTitle, setIsSetVideoTitle] = useState(false);
    const [videos, setVideos] = useState([]);
    const [stage, setStage] = useState('');
    const [editTrainmentVideos, setEditTrainmentVideos] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const [open, setOpen] = useState(false);
    const [isAddVideos, setIsAddVideos] = useState(false);
    const [dirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!user || !authenticated || user.role !== 'ADMIN') {
        return (
            <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
                <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
            </div>
        )
    }

    const publishTrainment = async () => {
        if (videos.length < 1) {
            alert('Adicione ao menos um vídeo para este treinamento');
            return;
        }
        try {
            setIsLoading(true);
            const publishResponse = await axios.post(API_ROUTES.PUBLISH_TRAINMENT, {
                titulo,
            });

            if (!publishResponse?.data) {
                alert('Algo deu errado durante a publicação!')
                console.log('Algo deu errado durante a publicação: ', response);
                return;
            } else {
                window.location.reload();
            }

        } catch (err) {
            console.log('Ocorreu algum erro na publicação: ', err);
        } finally {
            setIsLoading(false);
        }
    };

    const unpublishTrainment = async () => {
        try {
            setIsLoading(true);
            const unpublishResponse = await axios.post(API_ROUTES.UNPUBLISH_TRAINMENT, {
                titulo,
            });

            if (!unpublishResponse?.data) {
                alert('Algo deu errado durante a despublicação!')
                console.log('Algo deu errado durante a despublicação: ', response);
                return;
            } else {
                window.location.reload();
            }

        } catch (err) {
            console.log('Ocorreu algum erro na despublicação: ', err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTrainment = async () => {
        if (confirm('Você quer deletar este treinamento?')) {
            try {
                setIsLoading(true);
                const deleteResponse = await axios.post(API_ROUTES.DELETE_TRAINMENT, {
                    titulo,
                });

                if (!deleteResponse?.data) {
                    alert('Algo deu errado durante a remoção!')
                    console.log('Algo deu errado durante a remoção: ', response);
                    return;
                } else {
                    window.location.reload();
                }

            } catch (err) {
                console.log('Ocorreu algum erro na remoção: ', err);
            } finally {
                setIsLoading(false);
            }
        } else { }
    };

    const saveTrainmentEdits = async () => {
        if (!dirty) {
            setEditTrainmentVideos(false);
            return;
        }
        if (stage === 'PUBLISHED' && videos.length < 1) {
            alert('Este treinamento está publicado, adicione ao menos um vídeo ou torne ele privado.');
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(API_ROUTES.UPDATE_TRAINMENT_VIDEOS, {
                titulo,
                videos,
            });
            if (!response?.data) {
                alert('Algo deu errado durante o salvamento!')
                console.log('Algo deu errado durante o salvamento: ', response);
                return;
            } else {
                setIsDirty(false);
                setEditTrainmentVideos(false);
                window.location.reload();
                alert('Alterações salvas com sucesso!!');
            }
        } catch (error) {
            console.error('Error updating trainment videos:', error.response?.data || error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeDialog = () => {
        if (!dirty) {
            setEditTrainmentVideos(false);
            setOpen(false);
        } else {
            if (confirm('Você tem mudanças não salvas')) {
                setEditTrainmentVideos(false);
                setIsDirty(false);
                setOpen(false)
            } else {

            }
        }
    }

    const addTrainmentVideo = async () => {
        event.preventDefault();
        setIsDirty(true);
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

            if (videos?.length > 0) {
                setVideos(prev => ([
                    ...prev,
                    { titulo: !isSetVideoTitle ? ytVideoTitle : videoTitle, description: videoDescription, url: videoUrl, videoId: videoId }
                ]));
            } else {
                setVideos(prev => ([
                    { titulo: !isSetVideoTitle ? ytVideoTitle : videoTitle, description: videoDescription, url: videoUrl, videoId: videoId }
                ]));
            }

            setVideoTitle('');
            setVideoUrl('');
            setIsSetVideoTitle(false);

            setIsAddVideos(false);

        } catch (err) {
            console.log('Ocorreu algum erro no cadastro: ', err);
        }
    }

    const removeVideo = (index) => {
        setIsDirty(true);
        setVideos(prev => prev.filter((_, i) => i !== index));
    };

    const increaseIndex = (index, video) => {
        setIsDirty(true);
        setVideos(prev => {
            if (index >= prev.length - 1) return prev;
            const newArr = [...prev];

            newArr.splice(index, 1);

            newArr.splice(index + 1, 0, video);
            return newArr;
        });
    }

    const decreaseIndex = (index, video) => {
        setIsDirty(true);
        setVideos(prev => {
            if (index >= prev.length + 1) return prev;
            const newArr = [...prev];

            newArr.splice(index, 1);

            newArr.splice(index - 1, 0, video);
            return newArr;
        });
    }

    const handleCopy = async (url) => {
        try {
            await navigator.clipboard.writeText(
                'Temos um vídeo que explica esse procedimento passo à passo.\nCaso haja alguma dúvida enquanto assiste é só perguntar. \nSegue o Link:\n\n' +
                url
            );
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 500);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    return (
        <>
            <div className='bg-gray-300 w-full h-auto min-h-screen'>
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='flex flex-col justify-center items-center'>

                    <Dialog open={open} onClose={() => { }}
                        className="relative z-10 select-none">

                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto h-full">
                            <div className="flex min-h-full justify-center p-4 text-center items-center py-20">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden h-3/4 rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-9/10 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                    <div className="flex items-start w-full py-4 ">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left px-6 w-full">

                                            <div className='w-full flex justify-end items-center'>
                                                <h1
                                                    className='font-bold hover:scale-105 transition-all duration-100 ease-in-out'
                                                    onClick={() => {
                                                        closeDialog();
                                                    }}
                                                >X</h1>
                                            </div>

                                            <h1 as="h3" className="text-base font-semibold text-xl">
                                                {titulo}
                                            </h1>

                                            <h1 className='text-base text-sm'>
                                                {descricao}
                                            </h1>

                                            <div className='flex flex-col items-start justify-start py-4 space-y-4'>
                                                <div className='gap-2 flex items-center justify-start'>
                                                    <h1>
                                                        Ambiente:
                                                    </h1>
                                                    <h1 className='font-semibold'>
                                                        {ambiente}
                                                    </h1>
                                                </div>

                                                <div className='gap-2 flex items-center justify-start'>
                                                    <h1>
                                                        Modulo:
                                                    </h1>
                                                    <h1 className='font-semibold'>
                                                        {modulo}
                                                    </h1>
                                                </div>

                                                <div className='gap-2 flex items-center justify-start'>
                                                    <h1>
                                                        Sub-módulo:
                                                    </h1>
                                                    <h1 className='font-semibold'>
                                                        {subModulo}
                                                    </h1>
                                                </div>
                                            </div>



                                            <div className='flex items-center justify-between p-4'>
                                                <h1 className=''>
                                                    Videos presentes neste treinamento:
                                                </h1>
                                                <h1
                                                    onClick={() => {
                                                        setEditTrainmentVideos(true);
                                                    }}
                                                    className='hover:scale-105 transition-all duration-300 ease-in-out'>
                                                    <img
                                                        className='size-4'
                                                        src={pencilEdit}
                                                    />
                                                </h1>
                                            </div>

                                            {videos?.length > 0 ? (
                                                <div className='space-y-4 select-text overflow-y-auto max-h-100'>
                                                    {videos?.map((video, index) => (
                                                        <div className='flex items-center justify-center gap-2 w-full' key={video.videoId}>
                                                            <div
                                                                className='bg-gray-300 p-4 w-full rounded-lg flex items-center justify-between gap-4'>
                                                                <div className='sm:flex items-center justify-between w-full'>
                                                                    <div className='text-wrap flex items-center'>
                                                                        <h1>
                                                                            {video.titulo}
                                                                        </h1>
                                                                    </div>
                                                                    <div className='flex-col flex items-center justify-center gap-2 text-wrap'>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleCopy(video.url);
                                                                            }}
                                                                            className='bg-gray-800 text-white w-full text-sm rounded-lg  p-2 hover:scale-102 hover:bg-gray-800/70 transition-all duration-300 ease-in-out'
                                                                        >
                                                                            Copiar mensagem com url
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setIsWatchVideo(true);
                                                                                setVideoId(video.videoId);
                                                                                setVideoTitle(video.titulo);
                                                                            }}
                                                                            className='bg-gray-800 w-full text-white text-sm rounded-lg  p-2 hover:scale-102 hover:bg-gray-800/70 transition-all duration-300 ease-in-out'
                                                                        >
                                                                            Assistir ao vídeo
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                {editTrainmentVideos && (
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
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            ) : (
                                                <div className='w-full flex flex-col items-center justify-center gap-8'>
                                                    <h1>
                                                        Este treinamento não possui nenhum vídeo
                                                    </h1>
                                                </div>
                                            )}

                                            {editTrainmentVideos && (
                                                <div className='flex items-center justify-center pt-4'>
                                                    <div
                                                        onClick={() => {
                                                            setIsAddVideos(true);
                                                        }}
                                                        className='rounded-full bg-gray-300 size-10 flex items-center justify-center cursor-pointer select-none shadow-lg/30 hover:scale-105 hover:shadow-lg/50 transition-all duration-300 ease-in-out'>
                                                        <h1 className='text-2xl '>
                                                            +
                                                        </h1>
                                                    </div>
                                                </div>
                                            )}

                                            {!editTrainmentVideos ? (
                                                <div className='flex items-center justify-between pt-8'>

                                                    {stage === 'PUBLISHED' ? (
                                                        <button
                                                            className="flex justify-center w-1/2 sm:w-auto text-xs sm:text-base p-2 rounded-md  self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                                            onClick={() => {
                                                                unpublishTrainment(titulo);
                                                            }}
                                                        >
                                                            <span>
                                                                Tornar privado
                                                            </span>
                                                        </button>
                                                    ) :
                                                        <button
                                                            className="flex justify-center w-1/2 sm:w-auto text-xs sm:text-base p-2 rounded-md  self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                                            onClick={() => {
                                                                publishTrainment(titulo);

                                                            }}
                                                        >
                                                            <span>
                                                                Publicar
                                                            </span>
                                                        </button>
                                                    }

                                                    <button className='text-red-500 hover:scale-105 transition-all duration-300 ease-in-out'
                                                        onClick={() => {
                                                            deleteTrainment();
                                                        }}
                                                    >
                                                        Deletar
                                                    </button>

                                                </div>) : (
                                                <div className='flex items-center justify-center pt-8'>
                                                    <button
                                                        onClick={() => {
                                                            saveTrainmentEdits();
                                                        }}
                                                        className='rounded-lg bg-gray-800 p-2 text-white hover:scale-105 hover:bg-gray-800/70'>
                                                        Salvar
                                                    </button>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>


                    <Dialog open={isAddVideos} onClose={() => { }}
                        className="relative z-10 select-none">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 h-full bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto py-20">
                            <div className="flex min-h-screen justify-center text-center items-center">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 w-5/6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                    <div className='w-full flex items-center justify-end p-4'>
                                        <h1
                                            onClick={() => {
                                                setIsAddVideos(false);
                                            }}
                                            className='text-lg font-bold hover:scale-115'>
                                            X
                                        </h1>
                                    </div>
                                    <div className='p-8'>
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
                                                            addTrainmentVideo();
                                                        }}
                                                    >
                                                        <span>
                                                            Inserir video
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog open={copySuccess} onClose={() => {
                        setCopySuccess(false);
                    }}
                        className="relative z-10 select-none">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 h-full bg-gray-500/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
                            <div className="flex min-h-screen justify-center text-center items-center">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white p-8 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                    <h1 className='w-full flex items-center justify-center text-center text-lg font-semibold'>
                                        Mensagem copiada com sucesso!
                                    </h1>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog open={isWatchVideo} onClose={() => { }}
                        className="relative z-10 select-none">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 h-full bg-gray-500/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
                            <div className="flex min-h-screen justify-center text-center items-center py-15">
                                <DialogPanel
                                    transition
                                    className="relative md:w-3/4 w-8/9 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                    <div className='w-full flex items-center justify-end px-2 '>
                                        <h1
                                            onClick={() => {
                                                setIsWatchVideo(false)
                                            }}
                                            className='text-lg font-bold'>
                                            X
                                        </h1>
                                    </div>
                                    <div className='px-8'>

                                        <div className='aspect-video w-full flex flex-col items-center justify-center gap-2 py-4'>
                                            <Player className='w-full'>
                                                <Youtube
                                                    key={videoId}
                                                    videoId={videoId} />
                                                <DefaultUi />
                                            </Player>
                                            <div className='w-full flex items-center justify-start'>
                                                <h1>
                                                    {videoTitle}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>

                    <div className=' w-8/9 py-8'>
                        <div className='flex flex-col items-center justify-center p-8'>
                            <h1 className='text-xl text-center font-semibold'>
                                Aqui você encontrará todos os treinamentos do CDS Academy.
                            </h1>
                            <h1 className='text-sm text-center py-2'>
                                Caso queira informações mais detalhadas ou realizar alguma edição, basta clicar sobre o treinamento desejado!
                            </h1>
                            <h1 className='text-center'>
                                Os treinamentos privados não aparecerão na aba de treinamentos, apenas nos relatórios.
                            </h1>
                        </div>
                        <div className='flex flex-col justify-start w-full gap-8' id='form' >
                            {treinamentos.map((treinamento) => (
                                <div
                                    key={treinamento.titulo}
                                    onClick={() => {
                                        setTitulo(treinamento.titulo);
                                        setDescricao(treinamento.descricao);
                                        setAmbiente(treinamento.ambiente);
                                        setModulo(treinamento.modulo);
                                        setSubModulo(treinamento.subModulo);
                                        setVideos(treinamento.videos);
                                        if (treinamento.documentInStages.length > 0) {
                                            setStage('PUBLISHED');
                                        } else {
                                            setStage('DRAFT');
                                        }
                                        setOpen(true);
                                    }}
                                    className='bg-white p-4 rounded-lg'>
                                    <div className='text-md font-semibold pb-4'>
                                        {treinamento.documentInStages.length > 0 ? (
                                            'Publicado'
                                        ) : 'Privado'}
                                    </div>
                                    <h1 className='text-xl font-semibold'>
                                        {treinamento.titulo}
                                    </h1>
                                    <h1 className='text-sm'>
                                        {treinamento.descricao}
                                    </h1>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrainmentReports;
