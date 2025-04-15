import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import validator from "validator";
import CdsSistemasFrente from '../assets/CdsSistemasFrente.jpg';

const SignUp = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [role] = useState('USER');
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async () => {
    try {
      if (!validator.isEmail(email)) {
        return;
      }
      setIsLoading(true);
      const response = await axios({
        method: 'POST',
        url: API_ROUTES.SIGN_UP,
        data: {
          email,
          password,
          firstname,
          lastname,
          role
        }
      });
      if (!response?.data?.token) {
        console.log('Algo deu errado durante o cadstro: ', response);
        return;
      }
      navigate(APP_ROUTES.SIGN_IN);
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
      <div
        style={{ '--image-url': `url(${CdsSistemasFrente})` }}
        className="w-full h-screen flex justify-center items-center bg-[image:var(--image-url)] bg-cover bg-no-repeat bg-center">
        <div className="w-1/2 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col w-2/3 sm:w-1/2">
          <h2 className="text-center font-medium text-2xl mb-4">
            Cadastre-se
          </h2>

          <form className='flex flex-1 flex-col justify-evenly'>
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
              required
              onChange={(e) => { setLastname(e.target.value); }}
            />
            <input
              className="border-2 outline-none p-2 rounded-md"
              type="email"
              placeholder="Digite seu E-mail"
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

            <button
              className="flex justify-center p-2 rounded-md w-2/3 sm:w-1/2 self-center bg-gray-800  text-white hover:bg-gray-700"
              onClick={signUp}
            >
              {
                isLoading ?
                  <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : null
              }
              <span>
                Cadastre-se
              </span>
            </button>
          </form>

          <div className="text-center text-sm">
            Já é cadastrado?
            <Link to="/signin">
              <span className="font-medium text-gray-800 ml-1">
                Entre
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
