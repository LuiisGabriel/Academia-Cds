import react from "react";
import Navbar from "./Navbar";
import { APP_ROUTES } from "../utils/constants";
import Otica from '../assets/Ótica.jpg';
import Fabrica from '../assets/Fabrica.jpg';
import PetShop from '../assets/PetShop.jpg';
import Light from '../assets/Light.jpg';
import FrenteDeLoja from '../assets/FrenteDeLoja.jpg';

const relatorios = [

    {
        id: 1,
        href: '',
        name: "Usuários",
        imageSrc: Otica,
        descricao: "Aqui você poderá ter acesso aos usuários existentes e editar algumas de suas informações."
    },

    {
        id: 2,
        href: '',
        name: "Treinamentos",
        imageSrc: Light,
        descricao: "Aqui você poderá visualizar e modificar os treinamentos disponiveis no CDS Academy."
    },

    {
        id: 3,
        href: '',
        name: "Avaliações",
        imageSrc: FrenteDeLoja,
        descricao: "Aqui você poderá visualizar e modificar as avaliações que estarão disponiveis no CDS Academy."
    }

];

const Reports = () => {

    return (
        <>
            <div className="bg-gray-300  h-auto min-h-screen ">
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className="flex flex-col items-center pt-16 select-none">
                    <div className=" sm:text-5xl pb-10">
                        <h1 className="text-5xl text-center font-bold tracking-tight p-8">
                            Aqui estão disponiveis os relatórios do CDS Academy!
                        </h1>
                    </div>
                    <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-4 xl:gap-x-8 py-8 px-8">
                        {relatorios.map((relatorio) => (
                            <a key={relatorio.id} href={relatorio.href} className="group">
                                <div className="bg-white h-full flex flex-col rounded-lg pb-8 group-hover:scale-102 shadow-xl/30 transition duration-300 ease-in-out">
                                    <img
                                        className="aspect-video w-full rounded-t-lg group-hover:opacity-75 xl:aspect-video"
                                        src={relatorio.imageSrc}
                                    />
                                    <h3 className="text-center mt-8">{relatorio.name}</h3>
                                    <h1 className="text-center text-sm text-gray-700 mt-4 px-4">{relatorio.descricao}</h1>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reports;
