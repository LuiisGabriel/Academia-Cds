import { useState } from 'react';
import { useAvaliacoes, useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { API_ROUTES } from '../utils/constants';
import axios from 'axios';
import pencilEdit from '../assets/pencil-edit.svg'
import lixeira from '../assets/lixeira.svg'

const ValuationReports = () => {
    const { user, authenticated } = useUser();
    const valuations = useAvaliacoes();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [ambiente, setAmbiente] = useState('');
    const [modulo, setModulo] = useState('');
    const [subModulo, setSubModulo] = useState('');
    const [questionTitle, setQuestionTitle] = useState('');
    const [isMultipleChoice, setIsMultipleChoice] = useState(false);
    const [answerTitle, setAnswerTitle] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [answerOptions, setAnswerOptions] = useState([]);
    const [valuationQuestions, setValuationQuestions] = useState([]);
    const [stage, setStage] = useState('');
    const [editValuationQuestions, setEditValuationQuestions] = useState(false);

    const [dirty, setIsDirty] = useState(false);
    const [open, setOpen] = useState(false);
    const [isAddQuestion, setIsAddQuestion] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isCorrectColor = "#dc2626";

    if (!user || !authenticated) {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    const publishValuation = async (titulo) => {
        if (valuationQuestions.length < 1) {
            alert('Adicione ao menos uma questão para esta avaliação antes de publica-la');
            return;
        }
        try {
            setIsLoading(true);
            const publishResponse = await axios.post(API_ROUTES.PUBLISH_VALUATION, {
                titulo,
            });

            if (!publishResponse?.data) {
                alert('Algo deu errado durante a publicação!')
                console.log('Algo deu errado durante a publicação: ', response);
                return;
            } else {
                window.location.reload();
            }

        } catch (err) {
            console.log('Ocorreu algum erro na publicação: ', err);
        } finally {
            setIsLoading(false);
        }
    };

    const unpublishValuation = async (titulo) => {
        try {
            setIsLoading(true);
            const unpublishResponse = await axios.post(API_ROUTES.UNPUBLISH_VALUATION, {
                titulo,
            });

            if (!unpublishResponse?.data) {
                alert('Algo deu errado durante a despublicação!')
                console.log('Algo deu errado durante a despublicação: ', response);
                return;
            } else {
                window.location.reload();
            }

        } catch (err) {
            console.log('Ocorreu algum erro na despublicação: ', err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteValuation = async (titulo) => {
        try {
            setIsLoading(true);
            const deleteResponse = await axios.post(API_ROUTES.DELETE_VALUATION, {
                titulo,
            });

            if (!deleteResponse?.data) {
                alert('Algo deu errado durante a remoção!')
                console.log('Algo deu errado durante a remoção: ', response);
                return;
            } else {
                window.location.reload();
            }

        } catch (err) {
            console.log('Ocorreu algum erro na remoção: ', err);
        } finally {
            setIsLoading(false);
        }
    };


    const addAnswerOption = () => {
        setIsDirty(true);
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
        setIsDirty(true);
        if (!questionTitle) {
            alert('Você precisa adicionar um enunciado à questão');
            return;
        }
        else if (!answerOptions || answerOptions.length === 0) {
            alert('Adicione opções de resposta à esta questão');
            return;
        }
        else if (!answerOptions?.some(option => option.isCorrect === true)) {
            alert('Adicione pelo menos uma resposta correta para esta questão');
            return;
        }
        else if (valuationQuestions.length > 0 && valuationQuestions?.some(question => question.questionTitle === title)) {
            alert('Uma questão com este enunciado já foi cadastrada!');
            return;
        }

        if (valuationQuestions.length > 0) {
            setValuationQuestions(prev => ([
                ...prev,
                { isMultipleChoice: isMultipleChoice, questionTitle: questionTitle, answerOptions: answerOptions }
            ]));
        } else {
            setValuationQuestions(prev => ([
                { isMultipleChoice: isMultipleChoice, questionTitle: questionTitle, answerOptions: answerOptions }
            ]));
        }


        setQuestionTitle('');
        setAnswerOptions([]);
        setIsMultipleChoice(false);
        setIsAddQuestion(false);
    }

    const handleIsMultipleChoiceCheck = (check) => {
        setIsDirty(true);
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
        setIsDirty(true);
        setAnswerOptions(prev => prev.filter((_, i) => i !== index));
    };

    const removeQuestion = (index) => {
        setIsDirty(true);
        setValuationQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const closeDialog = () => {
        if (!dirty) {
            setEditValuationQuestions(false);
            setOpen(false);
        } else {
            if (confirm('Você tem mudanças não salvas (Clique em "Ok" para descarta-las)')) {
                setEditValuationQuestions(false);
                setIsDirty(false);
                setOpen(false)
            } else {

            }
        }
    }

    const saveValuationEdits = async () => {
        if (!dirty) {
            setEditValuationQuestions(false);
            return;
        }
        if (stage === 'PUBLISHED' && valuationQuestions.length < 1) {
            alert('Esta avaliação está publicada, adicione ao menos uma questão ou torne ela privada.');
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(API_ROUTES.UPDATE_VALUATION_QUESTIONS, {
                titulo,
                valuationQuestions,
            });
            if (!response?.data) {
                alert('Algo deu errado durante o salvamento!')
                console.log('Algo deu errado durante o salvamento: ', response);
                return;
            } else {
                setIsDirty(false);
                setEditValuationQuestions(false);
                window.location.reload();
                alert('Alterações salvas com sucesso!!');
            }
        } catch (error) {
            console.error('Error updating valuation questions:', error.response?.data || error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className='bg-gray-300 w-full h-auto min-h-screen'>
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='flex flex-col justify-center items-center'>

                    <Dialog open={open} onClose={() => {
                        closeDialog();
                    }}
                        className="relative z-10 select-none">

                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto h-full">
                            <div className="flex min-h-full justify-center p-4 text-center items-center py-20">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden h-3/4 rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-9/10 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                    <div className="flex items-start w-full py-4 ">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left px-6 w-full">

                                            <div className='w-full flex justify-end items-center'>
                                                <h1
                                                className='font-bold hover:scale-105 transition-all duration-100 ease-in-out'
                                                onClick={()=>{
                                                    closeDialog();
                                                }}
                                                >X</h1>
                                            </div>

                                            <h1 as="h3" className="text-base font-semibold text-xl">
                                                {titulo}
                                            </h1>

                                            <h1 className='text-base text-sm'>
                                                {descricao}
                                            </h1>

                                            <div className='flex flex-col items-start justify-start py-4 space-y-4'>
                                                <div className='gap-2 flex items-center justify-start'>
                                                    <h1>
                                                        Ambiente:
                                                    </h1>
                                                    <h1 className='font-semibold'>
                                                        {ambiente}
                                                    </h1>
                                                </div>

                                                <div className='gap-2 flex items-center justify-start'>
                                                    <h1>
                                                        Modulo:
                                                    </h1>
                                                    <h1 className='font-semibold'>
                                                        {modulo}
                                                    </h1>
                                                </div>

                                                <div className='gap-2 flex items-center justify-start'>
                                                    <h1>
                                                        Sub-módulo:
                                                    </h1>
                                                    <h1 className='font-semibold'>
                                                        {subModulo}
                                                    </h1>
                                                </div>
                                            </div>

                                            <div className='flex items-center justify-between p-4'>
                                                <h1 className=''>
                                                    Videos presentes neste treinamento:
                                                </h1>
                                                <h1
                                                    onClick={() => {
                                                        setEditValuationQuestions(true);
                                                    }}
                                                    className='hover:scale-105 transition-all duration-300 ease-in-out'>
                                                    <img
                                                        className='size-4'
                                                        src={pencilEdit}
                                                    />
                                                </h1>
                                            </div>

                                            {valuationQuestions.length > 0 ? (<div className='space-y-4'>
                                                {valuationQuestions?.map((question, index) => (
                                                    <Menu
                                                        key={question.questionTitle}
                                                        as="div"
                                                        className="relative text-left gap-4 w-full bg-gray-300 p-4 rounded-lg sm:flex justify-between items-center"
                                                    >
                                                        <div className='px-2 w-full'>
                                                            <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold ring-inset hover:bg-gray-50">
                                                                <h1 className='text-left'>
                                                                    {question.questionTitle}
                                                                </h1>
                                                                <ChevronDownIcon aria-hidden="true" className=" size-6 text-gray-400" />
                                                            </MenuButton>

                                                            <MenuItems
                                                                transition
                                                                className="mt-2 rounded-md transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                                            >
                                                                <div className="flex flex-col gap-2 w-full ">

                                                                    <div>
                                                                        <div className="flex flex-col items-start justify-start pt-2 gap-4 bg-gray-300 rounded-lg ">
                                                                            {question.answerOptions.map((option, index) => (
                                                                                <div
                                                                                    key={index}
                                                                                    className="flex items-center justify-between p-2 gap-8 bg-(--color)/70 rounded-lg w-full"
                                                                                    style={{
                                                                                        '--color': option.isCorrect === true ? "#84cc16" : "#dc2626",
                                                                                    }}
                                                                                >
                                                                                    <h1>{option.answerTitle}</h1>
                                                                                    <h1>{option.isCorrect === true ? "certa" : "errada"}</h1>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            </MenuItems>
                                                        </div>
                                                        {editValuationQuestions && (
                                                            <div className='flex items-center justify-center gap-8'>
                                                                <img
                                                                    className='size-5 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer'
                                                                    onClick={() => removeQuestion(index)}
                                                                    src={lixeira} />
                                                            </div>
                                                        )}
                                                    </Menu>


                                                ))}
                                            </div>) : (
                                                <h1 className='w-full text-center'>
                                                    Esta avaliação não possui questões
                                                </h1>
                                            )}

                                            {editValuationQuestions && (
                                                <div className='flex items-center justify-center pt-4'>
                                                    <div
                                                        onClick={() => {
                                                            setIsAddQuestion(true);
                                                        }}
                                                        className='rounded-full bg-gray-300 size-10 flex items-center justify-center cursor-pointer select-none shadow-lg/30 hover:scale-105 hover:shadow-lg/50 transition-all duration-300 ease-in-out'>
                                                        <h1 className='text-2xl '>
                                                            +
                                                        </h1>
                                                    </div>
                                                </div>
                                            )}

                                            {editValuationQuestions && (<div className='flex items-center justify-center pt-8'>
                                                <button
                                                    onClick={() => {
                                                        saveValuationEdits();
                                                    }}
                                                    className='rounded-lg bg-gray-800 p-2 text-white hover:scale-105 hover:bg-gray-800/70'>
                                                    Salvar
                                                </button>
                                            </div>)}


                                            <div className='flex items-center justify-between pt-8'>
                                                {stage === 'PUBLISHED' ? (
                                                    <button
                                                        className="flex justify-center w-1/2 sm:w-auto text-xs sm:text-base p-2 rounded-md  self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                                        onClick={() => {
                                                            unpublishValuation(titulo);
                                                        }}
                                                    >
                                                        <span>
                                                            Tornar privado
                                                        </span>
                                                    </button>
                                                ) :
                                                    <button
                                                        className="flex justify-center w-1/2 sm:w-auto text-xs sm:text-base p-2 rounded-md  self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                                        onClick={() => {
                                                            publishValuation(titulo);

                                                        }}
                                                    >
                                                        <span>
                                                            Publicar
                                                        </span>
                                                    </button>
                                                }

                                                <button className='text-red-500 hover:scale-105 transition-all duration-300 ease-in-out'
                                                    onClick={() => {
                                                        deleteValuation(titulo);
                                                    }}
                                                >
                                                    Deletar
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>


                    <Dialog open={isAddQuestion} onClose={() => {
                        setIsAddQuestion(false);
                    }}
                        className="relative z-10 select-none">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 h-full bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto py-20">
                            <div className="flex min-h-screen justify-center text-center items-center">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white p-8 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 w-5/6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >

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
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>



                    <div className=' w-8/9 py-8'>
                        <div className='flex flex-col items-center justify-center p-8'>
                            <h1 className='text-xl text-center font-semibold'>
                                Aqui você encontrará todas as avaliações do CDS Academy.
                            </h1>
                            <h1 className='text-sm text-center'>
                                Caso queira informações mais detalhadas ou realizar alguma edição, basta clicar sobre a avaliação desejada!
                            </h1>
                        </div>
                        <div className='flex flex-col justify-start w-full gap-8' id='form' >
                            {valuations.map((valuation) => (
                                <div
                                    key={valuation.titulo}
                                    onClick={() => {
                                        setTitulo(valuation.titulo);
                                        setDescricao(valuation.descricao);
                                        setAmbiente(valuation.ambiente);
                                        setModulo(valuation.modulo);
                                        setSubModulo(valuation.subModulo);
                                        setValuationQuestions(valuation.valuationQuestions);
                                        if (valuation.documentInStages.length > 0) {
                                            setStage('PUBLISHED');
                                        } else {
                                            setStage('DRAFT');
                                        }
                                        setOpen(true);
                                    }}
                                    className='bg-white p-4 rounded-lg'>
                                    <div className='text-md font-semibold pb-4'>
                                        {valuation.documentInStages.length > 0 ? (
                                            'Publicada'
                                        ) : 'Privado'}
                                    </div>
                                    <h1 className='text-xl font-semibold'>
                                        {valuation.titulo}
                                    </h1>
                                    <h1 className='text-sm'>
                                        {valuation.descricao}
                                    </h1>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ValuationReports;
