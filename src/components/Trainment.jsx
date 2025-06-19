import Navbar from '../components/Navbar';
import { useUser } from '../lib/customHooks';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../utils/constants';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { DefaultUi, Player, Youtube } from '@vime/react';

const Trainment = () => {
    const { user, authenticated } = useUser();
    const email = user?.email;

    const location = useLocation();
    const { videos } = location.state || { videos: [] };

    const [playedTime, setPlayedTime] = useState(0);

    const [currentVideo, setCurrentVideo] = useState(0);

    const [watchedVideos, setWatchedVideos] = useState([]);

    const videoId = videos[currentVideo]?.videoId || '';
    const videoTitulo = videos[currentVideo]?.titulo || '';
    const videoDescricao = videos[currentVideo]?.description || '';
    const videoUrl = videos[currentVideo]?.url || '';

    const [copySuccess, setCopySuccess] = useState(false);

    const [videoEnded, setVideoEnded] = useState(false);

    useEffect(() => {
        setVideoEnded(false);
    }, [currentVideo]);

    useEffect(() => {
        if (user?.watchedVideos) {
            setWatchedVideos(user.watchedVideos);
        }
    }, [user]);

    if (!user || !authenticated) {
        return (
            <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
                <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
            </div>
        );
    }

    async function handleTimeUpdate(currentTime, duration) {
        if (
            duration > 0 &&
            duration - currentTime < 1 &&
            !videoEnded
        ) {
            setVideoEnded(true);

            if (watchedVideos?.map((video) => video.videoId).includes(videoId)) {
                if (currentVideo < videos.length - 1) {
                    setCurrentVideo(currentVideo + 1);
                } else { return }
                return;
            }

            const updatedWatchedVideos = [
                ...watchedVideos,
                { videoId: videoId, videoTitulo: videoTitulo, videoUrl: videoUrl, videoDescricao: videoDescricao },
            ];
            setWatchedVideos(updatedWatchedVideos);

            try {
                const mergedWatchedVideos = [
                    ...(user.watchedVideos || []),
                    ...updatedWatchedVideos,
                ];

                const response = await axios.post(API_ROUTES.UPDATE_USER_WATCHED_VIDEOS, {
                    email,
                    watchedVideos: mergedWatchedVideos,
                });

            } catch (error) {
                console.error('Error updating watched videos:', error.response?.data || error);
            } finally {
                if (currentVideo < videos.length - 1) {
                    setCurrentVideo(currentVideo + 1);
                } else { }
            }
        }
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                'Temos um vídeo que explica esse procedimento passo à passo.\nCaso haja alguma dúvida enquanto assiste é só perguntar. \nSegue o Link:\n\n' +
                videoUrl
            );
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 500);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    return (
        <>

            <div className="bg-gray-300 h-auto h-full min-h-screen">
                <nav className="sticky top-0 z-60"><Navbar /></nav>
                <div className=' px-8 py-8 justify-center'>

                    <Dialog open={copySuccess} onClose={() => {
                        setCopySuccess(false);
                    }}
                        className="relative z-10 select-none">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 h-full bg-black/60 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
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

                    <div className='md:flex gap-8'>
                        <div className="flex flex-col w-full">

                            <div className="aspect-video">
                                <Player
                                    onVmCurrentTimeChange={(e) => {
                                        const currentTime = e.detail;
                                        const duration = e.target.duration;
                                        handleTimeUpdate(currentTime, duration);
                                    }}
                                >
                                    <Youtube
                                        key={videoId}
                                        videoId={videoId} />
                                    <DefaultUi />
                                </Player>
                            </div>

                            <div>
                                <div className='flex items-center justify-between'>
                                    <h3 className="py-4 text-xl">{videoTitulo}</h3>

                                    {user.role == 'ADMIN' && (
                                        <button
                                            onClick={() => {
                                                handleCopy();
                                            }}
                                            className='bg-cdsBlue text-white rounded-lg p-2 hover:scale-102 hover:bg-cdsBlue/70 transition-all duration-300 ease-in-out cursor-pointer'
                                        >
                                            Copiar mensagem com url
                                        </button>
                                    )}
                                </div>
                                <h1 className='p-2 text-md'>{videoDescricao}</h1>
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-full py-8 px-4 md:py-0 md:w-2/5 overflow-y-auto max-h-135">
                            <div className="flex-col flex w-full gap-4">
                                {videos?.map((video, index) => (
                                    <button
                                        className={`${video.videoId === videoId || user?.watchedVideos?.filter(watchedVideo => watchedVideo.videoId === video.videoId).map(watchedVideo => watchedVideo.videoId).includes(video.videoId) ? 'bg-cdsBlue/70' : 'bg-cdsBlue'} flex items-center p-4 min-h-20 justify-center rounded-md hover:bg-cdsBlue/70 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer`}
                                        onClick={() => {
                                            setCurrentVideo(index);
                                        }}
                                        key={index}
                                    >
                                        <a className="text-white flex justify-center items-center gap-4">
                                            <h1>{video.titulo}</h1>
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

export default Trainment;