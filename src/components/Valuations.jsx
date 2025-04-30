import React, { useEffect } from 'react';
import { useQuestions, useUser } from '../lib/customHooks';
import Navbar from './Navbar';
import { useState } from 'react';

// neededVideos.every(r => watchedVideos.includes(r))

const Valuations = () => {
  const { user, authenticated } = useUser();
  const questions = useQuestions();

  const initialQuestion = questions[0];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionTitle, setQuestionTitle] = useState('');
  const [answerOptions, setAnswerOptions] = useState([]);

  useEffect(() => {
    if (initialQuestion) {
      setAnswerOptions(initialQuestion.answerOptions);
      setQuestionTitle(initialQuestion.title);
    }
  }, [initialQuestion]);

  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  const handleProximaQuestao = () => {
    if (questionIndex + 1 < questions.length) {
      const question = questions[questionIndex + 1];
      setAnswerOptions(question.answerOptions);
      setQuestionTitle(question.title);
      setQuestionIndex(questionIndex + 1)
    }
    return;
  }

  const handleQuestaoAnterior = () => {

    if (questionIndex > 0) {
      const question = questions[questionIndex - 1];
      setAnswerOptions(question.answerOptions);
      setQuestionTitle(question.title);
      setQuestionIndex(questionIndex - 1)
    }
    return;
  }

  return (
    <>

      <div className='bg-gray-300 w-full h-auto min-h-screen'>
        <nav className="sticky top-0 z-50"><Navbar /></nav>
        <div className='py-16 lg:flex'>

          <div className='w-full min-w-3/4 md:flex justify-center items-center p-8 order-1 md:order-2'>
            <div className=" h-full shadow-lg rounded-md bg-white flex flex-col justify-center items-start p-8 w-full ">
              <h2 className="text-center font-medium text-2xl ">
                Questão {questionIndex + 1}
              </h2>

              <div className="flex flex-1 flex-col justify-center items-start">
                <h1 className='p-8 flex '>
                  {questionIndex + 1} ) {questionTitle}
                </h1>
                <form className='space-y-10 flex flex-col justify-start'>
                  {answerOptions.map((answerOption) => (
                    <div className='flex items-center gap-4'>
                      <input
                        className="border-2 outline-none p-2 size-4"
                        type="checkbox"
                      />
                      {answerOption.answerTitle}
                    </div>
                  ))}
                </form>
              </div>

              <div className='w-full flex items-center justify-center pt-16 order-1 md:order-2'>
                <div className='flex items-center justify-center w-full'>
                  <div className=' flex justify-between items-center gap-8'>
                    <button
                      className='text-xs  bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out '
                      onClick={handleQuestaoAnterior}
                    >
                      Questão anterior
                    </button>

                    <button
                      className='text-xs  bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out '
                      onClick={handleProximaQuestao}
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
              <div className='flex-col flex gap-y-7 w-full'>
                {questions.map((question, index) => (
                  <div
                    className='bg-gray-800 hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out p-2 rounded-lg min-h-15 flex items-center justify-between'
                    onClick={() => {
                      setAnswerOptions(question.answerOptions);
                      setQuestionTitle(question.title);
                      setQuestionIndex(index);
                    }}
                  >
                    <h1 className='text-white'> Questão {index + 1}</h1>
                    <div className='size-5 bg-gray-300 rounded-full mx-4'></div>
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