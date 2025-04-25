import Navbar from '../../Navbar';
import { useUser, useVideos } from '../../../lib/customHooks';
import ReactPlayer from 'react-player';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../../../utils/constants';

const FrenteDeLojaDesktopOperacoes = () => {
    const { user, authenticated } = useUser();
    const email = user?.email;

    const pathname = location.pathname.split('/');
    const ambiente = pathname[1];
    const modulo = pathname[2];
    const subModulo = pathname[3];
    const videos = useVideos(ambiente, modulo, subModulo);

    const [length, setLength] = useState(0);
    const [playedTime, setPlayedTime] = useState(0);
    const [condicao, setCondicao] = useState('inapto');

    const [watchedVideos, setWatchedVideos] = useState([]);
    const [videoId, setVideoId] = useState('');
    const [videoTitulo, setVideoTitulo] = useState('Escolha um vídeo para iniciar o treinamento');
    const [videoUrl, setVideoUrl] = useState('initialUrl');

    useEffect(() => {
        if (videos?.length > 0) {
            setLength(videos.length);
        }
    }, [videos]);

    useEffect(() => {
        if (watchedVideos.length >= length && playedTime >= 15) {
            setCondicao('apto');
        }
    }, [watchedVideos, length, playedTime]);

    if (!user || !authenticated) {
        return (
            <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
                <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
            </div>
        );
    }

    function handleProgress(progress) {
        if (!progress.seeking) {
            setPlayedTime(progress.playedSeconds);
        }
    }

    const handleEnded = async () => {
        
    const isVideo = user.watchedvideos.indexOf(videoId);
    let updatedWatchedVideos = [...watchedVideos];

    if (user?.watchedvideos?.length > 0) {
        updatedWatchedVideos = [...new Set([...updatedWatchedVideos, ...user.watchedvideos])];
    }

    if (isVideo <= -1) {
        updatedWatchedVideos.push(videoId);
    } else {
        console.log("Vídeo já assistido");
        return;
    }
    setWatchedVideos(updatedWatchedVideos);
    try {
        const response = await axios.post(API_ROUTES.UPDATE_USER_WATCHED_VIDEOS, {
            email,
            watchedvideos: updatedWatchedVideos,
        });

        if (response?.data) {
            return;
        } 
    } catch (error) {
        console.error('Error updating videos:', error);
    }
    };

    return (
        <>
            <nav className="sticky top-0 z-50"><Navbar /></nav>
            <div className="flex flex-col bg-gray-300 h-auto h-full items-center justify-center pt-16 pb-32 select-none">
                <div className="sm:text-5xl pb-10 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                        Bem-vindo ao treinamento de {subModulo} do módulo {modulo}
                    </h1>
                </div>
                <div className="sm:text-4xl w-2/3 text-center pb-8">
                    <h1 className="text-3xl font-normal tracking-tight text-gray-700">
                        Aqui você vai encontrar os treinamentos necessários para realizar os cadastros de retaguarda do sistema CDS.
                    </h1>
                </div>
                <div className="sm:text-4xl pb-16 w-2/3 text-center">
                    <h1 className="text-2xl font-normal tracking-tight text-black">
                        Assista os vídeos até o final!!
                    </h1>
                </div>
                <h1>Você assistiu {user.watchedvideos.length} vídeos</h1>
                <h1>Você assistiu {playedTime} segundos</h1>
                <h1>Você está {condicao} para realizar a prova!!</h1>
                <h1>Vídeo: {videoId}</h1>
            </div>

            <div className="bg-gray-300 w-full h-auto h-full px-8 pb-16 gap-8 md:flex justify-center select-none">
                <div className="flex flex-col w-full">
                    <div className="aspect-video" key={videoId}>
                        <ReactPlayer
                            style={{ borderRadius: '50px' }}
                            url={videoUrl}
                            width="100%"
                            height="100%"
                            onEnded={handleEnded}
                            onProgress={handleProgress}
                            controls={true}
                        />
                    </div>
                    <div>
                        <h3 className="mt-4 text-xl">{videoTitulo}</h3>
                    </div>
                </div>

                <div className="flex flex-col items-center w-full py-8 md:py-0 md:w-1/4">
                    <div className="text-center text-2xl font-bold tracking-tight pb-8">
                        Veja abaixo os vídeos disponíveis para o treinamento de {subModulo} do módulo {modulo}
                    </div>

                    <div className="flex-col flex w-full gap-4">
                        {videos?.map((video) => (
                            <button
                                className="bg-gray-800 flex items-center justify-center rounded-md h-30 hover:bg-gray-700"
                                onClick={() => {
                                    setVideoId(video.id);
                                    setVideoTitulo(video.titulo);
                                    setVideoUrl(video.url);
                                }}
                                key={video.id}
                            >
                                <a className="text-white flex justify-center items-center">
                                    <h1>{video.titulo}</h1>
                                </a>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FrenteDeLojaDesktopOperacoes;