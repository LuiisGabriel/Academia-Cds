import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES } from '../utils/constants';
import Navbar from './Navbar';
import { useAmbientes, useModulos, useSubModulos, useUser } from '../lib/customHooks';

const CreateTrainment = () => {

    const { user, authenticated } = useUser();

    const modulos = useModulos();
    const subModulos = useSubModulos();
    const ambientes = useAmbientes();

    const [titulo, setTitulo] = useState('');
    const [ambiente, setAmbiente] = useState('');
    const [modulo, setModulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [subModulo, setSubModulo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!user || !authenticated || user.role !== 'ADMIN') {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    const createVideo = async () => {
        try {
            setIsLoading(true);
            const response = await axios({
                method: 'POST',
                url: API_ROUTES.CREATE_TRAINMENT,
                data: {
                    titulo,
                    descricao,
                    ambiente,
                    modulo,
                    subModulo
                }
            });
            if (!response?.data) {
                console.log('Algo deu errado durante o cadstro: ', response);
                return;
            } else {
                alert('Treinamento cadastrado com sucesso!');
            }
        }
        catch (err) {
            console.log('Ocorreu algum erro no cadastro: ', err);
        }
        finally {
            setTitulo('');
            setAmbiente('');
            setModulo('');
            setSubModulo('');
            setDescricao('');
            setIsLoading(false);
        }
    };

    return (
        <>

            <div className="w-full h-screen  bg-gray-300">
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='flex justify-center items-center pt-16'>
                    <div className=" w-3/4 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col">
                        <h2 className="text-center font-medium text-2xl mb-8">
                            Cadastre um treinamento
                        </h2>
                        <form className="flex flex-1 flex-col justify-evenly gap-8">
                            <input
                                className="border-2 outline-none p-2 rounded-md"
                                type="text"
                                placeholder="titulo"
                                value={titulo}
                                required
                                onChange={(e) => { setTitulo(e.target.value); }}
                            />
                            <input
                                className="border-2 outline-none p-2 rounded-md"
                                type="text"
                                placeholder="Descrição"
                                value={descricao}
                                required
                                onChange={(e) => { setDescricao(e.target.value); }}
                            />
                            <select
                                type="text"
                                onChange={(e) => { setAmbiente(e.target.value); }}
                                value={ambiente}
                                className="border-2 outline-none p-2 rounded-md"
                            >
                                <option disabled={true} value="">Escolha um ambiente</option>
                                {ambientes.map((ambiente) => (
                                    <option
                                        key={ambiente.nome}
                                        value={ambiente.nome}
                                    >
                                        {ambiente.nome}
                                    </option>
                                ))}
                            </select>
                            <select
                                type="text"
                                onChange={(e) => { setModulo(e.target.value); }}
                                value={modulo}
                                className="border-2 outline-none p-2 rounded-md"
                            >
                                <option disabled={true} value="">Escolha um módulo</option>
                                {modulos.map((modulo) => (
                                    <option
                                        key={modulo.nome}
                                        value={modulo.nome}
                                    >
                                        {modulo.nome}
                                    </option>
                                ))}
                            </select>
                            <select
                                type="text"
                                onChange={(e) => { setSubModulo(e.target.value); }}
                                value={subModulo}
                                className="border-2 outline-none p-2 rounded-md"
                            >
                                <option disabled={true} value="">Escolha um sub-módulo</option>
                                {subModulos.map((subModulo) => (
                                    <option
                                        key={subModulo.nome}
                                        value={subModulo.nome}
                                    >
                                        {subModulo.nome}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="flex justify-center p-2 rounded-md w-1/2 self-center bg-gray-800 text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                onClick={createVideo}
                            >
                                {
                                    isLoading ?
                                        <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : null
                                }
                                <span>
                                    Cadastrar
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateTrainment;