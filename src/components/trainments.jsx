import { useEffect } from 'react';
import Navbar from './Navbar';
import { APP_ROUTES } from '../utils/constants';
import { useTreinamentos, useUser } from '../lib/customHooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Trainments = () => {
    const { user, authenticated } = useUser();
    const treinamentos = useTreinamentos();
    const navigate = useNavigate();

    const [modulo, setModulo] = useState();
    const [subModulo, setSubModulo] = useState();
    const [ambiente, setAmbiente] = useState();
    const [FilteredTreinamentos, setFilteredTreinamentos] = useState(treinamentos);

    const filterColor = '#1f2937';
    const filterHoverColor = '#374151';

    const filtros = [
        { id: 0, titulo: 'Limpar', tipo: 'limpar' },
        ...Array.from(new Set(treinamentos.map((t) => t.ambiente)))
            .filter(Boolean)
            .map((ambiente, index) => ({ id: index + 1, titulo: ambiente, tipo: 'ambiente' })),
        ...Array.from(new Set(treinamentos.map((t) => t.modulo)))
            .filter(Boolean)
            .map((modulo, index) => ({ id: index + 100, titulo: modulo, tipo: 'modulo' })),
        ...Array.from(new Set(treinamentos.map((t) => t.subModulo)))
            .filter(Boolean)
            .map((subModulo, index) => ({ id: index + 200, titulo: subModulo, tipo: 'submodulo' })),
    ];

    useEffect(() => {
        if (!ambiente && !modulo && !subModulo) {
            setFilteredTreinamentos(treinamentos);
        } else {
            const filterTreinamentos = treinamentos.filter(
                (treinamento) =>
                    (!ambiente || treinamento.ambiente === ambiente) &&
                    (!modulo || treinamento.modulo === modulo) &&
                    (!subModulo || treinamento.subModulo === subModulo)
            );
            setFilteredTreinamentos(filterTreinamentos);
        }
    }, [ambiente, modulo, subModulo, treinamentos]);

    if (!user || !authenticated) {
        return (
            <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
                <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
            </div>
        );
    }

    const handleTreinamentoClick = (ambiente, modulo, subModulo, videos) => {

        navigate(APP_ROUTES.TRAINMENT, {
            state: {
                ambiente: ambiente,
                modulo: modulo,
                subModulo: subModulo,
                videos: videos
            },
        });

    };

    return (
        <>
            <div className="bg-gray-300 h-auto min-h-screen ">
                <nav className="sticky top-0 z-50">
                    <Navbar />
                </nav>
                <div className="flex flex-col justify-center items-center w-full select-none">
                    <div className="py-28 flex flex-col justify-center items-center w-full">
                        {FilteredTreinamentos.length > 0 ? (<div className="flex justify-start items-center w-8/9 max-w-screen overflow-x-auto gap-2 sm:gap-4">
                            {filtros.map((filtro) => {
                                const isActive =
                                    filtro.titulo === ambiente ||
                                    filtro.titulo === modulo ||
                                    filtro.titulo === subModulo;

                                return (
                                    <div
                                        onClick={() => {
                                            if (filtro.tipo === 'limpar') {
                                                setAmbiente('');
                                                setModulo('');
                                                setSubModulo('');
                                            } else if (filtro.tipo === 'ambiente') {
                                                setAmbiente((prev) => (prev === filtro.titulo ? '' : filtro.titulo));
                                            } else if (filtro.tipo === 'modulo') {
                                                setModulo((prev) => (prev === filtro.titulo ? '' : filtro.titulo));
                                            } else if (filtro.tipo === 'submodulo') {
                                                setSubModulo((prev) => (prev === filtro.titulo ? '' : filtro.titulo));
                                            }
                                        }}
                                        key={filtro.id}
                                        style={{
                                            '--color': filtro.tipo === 'limpar' ? '#dc2626' : isActive ? '#10b981' : filterColor,
                                            '--hoverColor': filtro.tipo === 'limpar' ? '#f87171' : isActive ? '#34d399' : filterHoverColor,
                                        }}
                                        className="bg-(--color) text-white text-nowrap rounded-lg max-h-10 w-full flex justify-center p-2 cursor-pointer hover:bg-(--hoverColor) transition duration-300 ease-in-out"
                                    >
                                        <h1>{filtro.titulo}</h1>
                                    </div>
                                );
                            })}
                        </div>) : "Não existem treinamentos disponíveis por enquanto."}

                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-4 xl:gap-x-8 py-8 px-8">
                            {FilteredTreinamentos.filter(treinamento => treinamento.documentInStages.length > 0).map((treinamento) => (
                                <div
                                    key={treinamento.titulo}
                                    onClick={() => {
                                        handleTreinamentoClick(treinamento.ambiente, treinamento.modulo, treinamento.subModulo, treinamento.videos);
                                    }}
                                    className="group flex flex-col items-center justify-center"
                                >
                                    <div className="bg-white h-full flex flex-col justify-between rounded-lg pb-8 group-hover:scale-102 transition-all duration-300 ease-in-out shadow-lg/30">
                                        <img
                                            alt={treinamento.imageAlt}
                                            src={treinamento.imageSrc}
                                            className="aspect-square w-full rounded-t-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                                        />
                                        <h1 className="text-center p-4 text-semibold">{treinamento.titulo} </h1>
                                        <h1 className="text-sm px-6">{treinamento.descricao}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Trainments;