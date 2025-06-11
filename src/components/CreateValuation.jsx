import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import Navbar from './Navbar';
import { useAmbientes, useAvaliacoes, useModulos, useSubModulos, useUser } from '../lib/customHooks';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import lixeira from '../assets/lixeira.svg'
import { useNavigate } from 'react-router-dom';

const CreateValuation = () => {

    const { user, authenticated } = useUser();
    const navigate = useNavigate();

    const modulos = useModulos();
    const subModulos = useSubModulos();
    const ambientes = useAmbientes();
    const avaliacoes = useAvaliacoes();
    const [dirty, setDirty] = useState(false);

    const [titulo, setTitulo] = useState('');
    const [ambiente, setAmbiente] = useState('');
    const [modulo, setModulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [subModulo, setSubModulo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMultipleChoice, setIsMultipleChoice] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [answerTitle, setAnswerTitle] = useState('');
    const [answerOptions, setAnswerOptions] = useState([]);
    const [questionTitle, setQuestionTitle] = useState('');
    const [valuationQuestions, setValuationQuestions] = useState([]);
    const [postCreateValuation, setPostCreateValuation] = useState(false);
    const [open, setOpen] = useState(false);
    const isCorrectColor = "#dc2626"

    useEffect(() => {
        if (
            isMultipleChoice ||
            isCorrect ||
            answerTitle ||
            answerOptions.length ||
            questionTitle ||
            valuationQuestions.length ||
            titulo ||
            ambiente ||
            modulo ||
            descricao ||
            subModulo
        ) {
            setDirty(true);
        } else {
            setDirty(false);
        }
    }, [
        isMultipleChoice,
        isCorrect,
        answerTitle,
        answerOptions,
        questionTitle,
        valuationQuestions,
        titulo,
        ambiente,
        modulo,
        descricao,
        subModulo
    ]);

    if (!user || !authenticated || user.role !== 'ADMIN') {
        return (
            <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
                <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
            </div>
        )
    }

    window.onbeforeunload = function () {
        return dirty ? "" : null;
    };

    const addAnswerOption = () => {
        if (!answerTitle) {
            alert("insira uma resposta válida");
            return;
        }
        if (answerOptions.filter(option => option.isCorrect === true).length > 0 && !isMultipleChoice && isCorrect === true) {
            alert('Para adicionar mais de uma resposta correta marque a caixa de multipla escolha');
            setIsCorrect(false);
            return;
        }
        setAnswerOptions(prev => ([
            ...prev,
            { answerTitle: answerTitle, isCorrect: isCorrect }
        ]));
        setAnswerTitle('');
        setIsCorrect(false);
    };

    const addQuestion = (title) => {
        event.preventDefault();

        if (!questionTitle) {
            alert('Você precisa adicionar um enunciado à questão');
            return;
        }
        else if (!answerOptions || answerOptions.length === 0) {
            alert('Adicione opções de resposta à esta questão');
            return;
        }
        else if (!answerOptions.some(option => option.isCorrect === true)) {
            alert('Adicione pelo menos uma resposta correta para esta questão');
            return;
        }
        else if (valuationQuestions.some(question => question.questionTitle === title)) {
            alert('Uma questão com este enunciado já foi cadastrada!');
            return;
        }

        setValuationQuestions(prev => ([
            ...prev,
            { isMultipleChoice: isMultipleChoice, questionTitle: questionTitle, answerOptions: answerOptions }
        ]));

        setQuestionTitle('');
        setAnswerOptions([]);
        setIsMultipleChoice(false);
        setOpen(false);
    }

    const handleIsMultipleChoiceCheck = (check) => {
        if (isMultipleChoice && answerOptions.filter(answerOption => answerOption.isCorrect === true).length > 1) {
            alert('Você já adicionou mais de uma resposta correta. Para desativar a multipla escolha, deixe apenas uma resposta correta.');
            return;
        }

        setIsMultipleChoice(check);
    }

    const handleQuestionClear = () => {
        setAnswerOptions([]);
        setQuestionTitle('');
        setAnswerTitle('');
        setIsCorrect(false);
        setIsMultipleChoice(false);
    }

    const removeAnswerOption = (index) => {
        setAnswerOptions(prev => prev.filter((_, i) => i !== index));
    };

    const publishValuation = async () => {
        try {
            setIsLoading(true);

            const publishResponse = await axios.post(API_ROUTES.PUBLISH_VALUATION, {
                titulo,
            });

            if (!publishResponse?.data) {
                alert('Algo deu errado durante a publicação!')
                console.log('Algo deu errado durante a publicação: ', response);
                return;
            }

            else {
                setDirty(false);
                setPostCreateValuation(false);
                alert('Avaliação publicada com sucesso!');
            }
        }
        catch (err) {
            alert('Ocoreu um erro ao publicar esta avaliação!');
            console.log('Ocorreu algum erro na publicação: ', err);
        }
        finally {
            setIsLoading(false);
        }
    };

    const createValuation = async () => {
        try {
            if (!titulo && !descricao && !ambiente && !modulo && !subModulo) {
                alert('Preencha todos os campos!');
                return;
            }
            else if (avaliacoes.filter(avaliacao => avaliacao.titulo === titulo).map((avaliacao) => (avaliacao.titulo)).length > 0) {
                alert('Uma avaliação com este titulo já foi cadastrada anteriormente');
                return;
            } else if (valuationQuestions.length < 1) {
                alert('Cadastre pelo menos uma questão');
                return;
            }

            setIsLoading(true);
            const createResponse = await axios({
                method: 'POST',
                url: API_ROUTES.CREATE_VALUATION,
                data: {
                    titulo,
                    descricao,
                    ambiente,
                    modulo,
                    subModulo,
                    valuationQuestions
                }
            });

            if (!createResponse?.data) {
                alert('Algo deu errado durante o cadastro!')
                console.log('Algo deu errado durante o cadstro: ', response);
                return;
            }

            else {
                setDirty(false);
                setPostCreateValuation(true);
            }
        }
        catch (err) {
            alert('Ocoreu um erro ao cadastrar esta avaliação!');
            console.log('Ocorreu algum erro no cadastro: ', err);
        }
        finally {
            setIsLoading(false);
        }
    };

    const removeQuestion = (index) => {
        setValuationQuestions(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="w-full h-full min-h-screen bg-gray-300">
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='flex justify-center items-center py-16'>

                    <Dialog open={open} onClose={() => { }}
                        className="relative z-10 select-none">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 h-full bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto py-20">
                            <div className="flex min-h-screen justify-center text-center items-center">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 w-5/6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                    <div className='w-full flex items-center justify-end p-8'>
                                        <h1
                                            onClick={() => {
                                                setOpen(false);
                                            }}
                                            className='text-lg font-bold hover:scale-115 transition-all duration-300 ease-in-out'>
                                            X
                                        </h1>
                                    </div>

                                    <div className='p-8'>

                                        <div className='flex flex-col justify-center items-center w-full gap-8'>
                                            <div className='flex flex-col justify-center items-center w-full gap-8'>
                                                <div className='w-full'>
                                                    <input
                                                        className="border-2 outline-none p-2 rounded-md w-full mb-8 sm:mb-0"
                                                        type="text"
                                                        placeholder="Enunciado"
                                                        value={questionTitle}
                                                        onChange={(e) => {
                                                            setQuestionTitle(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className='flex justify-start items-center w-full'>
                                                    <h1 className='px-2'>
                                                        Esta questão é de multipla escolha?
                                                    </h1>
                                                    <input
                                                        className='rounded-full size-3'
                                                        type='checkbox'
                                                        checked={isMultipleChoice}
                                                        onChange={(e) => {
                                                            handleIsMultipleChoiceCheck(e.target.checked);
                                                        }}
                                                    />
                                                </div>

                                                <div className='w-full md:flex justify-start items-center gap-8'>
                                                    <input
                                                        className="border-2 outline-none p-2 rounded-md w-full mb-8 sm:mb-0"
                                                        type="text"
                                                        placeholder="Resposta"
                                                        value={answerTitle}
                                                        onChange={(e) => {
                                                            setAnswerTitle(e.target.value);
                                                        }}
                                                    />
                                                </div>

                                                <div className='w-full flex flex-col items-center justify-center gap-8'>
                                                    <div className='flex justify-center items-center'>
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

                                            <div className='flex flex-col justify-center items-center gap-2 w-full text-center'>
                                                {answerOptions.length > 0 ? (
                                                    <h1 className='mb-4'>
                                                        Respostas para esta questão:
                                                    </h1>
                                                ) : 'As respostas que você cadastrar para esta questão, aparecerão aqui'}
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

                                            <div
                                                style={{
                                                    '--justify': answerOptions.length < 4 ? "end" : "between",
                                                }}
                                                className={`w-full flex items-center ${answerOptions.length < 4 ? 'justify-center' : 'justify-between'}`}>
                                                {answerOptions.length >= 4 && (
                                                    <button
                                                        className="flex justify-center w-1/2 sm:w-auto text-xs sm:text-base p-2 rounded-md  self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                                        onClick={() => {
                                                            addQuestion(questionTitle);
                                                        }}
                                                    >
                                                        <span>
                                                            Adicionar questão
                                                        </span>
                                                    </button>
                                                )}

                                                <button className='text-red-500 hover:scale-105 transition-all duration-300 ease-in-out'
                                                    onClick={() => {
                                                        handleQuestionClear();
                                                    }}
                                                >
                                                    Limpar
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog open={postCreateValuation} onClose={() => { }}
                        className="relative z-10 select-none">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 h-screen bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex h-screen justify-center text-center items-center">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white p-8 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 w-5/6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >

                                    <div className='flex flex-col justify-center items-center'>
                                        <div className='flex items-center justify-center mb-16'>
                                            <h1 className='text-center font-semibold'>
                                                Avaliação cadastrada com sucesso!!!
                                            </h1>
                                        </div>

                                        <div className='sm:flex items-center justify-center sm:w-3/4 space-y-8 sm:space-y-0 gap-8 w-full'>
                                            <div className='flex items-center justify-center sm:justify-between min-w-1/4'>
                                                <button
                                                    onClick={() => {
                                                        publishValuation();
                                                        navigate(APP_ROUTES.VALUATION_REPORTS);
                                                    }}
                                                    className='bg-green-500 p-2 rounded-lg shadow-lg/30 hover:scale-105 hover:bg-green-500/70 transition-all duration-300 ease-in-out'>
                                                    Publicar
                                                </button>
                                            </div>
                                            <div className='flex items-center justify-center min-w-1/4'>
                                                <button
                                                    onClick={() => {
                                                        publishValuation();
                                                        setTitulo('');
                                                        setAmbiente('');
                                                        setModulo('');
                                                        setSubModulo('');
                                                        setDescricao('');
                                                        setValuationQuestions([]);
                                                        setPostCreateValuation(false);
                                                    }}
                                                    className='bg-green-500 p-2 rounded-lg shadow-lg/30 hover:scale-105 hover:bg-green-500/70 transition-all duration-300 ease-in-out'>
                                                    Publicar e cadastrar outra
                                                </button>
                                            </div>
                                            <div className='flex items-center justify-center min-w-1/4'>
                                                <button
                                                    onClick={() => {
                                                        setTitulo('');
                                                        setAmbiente('');
                                                        setModulo('');
                                                        setSubModulo('');
                                                        setDescricao('');
                                                        setValuationQuestions([]);
                                                        setPostCreateValuation(false);
                                                    }}
                                                    className='bg-gray-800 text-white p-2 rounded-lg shadow-lg/30 hover:scale-105 hover:bg-gray-800/70 transition-all duration-300 ease-in-out'>
                                                    Cadastrar outra
                                                </button>
                                            </div>
                                            <div className='flex items-center justify-center min-w-1/4'>
                                                <button
                                                    onClick={() => {
                                                        setPostCreateValuation(false);
                                                        navigate(APP_ROUTES.LANDINGPAGE);
                                                    }}
                                                    className='p-2 text-red-500 hover:scale-105 transition-all duration-300 ease-in-out'>
                                                    Sair
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>

                    <div className='pb-16 w-full h-full flex items-center justify-center'>
                        <div className=" w-3/4 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col select-none">
                            <h2 className="text-center font-medium text-2xl mb-8">
                                Cadastre uma avaliação
                            </h2>
                            <div className="flex flex-1 flex-col justify-evenly gap-8">
                                <input
                                    className="border-2 outline-none p-2 rounded-md"
                                    type="text"
                                    placeholder="Titulo"
                                    value={titulo}
                                    required
                                    onChange={(e) => {
                                        setTitulo(e.target.value);
                                    }}
                                />

                                <input
                                    className="border-2 outline-none p-2 rounded-md"
                                    type="text"
                                    placeholder="Descrição"
                                    value={descricao}
                                    required
                                    onChange={(e) => {
                                        setDescricao(e.target.value);
                                    }}
                                />

                                <select
                                    type="text"
                                    onChange={(e) => {

                                        setAmbiente(e.target.value);
                                    }}
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
                                    onChange={(e) => {

                                        setModulo(e.target.value);
                                    }}
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
                                    onChange={(e) => {

                                        setSubModulo(e.target.value);
                                    }}
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

                                <div className='w-full flex justify-center items-center text-center'>
                                    {valuationQuestions.length > 0 ? (<h1>
                                        Questões desta avaliação:
                                    </h1>) : <h1>As questões que você adicionar à esta avaliação, irão aparecer aqui!!</h1>
                                    }
                                </div>

                                {valuationQuestions.map((question, index) => (
                                    <div
                                        key={index}
                                        className='flex  justify-between w-full bg-gray-300 p-4 rounded-lg gap-4 sm:flex flex-col'>
                                        <div className='flex flex-col items-center justify-center w-full'>
                                            <h1 className='w-full flex items-center justify-center pb-4'>
                                                {question.questionTitle}
                                            </h1>
                                            <div className='flex flex-col gap-2 w-full pr-2'>
                                                {question.answerOptions.map((answerOption, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 gap-8 bg-(--color)/70 rounded-lg"
                                                        style={{
                                                            '--color': answerOption.isCorrect === true ? "#84cc16" : isCorrectColor,
                                                        }}
                                                    >
                                                        <div className='w-full flex items-center justify-between gap-4'>
                                                            <h1 >{answerOption.answerTitle}</h1>
                                                            <h1 >{answerOption.isCorrect === true ? "certa" : "errada"}</h1>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-center gap-8'>
                                            <img
                                                className='size-5 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer'
                                                onClick={() => removeQuestion(index)}
                                                src={lixeira} />
                                        </div>

                                    </div>
                                ))}

                                <div className='w-full flex justify-center items-center'>
                                    <div
                                        onClick={() => {
                                            setOpen(true);
                                        }}
                                        className='rounded-full bg-gray-300 size-10 flex items-center justify-center cursor-pointer select-none shadow-lg/30 hover:scale-105 hover:shadow-lg/50 transition-all duration-300 ease-in-out'>
                                        <h1 className='text-2xl '>
                                            +
                                        </h1>
                                    </div>
                                </div>

                                <div className='w-full flex items-center justify-center'>

                                    <button
                                        className="flex justify-center p-2 rounded-md w-1/3 self-center bg-gray-800 text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out "
                                        onClick={createValuation}
                                    >
                                        {
                                            isLoading ?
                                                <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : <span> Cadastrar </span>
                                        }

                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default CreateValuation;
