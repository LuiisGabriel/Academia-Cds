import { useState } from 'react';
import { useAvaliacoes, useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { API_ROUTES } from '../utils/constants';
import axios from 'axios';

const ValuationReports = () => {
    const { user, authenticated } = useUser();
    const valuations = useAvaliacoes();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [ambiente, setAmbiente] = useState('');
    const [modulo, setModulo] = useState('');
    const [subModulo, setSubModulo] = useState('');
    const [valuationQuestions, setValuationQuestions] = useState([]);
    const [stage, setStage] = useState('');

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!user || !authenticated) {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    const publishValuation = async (titulo) => {
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

    return (
        <>
            <div className='bg-gray-300 w-full h-auto min-h-screen'>
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='flex flex-col justify-center items-center'>

                    <Dialog open={open} onClose={() => {
                        setOpen(false);
                    }}
                        className="relative z-10 select-none">

                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto h-full">
                            <div className="flex min-h-full justify-center p-4 text-center items-center p-0">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden h-3/4 rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-9/10 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                    <div className="flex items-start w-full py-8 ">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left px-8 w-full">

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

                                            <h1 className='py-4'>
                                                Questões presentes nesta avalição:
                                            </h1>

                                            <div className='space-y-4'>
                                                {valuationQuestions?.map((question) => (
                                                    <Menu
                                                        key={question.questionTitle}
                                                        as="div"
                                                        className="relative text-left w-full bg-gray-300 p-4 rounded-lg sm:flex justify-between items-center"
                                                    >
                                                        <div className='px-2 w-full sm:order-1 order-2'>
                                                            <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold ring-inset hover:bg-gray-50">
                                                                {question.questionTitle}
                                                                <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
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

                                                    </Menu>
                                                ))}
                                            </div>

                                            <div className='flex items-center justify-between pt-8'>

                                                {stage === 'PUBLISHED' ? (
                                                    <button
                                                        className="flex justify-center w-1/2 sm:w-auto text-xs sm:text-base p-2 rounded-md  self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                                        onClick={() => {
                                                            unpublishValuation(titulo);
                                                        }}
                                                    >
                                                        <span>
                                                            Despublicar
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
                                        ) : 'Salva'}
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