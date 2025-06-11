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

    async function handleTimeUpdate(currentTime, duration) {
        if (
            duration > 0 &&
            duration - currentTime < 1 &&
            !videoEnded
        ) {
            setVideoEnded(true);

            if (user?.watchedVideos?.map((video) => video.videoId).includes(videoId)) {
                console.log('assistido');
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

                if (response?.data) {
                    console.log('cabô');
                }

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
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className=' px-8 py-8 justify-center'>

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
                                            className='bg-gray-800 text-white rounded-lg p-2 hover:scale-102 hover:bg-gray-800/70 transition-all duration-300 ease-in-out'
                                        >
                                            Copiar mensagem com url
                                        </button>
                                    )}
                                </div>
                                <h1 className='p-2 text-md'>{videoDescricao}</h1>
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-full py-8 md:py-0 md:w-2/5">
                            <div className="flex-col flex w-full gap-4">
                                {videos?.map((video, index) => (
                                    <button
                                        style={{
                                            '--color': video.videoId === videoId ? "#475569" : "#1e293b",
                                        }}
                                        className="bg-(--color) flex items-center p-2 justify-center rounded-md h-30 hover:bg-gray-800/70 hover:scale-105 transition-all duration-300 ease-in-out"
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
