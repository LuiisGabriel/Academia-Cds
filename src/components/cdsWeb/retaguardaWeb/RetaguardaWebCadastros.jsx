import Navbar from '../../Navbar';
 import { useQuery } from '@apollo/client';
 import { getVideos } from '../../../graphQl/Querys';
 import { useUser } from '../../../lib/customHooks';
 import ReactPlayer from 'react-player';
 import { useState, useEffect } from 'react';
 
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
     const [videoTitulo, setVideoTitulo] = useState('Escolha um vídeo para iniciar o treinamento');
     const [videoUrl, setVideoUrl] = useState('initialUrl');
 
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
             </div>
 
             <div className=' bg-gray-300 w-full h-auto h-full px-8 pb-16 gap-8 md:flex justify-center'>
 
                 <div className="flex flex-col w-full">
                     <div className="aspect-video" key={videoId}>
                         <ReactPlayer
                             style={{ borderRadius: '50px' }}
                             url={videoUrl}
                             width='100%'
                             height='100%'
                             onEnded={() => {
                                 handleEnded();
                             }
                             }
                             onProgress={handleProgress}
                             controls={true}
                         />
                     </div>
                     <div>
                         <h3 className="mt-4 text-xl ">{videoTitulo}</h3>
                     </div>
 
                 </div>
 
                 <div className="flex flex-col items-center w-full py-8 md:py-0 md:w-1/4">
 
                     <div className='text-center text-2xl font-bold tracking-tight pb-8'>
                         veja abaixo os vídeos diponiveis para o treinamento de {subModulo} do módulo {modulo}
                     </div>
 
                     <div className='flex-col flex w-full gap-4'>
                         {data.videos.map((video) => (
 
                             <button
                                 className='bg-gray-800 flex items-center justify-center rounded-md h-30 hover:bg-gray-700'
                                 onClick={() => {
                                     setVideoId(video.id);
                                     setVideoTitulo(video.titulo);
                                     setVideoUrl(video.url);
                                 }}
                                 key={video.id}
                             >
                                 <a className='text-white flex justify-center items-center'>
                                     <h1>{video.titulo}</h1>
                                 </a>
                             </button>
 
                         ))}
                     </div>
 
                 </div>
 
 
 
 
             </div>
 
         </>
     );
 }
 export default RetaguardaWebCadastros;
