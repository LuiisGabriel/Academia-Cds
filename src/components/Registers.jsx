import Navbar from "./Navbar";
import { APP_ROUTES } from "../utils/constants";
import Otica from '../assets/Ótica.jpg';
import Light from '../assets/Light.jpg';
import FrenteDeLoja from '../assets/FrenteDeLoja.jpg';
import { useUser } from "../lib/customHooks";

const cadastros = [

    {
        id: 1,
        href: APP_ROUTES.CREATE_USER,
        name: "Cadastrar usuário",
        imageSrc: Otica,
        descricao: "Aqui você poderá cadastar novos usuários e sua posição."
    },

    {
        id: 2,
        href: APP_ROUTES.CREATETRAINMENT,
        name: "Cadastrar treinamento",
        imageSrc: Light,
        descricao: "Aqui você poderá cadastrar os treinamentos que estarão disponiveis no CDS Academy."
    },

    {
        id: 3,
        href: APP_ROUTES.CREATEVALUATION,
        name: "Cadastrar avaliação",
        imageSrc: FrenteDeLoja,
        descricao: "Aqui você poderá cadastrar as avaliações que estarão disponiveis no CDS Academy."
    }

];

const Registers = () => {

    const { user, authenticated } = useUser();

    if (!user || !authenticated || user.role !== 'ADMIN') {
        return (
            <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
                <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
            </div>
        )
    }

    return (
        <>
            <div className="bg-gray-300  h-auto min-h-screen ">
                <nav className="sticky top-0 z-5"><Navbar /></nav>
                <div className="flex flex-col items-center pt-16 select-none">
                    <div className=" sm:text-5xl pb-10">
                        <h1 className="text-5xl text-center font-bold tracking-tight p-8">
                            Aqui estão disponiveis os cadastros para o CDS Academy!
                        </h1>
                    </div>
                    <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-4 xl:gap-x-8 py-8 px-8">
                        {cadastros.map((cadastro) => (
                            <a
                                key={cadastro.name}
                                href={cadastro.href}
                                className="group">
                                <div className="bg-white h-full flex flex-col rounded-lg pb-8 group-hover:scale-102 shadow-xl/30 transition duration-300 ease-in-out">
                                    <img
                                        className="aspect-video w-full rounded-t-lg group-hover:opacity-75 xl:aspect-video"
                                        src={cadastro.imageSrc}
                                    />
                                    <h3 className="text-center mt-8">{cadastro.name}</h3>
                                    <h1 className="text-center text-sm text-gray-700 mt-4 px-4">{cadastro.descricao}</h1>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Registers;