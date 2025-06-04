
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES, } from '../utils/constants';
import validator from 'validator';
import Navbar from './Navbar';
import { useUser } from '../lib/customHooks';

const CreateUser = () => {

    const { user, authenticated } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!user || !authenticated || user.role !== 'ADMIN') {
        return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
            <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
        </div>;
    }

    const signUp = async () => {
        try {
            setIsLoading(true);
            if (!validator.isEmail(email)) {
                alert('Digite um email válido')
                return;
            }
            const response = await axios({
                method: 'POST',
                url: API_ROUTES.SIGN_UP,
                data: {
                    email,
                    password,
                    firstname,
                    lastname,
                    role,
                }
            });
            if (!response?.data?.token) {
                console.log('Algo deu errado durante o cadstro: ', response);
                return;
            }
            else {
                alert("Usuário cadastrado com sucesso!!!")
                setEmail('');
                setFirstname('');
                setLastname('');
                setPassword('');
                setRole('');
            }
        }
        catch (err) {
            if (err.response.data.message == undefined) {
                alert('preencha todos os campos!')
            }
            if (err.response.data.message == 'Este email já está sendo utilizado') {
                alert('Este email já está sendo utilizado')
            }
            else {
                console.log('Ocorreu algum erro no cadastro: ', err.response.data.message);
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <>

            <div className="w-full min-h-screen h-auto h-full bg-gray-300">
                <nav className="sticky top-0 z-50"><Navbar /></nav>
                <div className='flex flex-col items-center pt-16'>
                    <div className=" w-3/4 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col">
                        <h2 className="text-center font-medium text-2xl mb-8">
                            Cadastre um novo usuário
                        </h2>
                        <form className="flex flex-1 flex-col justify-evenly gap-8">
                            <input
                                className="border-2 outline-none p-2 rounded-md"
                                type="text"
                                placeholder="Nome"
                                value={firstname}
                                required
                                onChange={(e) => { setFirstname(e.target.value); }}
                            />
                            <input
                                className="border-2 outline-none p-2 rounded-md"
                                type="text"
                                placeholder="Sobre Nome"
                                value={lastname}
                                onChange={(e) => { setLastname(e.target.value); }}
                            />
                            <input
                                className="border-2 outline-none p-2 rounded-md"
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                required
                                onChange={(e) => { setEmail(e.target.value); }}
                            />
                            <input
                                className="border-2 outline-none p-2 rounded-md"
                                type="password"
                                placeholder="*******" value={password}
                                required
                                onChange={(e) => { setPassword(e.target.value); }}
                            />

                            <select
                                type="text"
                                onChange={(e) => { setRole(e.target.value); }}
                                value={role}
                                className="border-2 outline-none p-2 rounded-md"
                            >
                                <option disabled={true} value="">Defina o tipo do usuário</option>

                                <option value='USER'>
                                    Usuário
                                </option>

                                <option value='ADMIN'>
                                    Administrador
                                </option>

                            </select>
                            <button
                                className="flex justify-center p-2 rounded-md w-1/2 self-center bg-gray-800 text-white hover:bg-gray-700 hover:scale-102 transition-all duration-300 ease-in-out"
                                onClick={signUp}
                            >
                                {
                                    isLoading ?
                                        <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : <span> Cadastrar </span>
                                }
                                
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateUser;