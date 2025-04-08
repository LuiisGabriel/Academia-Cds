import React from 'react';
import { useUser } from '../../../lib/customHooks';
import Navbar from '../../Navbar';
import { APP_ROUTES } from '../../../utils/constants';
import Retaguarda from '../../../assets/Retaguarda.jpg'

const subModulos = [
    {
        id: 1,
        name: 'Cadastros',
        href: APP_ROUTES.WEB_RETAGUARDA_CADASTROS,
        imageSrc: Retaguarda,
        imageAlt: 'Cadastros',

    },
    {
        id: 2,
        name: 'Operações',
        href: APP_ROUTES.WEB_RETAGUARDA_OPERACOES,
        imageSrc: Retaguarda,
        imageAlt: 'Operações',

    },
    {
        id: 3,
        name: 'Financeiro',
        href: APP_ROUTES.WEB_RETAGUARDA_FINANCEIRO,
        imageSrc: Retaguarda,
        imageAlt: 'Financeiro',

    },


]

const RetaguardaWeb = () => {
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
                        {subModulos.map((subModulo) => (
                            <a key={subModulo.id} href={subModulo.href} className="group">
                                <img
                                    alt={subModulo.imageAlt}
                                    src={subModulo.imageSrc}
                                    className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:scale-102 group-hover:opacity-75 xl:aspect-7/8"
                                />
                                <h3 className="text-center mt-4 text-sm text-gray-700">{subModulo.name}</h3>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
export default RetaguardaWeb;