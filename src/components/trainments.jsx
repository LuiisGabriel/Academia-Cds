import React from 'react';
import Navbar from './Navbar';
import { APP_ROUTES } from '../utils/constants';
import CDSWEB from '../assets/CDSWEB.png';
import CDSDESKTOP from '../assets/CDSDESKTOP.png';
import { useUser } from '../lib/customHooks';

const treinamentos = [
    {
        id: 1,
        name: 'CDS web',
        href: APP_ROUTES.CDSWEB,
        imageSrc: CDSWEB,
        imageAlt: 'CDS web',

    },
    {
        id: 2,
        name: 'CDS desktop',
        href: APP_ROUTES.CDSDESKTOP,
        imageSrc: CDSDESKTOP,
        imageAlt: 'CDS desktop',

    },

]

const Trainments = () => {
    const { user, authenticated } = useUser();
    if (!user || !authenticated) {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }
    return (
        <>
            <nav className="sticky top-0 z-50"><Navbar /></nav>
            <div className="bg-gray-300  h-auto min-h-screen">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Treinamentos</h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8 ">
                        {treinamentos.map((treinamento) => (
                            <a key={treinamento.id} href={treinamento.href} className="group">
                                <img
                                    alt={treinamento.imageAlt}
                                    src={treinamento.imageSrc}
                                    className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:scale-102 group-hover:opacity-75 xl:aspect-7/8"
                                />
                                <h3 className="text-center mt-4 text-sm text-gray-700">{treinamento.name}</h3>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Trainments;