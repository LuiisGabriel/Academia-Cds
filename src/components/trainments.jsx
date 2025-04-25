import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { APP_ROUTES } from '../utils/constants';
import CDSWEB from '../assets/CDSWEB.png';
import CDSDESKTOP from '../assets/CDSDESKTOP.png';
import { useUser } from '../lib/customHooks';
import { useState } from 'react';

const treinamentos = [
    {
        id: 1,
        ambiente: 'web',
        modulo: 'retaguarda',
        submodulo: 'cadastros',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.WEB_RETAGUARDA_CADASTROS,
    },
    {
        id: 2,
        ambiente: 'web',
        modulo: 'retaguarda',
        submodulo: 'relatorios',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.WEB_RETAGUARDA_RELATORIOS,
    },
    {
        id: 3,
        ambiente: 'web',
        modulo: 'retaguarda',
        submodulo: 'operacoes',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.WEB_RETAGUARDA_OPERACOES,
    },
    {
        id: 4,
        ambiente: 'web',
        modulo: 'retaguarda',
        submodulo: 'financeiro',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.WEB_RETAGUARDA_FINANCEIRO,
    },
    {
        id: 5,
        ambiente: 'web',
        modulo: 'frente de loja',
        submodulo: 'cadastros',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.WEB_FRENTEDELOJA_CADASTROS,
    },
    {
        id: 6,
        ambiente: 'web',
        modulo: 'frente de loja',
        submodulo: 'relatorios',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.WEB_FRENTEDELOJA_RELATORIOS,
    },
    {
        id: 7,
        ambiente: 'desktop',
        modulo: 'retaguarda',
        submodulo: 'cadastros',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.DESKTOP_RETAGUARDA_CADASTROS,
    },
    {
        id: 8,
        ambiente: 'desktop',
        modulo: 'retaguarda',
        submodulo: 'relatorios',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.DESKTOP_RETAGUARDA_RELATORIOS,
    },
    {
        id: 9,
        ambiente: 'desktop',
        modulo: 'retaguarda',
        submodulo: 'ferramentas',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.DESKTOP_RETAGUARDA_FERRAMENTAS,
    },
    {
        id: 10,
        ambiente: 'desktop',
        modulo: 'retaguarda',
        submodulo: 'operacoes',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.DESKTOP_RETAGUARDA_OPERACOES,
    },
    {
        id: 11,
        ambiente: 'desktop',
        modulo: 'retaguarda',
        submodulo: 'financeiro',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.DESKTOP_RETAGUARDA_FINANCEIRO,
    },
    {
        id: 12,
        ambiente: 'desktop',
        modulo: 'frente de loja',
        submodulo: 'cadastros',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.DESKTOP_FRENTEDELOJA_CADASTROS,
    },
    {
        id: 13,
        ambiente: 'desktop',
        modulo: 'frente de loja',
        submodulo: 'relatorios',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.DESKTOP_FRENTEDELOJA_RELATORIOS,
    },
    {
        id: 14,
        ambiente: 'desktop',
        modulo: 'frente de loja',
        submodulo: 'ferramentas',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.DESKTOP_FRENTEDELOJA_FERRAMENTAS,
    },
    {
        id: 15,
        ambiente: 'web',
        modulo: 'frente de loja',
        submodulo: 'operacoes',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.WEB_FRENTEDELOJA_OPERACOES,
    },
    {
        id: 16,
        ambiente: 'desktop',
        modulo: 'frente de loja',
        submodulo: 'operacoes',
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',
        href: APP_ROUTES.DESKTOP_FRENTEDELOJA_OPERACOES,
    },

]

