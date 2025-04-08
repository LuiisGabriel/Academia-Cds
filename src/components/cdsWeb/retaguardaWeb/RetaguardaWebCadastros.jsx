import Navbar from '../../Navbar';
import { useQuery } from '@apollo/client';
import { getVideos } from '../../../graphQl/Querys';
import { useUser } from '../../../lib/customHooks';
import ReactPlayer from 'react-player';
import { useState, useEffect } from 'react';
import { Carousel } from '@material-tailwind/react';

const RetaguardaWebCadastros = () => {
    const { user, authenticated } = useUser();
    const pathname = location.pathname.split('/');
    const ambiente = pathname[1];
    const modulo = pathname[2];
    const subModulo = pathname[3];
    const [length, setLength] = useState(0);
    const { loading, error, data } = useQuery(getVideos, { variables: { modulo, subModulo, ambiente } });
    const [playedTime, setPlayedTime] = useState(0);
    const [condicao, setCondicao] = useState('inapto');

    const [watchedVideos, setWatchedVideos] = useState([]);
    const [videoId, setVideoId] = useState('');

    useEffect(() => {
        handleCondicao();
    })

    if (!user || !authenticated) {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    if (loading) {
        return (
            <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
                <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
            </div>
        )
    }
    if (error) {
        return alert('Ocorreu um problema ao carregar os vídeos!!!');
    }

    async function handleLength() {
        setLength(data.videos.map(() => { }).length);
    }

    if (length <= 0) {
        handleLength();
    }

    async function handleCondicao() {
        if (watchedVideos.length >= length && playedTime >= 15) {
            setCondicao('apto');
        }
        else {
            return;
        }
    }

    function handleProgress(progress) {
        if (!progress.seeking) {
            setPlayedTime(progress.playedSeconds);
        }
    }

    const handleEnded = () => {

        const isVideo = watchedVideos.find((video) => video.id === videoId);

        if (isVideo) {
            console.log('video já assistido')
            return;
        } else {
            setWatchedVideos(prev => ([
                ...prev,
                { id: videoId, playedTime: playedTime, ambiente: ambiente, modulo: modulo, subModulo: subModulo }
            ]),

                console.log('----------------------------------------------------'),
                console.log(watchedVideos),
                console.log(isVideo),
                console.log(videoId),
                console.log('----------------------------------------------------'),

            );
        }
    };


    return (
        <>
            <nav className="sticky top-0 z-50"><Navbar /></nav>
            length: {length}
            <div className=" flex flex-col bg-gray-300 h-auto h-full items-center justify-center pt-16 pb-32 ">
                <div className=" sm:text-5xl pb-10 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                        Bem-vindo ao treinamento de {subModulo} do módulo {modulo}
                    </h1>
                </div>
                <div className=" sm:text-4xl  w-2/3 text-center pb-8">
                    <h1 className="text-3xl font-normal tracking-tight text-gray-700">
                        Aqui você vai encontrar os treinamentos necessários para realizar os cadastros de retaguarda do sistema CDS.
                    </h1>
                </div>
                <div className=" sm:text-4xl pb-16 w-2/3 text-center ">
                    <h1 className="text-2xl font-normal tracking-tight text-black">
                        Assista os vídeos até o final!!
                    </h1>
                </div>
                <h1>you watched {watchedVideos.length} videos</h1>
                <h1>you watched {playedTime} seconds </h1>
                <h1>você está {condicao} para realizar a prova!!</h1>
                <h1> video: {videoId} </h1>

                <div className='w-full px-16 flex justify-center'>
                    <div className=" pt-16 min-h-200 w-full">
                        <div className="w-full justify-center items-center flex flex-col grid grid-cols-1 gap-y-10 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 xl:gap-x-1 gap-y-32">
                            {data.videos.map((video) => (
                                <div className=" min-h-50 max-h-180" key={video.id}>
                                    <ReactPlayer
                                        url={video.url}
                                        width='100%'
                                        height='100%'
                                        onEnded={() => {
                                            handleEnded();
                                        }
                                        }
                                        onPlay={() => setVideoId(video.id)}
                                        onProgress={handleProgress}
                                        controls={true}
                                    />
                                    <h3 className="mt-4 text-xl ">{video.titulo}</h3>
                                    <h3 className="mt-4 text-xl">{video.id}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default RetaguardaWebCadastros;