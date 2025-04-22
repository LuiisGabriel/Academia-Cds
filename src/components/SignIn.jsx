import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../lib/customHooks';
import { storeTokenInLocalStorage } from '../lib/common';
import CdsSistemas from '../assets/CdsSistemasFiltered.jpg';

const SignIn = () => {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  if (user || authenticated && user.role == 'ADMIN') {
    navigate(APP_ROUTES.ADMIN_HOME_PAGE)
  }

  if (user || authenticated && user.role == 'USER') {
    navigate(APP_ROUTES.USER_HOME_PAGE)
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'post',
        url: API_ROUTES.SIGN_IN,
        data: {
          email,
          password
        }
      });
      if (!response?.data?.token) {
        console.log('Something went wrong during signing in: ', response);
        return;
      }
      storeTokenInLocalStorage(response.data.token);
      if (response.data.user.role == 'ADMIN') {
        navigate(APP_ROUTES.ADMIN_HOME_PAGE);
      }
      if (response.data.user.role == 'USER') {
        navigate(APP_ROUTES.USER_HOME_PAGE)
      }
    }
    catch (err) {
      alert(err.response.data.message);
      console.log(err);

    }
    finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      style={{ '--image-url': `url(${CdsSistemas})` }}
      className="w-full h-screen flex justify-center items-center bg-[image:var(--image-url)] bg-cover bg-no-repeat bg-center">
      <div className="h-1/2 shadow-lg rounded-md bg-white p-8 flex flex-col w-2/3 sm:w-1/2">
        <h2 className="text-center font-medium text-2xl mb-4 ">
          Entre na sua conta
        </h2>
        <div className="flex flex-1 flex-col justify-evenly items-center">

          <form className='space-y-6 w-2/3 items-center'>
            <div>
              <input
                className="border-2 outline-none p-2 rounded-md w-3/3 "
                type="email"
                placeholder="Digite seu E-mail"
                value={email}
                required
                onChange={(e) => { setEmail(e.target.value); }}
              />
            </div>
            <div>
              <input
                className="border-2 outline-none p-2 rounded-md w-3/3"
                type="password"
                placeholder="*******"
                value={password}
                required
                onChange={(e) => { setPassword(e.target.value); }}
              />
            </div>
            <div className="flex flex-col items-center">
              <button
                className="flex justify-center p-2 rounded-md w-1/2 self-center bg-gray-800  text-white hover:bg-gray-700"
                onClick={signIn}
              >
                {
                  isLoading ?
                    <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : null
                }
                <span>
                  Entrar
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="text-center text-sm">
          Não é cadastrado?
          <Link to="/signup">
            <span className="font-medium text-gray-800 ml-1">
              Cadastre-se
            </span>
          </Link>
        </div>
      </div>
    </div >
  );
}

export default SignIn;
