import React from 'react';
import { useUser } from '../../lib/customHooks';
import Navbar from '../Navbar';
import { APP_ROUTES } from '../../utils/constants';
import Retaguarda from '../../assets/retaguarda.jpg';
import FrenteDeLoja from '../../assets/frentedeloja.jpg';

const modulos = [
    {
        id: 1,
        name: 'Retaguarda',
        href: APP_ROUTES.WEB_RETAGUARDA,
        imageSrc: Retaguarda,
        imageAlt: 'Retaguarda',

    },
    {
        id: 2,
        name: 'Frente de loja',
        href: APP_ROUTES.WEB_FRENTEDELOJA,
        imageSrc: FrenteDeLoja,
        imageAlt: 'Frente de loja',

    },

]

const CdsWeb = () => {
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
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
                        {modulos.map((modulo) => (
                            <a key={modulo.id} href={modulo.href} className="group">
                                <img
                                    alt={modulo.imageAlt}
                                    src={modulo.imageSrc}
                                    className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:scale-102 group-hover:opacity-75 xl:aspect-7/8"
                                />
                                <h3 className="text-center mt-4 text-sm text-gray-700">{modulo.name}</h3>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
export default CdsWeb;