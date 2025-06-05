import { useEffect, useState } from 'react';
import { useUser } from '../lib/customHooks';
import Navbar from '../components/Navbar';
import { APP_ROUTES } from '../utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../utils/constants';
import axios from 'axios';

const Valuation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { ambiente, modulo, subModulo, valuationId, valuationTitle, valuationDescription, valuationQuestions } = location.state || { ambiente: '', modulo: '', subModulo: '', valuationId: false, valuationTitle: '', valuationDescription: '', valuationQuestions: [] };

    const { user, authenticated } = useUser();
    const email = user?.email;

    const [filteredQuestions, setFilteredQuestions] = useState(() => {
        const savedQuestions = localStorage.getItem(`filteredQuestions-${valuationId}`);
        return savedQuestions ? JSON.parse(savedQuestions) : [];
    });

    const [dirty, setDirty] = useState(false);
    const [answeredValuation, setAnsweredValuation] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    useEffect(() => {
        if (!valuationId) {
            navigate(APP_ROUTES.VALUATIONS);
        }

        if (filteredQuestions.length === 0 && valuationId) {
            const newFilteredQuestions = valuationQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

            setFilteredQuestions(newFilteredQuestions);
            localStorage.setItem(`filteredQuestions-${valuationId}`, JSON.stringify(newFilteredQuestions));
        }
    }, [valuationId, valuationQuestions, ambiente, modulo, subModulo, filteredQuestions, navigate]);


    if (!user || !authenticated) {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    window.onbeforeunload = function () {
        return dirty ? "" : null;
    };

    const handleAnswerOptionClick = (questionIndex, answerIndex, isMultipleChoice) => {
        if (isMultipleChoice) {

        }
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: answerIndex,
        }));
    };

    const handleFormClear = () => {
        setAnsweredValuation([]);
        document.getElementById('form').reset();
        setDirty(false);
    }

    const handleFormSubmit = async () => {
        const allAnswered = filteredQuestions.every((_, index) => selectedAnswers[index] !== undefined);

        if (!allAnswered) {
            alert("Por favor, responda todas as perguntas.");
            return;
        }

        const results = valuationQuestions
            .filter((_, index) => selectedAnswers[index] !== undefined)
            .map((question, index) => ({
                question: question.questionTitle,
                isCorrect: question.answerOptions[selectedAnswers[index]]?.isCorrect || false,
            }));

        const correctAnswersCount = results.filter((result) => result.isCorrect).length;

        handleFormClear();
        setDirty(false);

        const updatedAnsweredValuation = [
            ...answeredValuation,
            { ambiente: ambiente, modulo: modulo, subModulo: subModulo, results: results, score: correctAnswersCount, valuationId: valuationId, valuationTitle: valuationTitle, valuationDescription: valuationDescription },
        ]
        setAnsweredValuation(updatedAnsweredValuation);

        try {
            const mergedAnsweredValuations = [
                ...(user.answeredValuations || []),
                ...updatedAnsweredValuation,
            ];

            const response = await axios.post(API_ROUTES.UPDATE_USER_ANSWERED_VALUATIONS, {
                email,
                answeredValuations: mergedAnsweredValuations,
            });

            if (response?.data) {
                localStorage.removeItem(`filteredQuestions-${valuationId}`);
                navigate(APP_ROUTES.POST_VALUATION, {
                    state: {
                        score: correctAnswersCount,
                        totalQuestions: results.length,
                        results: results,
                        valuationId: valuationId,
                    }
                });
            }

        } catch (error) {
            console.error('Error updating answered valuations:', error.response?.data || error);
        }

    };

    return (
        <>
            <div className='bg-gray-300 w-full h-auto min-h-screen'>
                <nav className="sticky top-0 z-50"><Navbar /></nav>

                <div className='flex flex-col justify-center items-center'>
                    <div className=' w-8/9 py-8'>
                        <form className='flex flex-col justify-start w-full select-none' id='form' >
                            {filteredQuestions.map((question, questionIndex) => (
                                <div className='p-4' key={questionIndex}>
                                    <div className='p-8 bg-white rounded-lg '>

                                        <h1 className='w-full flex items-center justify-center'>
                                            Questão {questionIndex + 1}
                                        </h1>
                                        <div className=' w-full px-4 py-8 gap-2'>
                                            {question.isMultipleChoice && (<h1 className='text-[12px] text-red-500'>
                                                multipla escolha*
                                            </h1>)}
                                            <h1 className='text-lg '>
                                                {question.questionTitle}
                                            </h1>
                                        </div>

                                        {question.answerOptions.map((answerOption, answerIndex) => (
                                            <div className='flex items-center gap-4' key={answerIndex}>
                                                <input
                                                    className="border-2 outline-none p-2 size-4 rounded-full"
                                                    type={`${question.isMultipleChoice ? "checkbox" : 'radio'}`}
                                                    name={`question-${questionIndex}`}
                                                    required
                                                    onClick={() => {
                                                        setDirty(true);
                                                        handleAnswerOptionClick(questionIndex, answerIndex, question.isMultipleChoice);
                                                    }}
                                                />
                                                {answerOption.answerTitle}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            ))}

                            <div className='flex justify-between items-center pt-4 px-4 w-3/3'>
                                <button
                                    className='bg-gray-800 rounded-lg p-2 text-white hover:bg-gray-700 hover:scale-102 shadow-lg/20 hover:shadow-lg/30 transition-all duration-300 ease-in-out'
                                    onClick={() => {
                                        event.preventDefault();
                                        handleFormSubmit();
                                    }}
                                >
                                    entregar
                                </button>

                                <button className='text-red-500 hover:scale-105 transition-all duration-300 ease-in-out'
                                    onClick={() => {
                                        event.preventDefault();
                                        handleFormClear();
                                    }}
                                >
                                    limpar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Valuation;
