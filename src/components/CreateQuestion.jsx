import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES } from '../utils/constants';
import Navbar from './Navbar';
import { useAmbientes, useModulos, useSubModulos, useUser } from '../lib/customHooks';
import lixeira from '../assets/lixeira.svg'

const CreateQuestion = () => {

    const { user, authenticated } = useUser();

    const modulos = useModulos();
    const subModulos = useSubModulos();
    const ambientes = useAmbientes();

    const isCorrectColor = "#dc2626"

    const [questionTitle, setQuestionTitle] = useState('');

    const [nivel, setNivel] = useState('');
    const [ambiente, setAmbiente] = useState('');
    const [modulo, setModulo] = useState('');
    const [subModulo, setSubModulo] = useState('');

    const [isCorrect, setIsCorrect] = useState(false);
    const [answerTitle, setAnswerTitle] = useState('');
    const [answerOptions, setAnswerOptions] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isCorrect) {
            return;
        }
    }, [isCorrect]);

    if (!user || !authenticated || user.role !== 'ADMIN') {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    const addAnswerOption = () => {
        if (!answerTitle) {
            alert("insira uma resposta válida");
            return;
        }
        setAnswerOptions(prev => ([
            ...prev,
            { answerTitle: answerTitle, isCorrect: isCorrect }
        ]));
        setAnswerTitle('');
        setIsCorrect(false);
    };

    const removeAnswerOption = (index) => {
        setAnswerOptions(prev => prev.filter((_, i) => i !== index));
    };

    const createQuestion = async () => {

        try {
            if (!questionTitle || !ambiente || !modulo || !subModulo || !nivel || answerOptions.length === 0) {
                alert("Preencha todos os campos obrigatórios.");
                setIsLoading(false);
                return;
            }
            const parsedNivel = parseInt(nivel, 10);
            if (isNaN(parsedNivel)) {
                alert("O nível deve ser um número válido.");
                setIsLoading(false);
                return;
            }
            if (answerOptions.length < 5) {
                alert('você deve inserir no mínimo 5 questões!!');
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            const response = await axios({
                method: 'POST',
                url: API_ROUTES.CREATE_QUESTION,
                data: {
                    title: questionTitle,
                    ambiente,
                    modulo,
                    subModulo,
                    nivel: parsedNivel,
                    answerOptions,
                }
            });
            if (response?.data) {
                setQuestionTitle('');
                setAmbiente('');
                setModulo('');
                setSubModulo('');
                setNivel('');
                setAnswerOptions([]);
                setIsLoading(false);
                alert('Questão cadastrada com sucesso');
            } else {
                console.log('Algo deu errado durante o cadstro: ', response);
                return;
            }
        }
        catch (err) {
            console.log('Ocorreu algum erro no cadastro: ', err.response?.data?.message);
        }
    };

    return (
        <>
            <div className="w-full h-full h-auto  bg-gray-300">
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='py-16 flex justify-center items-center'>
                    <div className=" w-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col">
                        <h2 className="text-center font-medium text-2xl mb-4">
                            Cadastre uma nova questão
                        </h2>
                        <div className="flex flex-1 flex-col justify-evenly py-8 gap-8">
                            <input
                                className="border-2 outline-none p-2 rounded-md"
                                type="text"
                                placeholder="titulo"
                                value={questionTitle}
                                required
                                onChange={(e) => { setQuestionTitle(e.target.value); }}
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
                            <select
                                type="text"
                                onChange={(e) => { setNivel(e.target.value); }}
                                value={nivel}
                                className="border-2 outline-none p-2 rounded-md"
                                required
                            >
                                <option disabled={true} value="">Selecione um nível para a questão</option>
                                <option
                                    value={1}
                                >
                                    1
                                </option>
                                <option
                                    value={2}
                                >
                                    2
                                </option>
                            </select>

                            <div className='flex flex-col justify-center items-center w-full'>
                                <div className='w-full md:flex justify-start items-center gap-8'>
                                    <input
                                        className="border-2 outline-none p-2 rounded-md w-full mb-8 sm:mb-0"
                                        type="text"
                                        placeholder="resposta"
                                        value={answerTitle}
                                        onChange={(e) => { setAnswerTitle(e.target.value); }}
                                    />
                                    <div className='flex justify-center items-center md:w-1/2'>
                                        <h1 className='px-2'>
                                            É a resposta certa?
                                        </h1>
                                        <input
                                            className='rounded-full size-3'
                                            type='checkbox'
                                            checked={isCorrect}
                                            onChange={(e) => {
                                                setIsCorrect(e.target.checked);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='pt-8 w-full flex items-center justify-center'>
                                    <button
                                        className="flex justify-center p-2 rounded-md w-1/2 self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                        onClick={addAnswerOption}
                                    >
                                        <span>
                                            Inserir resposta
                                        </span>
                                    </button>
                                </div>
                            </div>


                            <div className='flex flex-col justify-center items-center gap-2 '>
                                <h1 className='mb-4'>
                                    Respostas para esta questão:
                                </h1>
                                {answerOptions?.map((answerOption, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            '--color': answerOption.isCorrect === true ? '#84cc16' : isCorrectColor,
                                        }}
                                        className=' bg-(--color)/40 rounded-lg w-full p-2 flex justify-between items-center'
                                    >
                                        <h1>{answerOption.answerTitle}</h1>
                                        <button
                                            className='text-2xl hover:scale-115 transition-all duration-300 ease-in-out'
                                            onClick={() => {
                                                removeAnswerOption(index)
                                            }}
                                        >
                                            <img
                                                className='size-5'
                                                src={lixeira} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="flex justify-center p-2 rounded-md w-1/2 self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                onClick={createQuestion}
                            >
                                {
                                    isLoading ?
                                        <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : <span> Cadastrar questão </span>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateQuestion;