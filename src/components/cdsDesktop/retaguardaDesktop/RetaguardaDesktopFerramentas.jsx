import Navbar from '../../Navbar';
import { useUser, useVideos } from '../../../lib/customHooks';
import ReactPlayer from 'react-player';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../../../utils/constants';

const RetaguardaDesktopFerramentas = () => {
    const { user, authenticated } = useUser();
    const email = user?.email;

    const pathname = location.pathname.split('/');
    const ambiente = pathname[1];
    const modulo = pathname[2];
    const subModulo = pathname[3];
    const videos = useVideos(ambiente, modulo, subModulo);

    const [playedTime, setPlayedTime] = useState(0);

    const initialVideo = videos[0];

    const [watchedVideos, setWatchedVideos] = useState([]);
    const [videoId, setVideoId] = useState('');
    const [videoTitulo, setVideoTitulo] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        if (initialVideo) {
            setVideoId(initialVideo.id);
            setVideoTitulo(initialVideo.titulo);
            setVideoUrl(initialVideo.url)
        }
    }, [initialVideo])

    useEffect(() => {
        if (watchedVideos) {
            return;
        }
    }, [watchedVideos]);

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

            <div className="bg-gray-300 h-auto h-full min-h-screen">
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className=' px-8 py-8 justify-center select-none'>
                    <div className='md:flex gap-8'>

                        <div className="flex flex-col w-full order-1 md:order-2">
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

                        <div className="flex flex-col items-center w-full py-8 md:py-0 md:w-1/4 order-2 md:order-1">
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

                    </div>
                </div>
            </div>
        </>
    );
};

export default RetaguardaDesktopFerramentas;