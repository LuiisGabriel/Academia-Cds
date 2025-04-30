import Navbar from '../../Navbar';
import { useUser, useVideos } from '../../../lib/customHooks';
import ReactPlayer from 'react-player';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../../../utils/constants';

const FrenteDeLojaDesktopCadastros = () => {
    const { user, authenticated } = useUser();
    const email = user?.email;

    const pathname = location.pathname.split('/');
    const ambiente = pathname[1];
    const modulo = pathname[2];
    const subModulo = pathname[3];
    const videos = useVideos(ambiente, modulo, subModulo);
    const firstVideo = videos?.length > 0 ? videos[0] : null;

    const [length, setLength] = useState(0);
    const [playedTime, setPlayedTime] = useState(0);
    const [condicao, setCondicao] = useState('inapto');

    const [watchedVideos, setWatchedVideos] = useState([]);
    const [videoId, setVideoId] = useState('');
    const [videoTitulo, setVideoTitulo] = useState('Escolha um vídeo para iniciar o treinamento');
    const [videoUrl, setVideoUrl] = useState('asdasd');

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
            <div className="bg-gray-300 w-full h-auto h-full px-8 py-16 gap-8 md:flex justify-center select-none">

                <div className="flex flex-col items-center w-full py-8 md:py-0 md:w-1/4">
                    <div className="flex-col flex w-full gap-4">
                        {videos?.map((video, index) => (
                            <button
                                className="bg-gray-800 flex items-center p-2 justify-center rounded-md h-30 hover:bg-gray-700"
                                onClick={() => {
                                    setVideoId(video.id);
                                    setVideoTitulo(video.titulo);
                                    setVideoUrl(video.url);
                                }}
                                key={video.id}
                            >
                                <a className="text-white flex justify-center items-center gap-4">
                                    <h1>{video.titulo}</h1>
                                    <h1>{index + 1}</h1>
                                </a>
                            </button>
                        ))}
                    </div>
                </div>

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

            </div>
        </>
    );
};

export default FrenteDeLojaDesktopCadastros;