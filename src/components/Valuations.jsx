import React, { useEffect } from 'react';
import { useQuestions, useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { useState } from 'react';

const Valuations = () => {
  const { user, authenticated } = useUser();
  const questions = useQuestions();

  const questionColor = '#1f2937';
  const questionHoverColor = '#374151';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  const handleAnswerOptionClick = (isCorrect) => {
    if (answeredQuestions.map(option => option.title).includes(questions[currentQuestion].title)) {
      return;
    }
    if (isCorrect) {
      setScore(score + 1)
    }
    setAnsweredQuestions(prev => ([
      ...prev,
      { title: questions[currentQuestion].title, isRight: isCorrect }
    ]));
    console.log(answeredQuestions);
  }

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    }
    return;
  }

  const handlePrevQuestion = () => {
    const prevQuestion = currentQuestion - 1
    if (prevQuestion > -1) {
      setCurrentQuestion(prevQuestion);
    }
    return;
  }

  return (
    <>
      <div className='bg-gray-300 w-full h-auto min-h-screen'>
        <nav className="sticky top-0 z-50"><Navbar /></nav>
        <div className='flex justify-center items-center pt-8'>
          <h1>você acertou {score} questões de {questions.length}</h1>
        </div>

        <div className='lg:flex'>
          <div className='w-full min-w-3/4 md:flex justify-center items-center p-8'>
            <div className=" h-full shadow-lg rounded-md bg-white flex flex-col justify-center items-start p-8 w-full select-none">
              <h2 className="text-center font-medium text-2xl ">
                Questão {currentQuestion + 1}
              </h2>

              <div className="flex flex-1 flex-col justify-start items-start py-8 ">
                {questions[currentQuestion] ? (
                  <>
                    <h1 className='p-8 flex text-lg'>
                      {questions[currentQuestion].title}
                    </h1>
                    <form className='space-y-10 flex flex-col justify-start'>
                      {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                        <div className='flex items-center gap-4' key={index}>
                          <input
                            className="border-2 outline-none p-2 size-4"
                            type="radio"
                            name={`question-${currentQuestion}`}
                            onClick={() => {
                              handleAnswerOptionClick(answerOption.isCorrect);
                            }}
                          />
                          {answerOption.answerTitle}
                        </div>
                      ))}
                    </form>
                  </>
                ) : (
                  <h1 className='p-8 flex text-lg'>Nenhuma questão disponível</h1>
                )}
              </div>

              <div className='w-full flex items-center justify-center pt-16 '>
                <div className='flex items-center justify-center w-full'>
                  <div className=' flex justify-between items-center gap-8'>
                    <button
                      className='text-xs  bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out '
                      onClick={() => {
                        handlePrevQuestion();
                      }}
                    >
                      Questão anterior
                    </button>

                    <button
                      className='text-xs  bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out '
                      onClick={() => {
                        handleNextQuestion();
                      }}
                    >
                      Próxima questão
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full min-w-1/4 flex flex-col justify-center items-center p-8 order-2 md:order-1 '>
            <div className='h-full flex-col flex justify-center w-full'>
              <div className='flex-col flex gap-y-7 w-full select-none'>
                {questions.map((question, index) => (
                  <div
                    style={{
                      '--color': index === currentQuestion ? '#334155' : questionColor,
                      '--hoverColor': index === currentQuestion ? '#475569' : questionHoverColor,
                    }}
                    className='bg-(--color) hover:bg-(--hoverColor) hover:scale-102 transition-all duration-300 ease-in-out p-6 rounded-lg min-h-15 flex items-center justify-between'
                    onClick={() => {
                      setCurrentQuestion(index)
                    }}
                  >
                    <h1 className='text-white'> Questão {index + 1}</h1>
                    <div
                      style={{
                        display: answeredQuestions.some(answer => answer.title === question.title) ? 'block' : 'none',
                      }}
                      className='size-5 bg-white rounded-full flex items-center justify-center px-1'>
                        <h1 className='items-center'>✔</h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
export default Valuations;