const filtros = [
    {
        id: 0,
        titulo: 'limpar',
        tipo: 'limpar',
    },
    {
        id: 1,
        titulo: 'web',
        tipo: 'ambiente',
    },
    {
        id: 2,
        titulo: 'desktop',
        tipo: 'ambiente',
    },
    {
        id: 3,
        titulo: 'retaguarda',
        tipo: 'modulo',
    },
    {
        id: 4,
        titulo: 'frente de loja',
        tipo: 'modulo',
    },
    {
        id: 5,
        titulo: 'cadastros',
        tipo: 'submodulo',
    },
    {
        id: 6,
        titulo: 'relatorios',
        tipo: 'submodulo',
    },
    {
        id: 7,
        titulo: 'operacoes',
        tipo: 'submodulo',
    },
    {
        id: 8,
        titulo: 'financeiro',
        tipo: 'submodulo',
    },
    {
        id: 9,
        titulo: 'ferramentas',
        tipo: 'submodulo',
    },

]

const Trainments = () => {

    const { user, authenticated } = useUser();

    const [modulo, setModulo] = useState();
    const [submodulo, setSubmodulo] = useState();
    const [ambiente, setAmbiente] = useState();

    const [treinamentosteste, setTreinamentosteste] = useState(treinamentos);

    const filterColor = '#1f2937';
    const filterHoverColor = '#374151';

    useEffect(() => {
        if (!ambiente && !modulo && !submodulo) {
            setTreinamentosteste(treinamentos);
        } else {
            const filteredTreinamentos = treinamentos.filter(
                (treinamento) =>
                    (!ambiente || treinamento.ambiente === ambiente) &&
                    (!modulo || treinamento.modulo === modulo) &&
                    (!submodulo || treinamento.submodulo === submodulo)
            );
            setTreinamentosteste(filteredTreinamentos);
        }
    }, [ambiente, modulo, submodulo]);


    if (!user || !authenticated) {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    return (
        <>
            <nav className="sticky top-0 z-50"><Navbar /></nav>
            <div className="bg-gray-300  h-auto h-full flex flex-col justify-center items-center w-full">

                <div className='py-32 flex flex-col justify-center items-center'>

                    <div className='flex justify-start items-center w-8/9 max-w-screen overflow-x-auto gap-2 sm:gap-4'>
                        {filtros.map((filtro) => (
                            <div
                                onClick={() => {
                                    if (filtro.tipo === 'limpar') {
                                        setAmbiente('');
                                        setModulo('');
                                        setSubmodulo('');
                                    }
                                    if (filtro.tipo === 'ambiente') {
                                        setAmbiente(filtro.titulo);
                                    }
                                    if (filtro.tipo === 'modulo') {
                                        setModulo(filtro.titulo);
                                    }
                                    if (filtro.tipo === 'submodulo') {
                                        setSubmodulo(filtro.titulo);
                                    }
                                }}
                                key={filtro.id}
                                style={{
                                    '--color': filtro.tipo === 'limpar' ? '#dc2626' : filterColor,
                                    '--hoverColor': filtro.tipo === 'limpar' ? '#f87171' : filterHoverColor,
                                }}
                                className="bg-(--color) text-white text-nowrap rounded-lg max-h-10 w-full flex justify-center p-2 cursor-pointer hover:bg-(--hoverColor) transition duration-300 ease-in-out">

                                <h1>{filtro.titulo}</h1>
                            </div>
                        ))}
                    </div>


                    <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8 py-8 px-8">
                        {treinamentosteste.map((treinamento) => (
                            <a key={treinamento.id} href={treinamento.href} className="group flex flex-col items-center justify-center">
                                <img
                                    alt={treinamento.imageAlt}
                                    src={treinamento.imageSrc}
                                    className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:scale-102 group-hover:opacity-75 xl:aspect-7/8"
                                />
                                <h3 className="text-center mt-4 text-sm text-gray-700">{treinamento.ambiente} </h3>
                                <h3 className="text-center mt-4 text-sm text-gray-700">{treinamento.modulo} </h3>
                                <h3 className="text-center mt-4 text-sm text-gray-700">{treinamento.submodulo} </h3>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Trainments;
