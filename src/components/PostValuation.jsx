import Navbar from "./Navbar";
import { APP_ROUTES } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";

const PostValuation = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { score, totalQuestions, valuationId, results } = location.state || { score: 0, totalQuestions: 0, isSubmitted: false, results: [] };
    const isCorrectColor = "#dc2626"

    useEffect(() => {
        if (!valuationId) {
            navigate(APP_ROUTES.VALUATIONS);
        }
    }, [valuationId]);

    return (
        <>
            <div className="bg-gray-300 h-auto min-h-screen">
                <nav className="sticky top-0 z-5"><Navbar /></nav>
                <div className="flex items-center justify-center py-16">

                    <div className="bg-white rounded-lg  w-3/4 flex flex-col items-center justify-center py-8 select-none">

                        <div className="flex flex-col justify-center items-center">
                            <div className="bg-green-500 rounded-full size-20 flex items-center justify-center text-white text-2xl ">
                                ✔
                            </div>
                            <h1 className="text-xl font-bold text-center pt-4">
                                Você concluiu esta avaliação !!
                            </h1>
                        </div>
                        <div className="p-8">
                            <h1 className="text-3xl pt-4 text-center font-bold">
                                sua nota foi:  {score}/{totalQuestions}
                            </h1>

                            <h1 className="py-4">desempenho:</h1>

                            <div className="flex flex-col mt-4 gap-4 w-full">
                                {results.map((result, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 gap-8 bg-(--color)/70 rounded-lg"
                                        style={{
                                            '--color': result.isCorrect === true ? "#84cc16" : isCorrectColor,
                                        }}
                                    >
                                        <h1>{result.question}</h1>
                                        <h1>{result.isCorrect === true ? "certa" : "errada"}</h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center py-4">

                            <h1 className="text-xl pt-4 text-center font-semibold p-8">
                                {score / totalQuestions == 1 ? "Nossa você foi perfeito(a)!" : score / totalQuestions >= 0.7 ? "Parabéns você foi muito bem!" : score / totalQuestions >= 0.4 ? "Você pode melhorar!" : "Seu desempenho foi abaixo do esperado!"}
                            </h1>

                            <div className="rounded-full size-30 bg-green-500 flex items-center justify-center text-center">
                                Aqui um desenho bonitinho
                            </div>
                        </div>
                        <button
                            className="text-sm bg-cdsBlue rounded-lg p-2 mt-8 text-white hover:scale-102 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                            onClick={() => {
                                navigate(APP_ROUTES.VALUATIONS);
                            }}
                        >
                            Voltar para as avaliações
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

};

export default PostValuation;