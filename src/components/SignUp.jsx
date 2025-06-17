
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import validator from "validator";
import { PasswordValidatorManager } from '@password-validator/core';
import CdsSistemasFrente from '../assets/CdsSistemasFrente.jpg';

const SignUp = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [role] = useState('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [validatePasswordResult, setValidatePasswordResult] = useState([]);

  function validatePassword(passwordInput) {
    let password = String(passwordInput || "");
    let result = PasswordValidatorManager.fluent()
      .min(12)
      .digit(1)
      .specialCharacter(1)
      .upper(1)
      .validate(password);

    setValidatePasswordResult(result.messages);
  }

  const signUp = async () => {
    event.preventDefault();
    try {
      if (!validator.isEmail(email)) {
        alert("Insira um e-mail válido");
        return;
      }
      if (validatePasswordResult.length > 0) {
        console.log("Insira uma senha válida");
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
      }
      alert('Cadastro realizado com sucesso!');
      navigate(APP_ROUTES.SIGN_IN);
    }
    catch (err) {
      if (err.response.data.message == undefined) {
        alert('preencha todos os campos!')
      }
      if (err.response.data.message == 'Este email já está sendo utilizado') {
        alert(err.response.data.message)
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
        className="w-full h-screen flex justify-center items-center bg-[image:var(--image-url)] bg-cover bg-no-repeat bg-center select-none">
        <div className="w-1/2 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col w-2/3 sm:w-1/2">
          <h2 className="text-center font-medium text-2xl ">
            Cadastre-se
          </h2>

          <div className="flex flex-1 flex-col justify-evenly items-center">

            <form className='space-y-8 w-2/3 items-center'>
              <div>
                <input
                  className="border-2 outline-none p-2 rounded-md w-3/3"
                  type="text"
                  placeholder="Nome"
                  value={firstname}
                  required
                  onChange={(e) => { setFirstname(e.target.value); }}
                />
              </div>
              <div>
                <input
                  className="border-2 outline-none p-2 rounded-md w-3/3"
                  type="text"
                  placeholder="Sobrenome"
                  value={lastname}
                  required
                  onChange={(e) => { setLastname(e.target.value); }}
                />
              </div>
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                />
                {validatePasswordResult?.map((result, index) => (
                  <div className='text-[12px] text-red-500 flex flex-col items-start justify-center'>
                    <div
                      key={index}
                      className='py-1'>
                      {result}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center">
                <button
                  className="flex justify-center items-center p-2 rounded-md md:w-1/2 h-auto self-center bg-gray-800  text-white hover:bg-gray-700 hover:scale-102  transition-all duration-150 ease-in-out "
                  onClick={signUp}
                >
                  {
                    isLoading ?
                      <div className="size-5 p-2 border-l-2 rounded-full animate-spin" /> : <span> Cadastre-se </span>
                  }
                </button>
              </div>
            </form>
          </div>
          <div className="text-center text-sm">
            Já é cadastrado?
            <Link to="/signin">
              <span className="font-semibold text-gray-800 ml-1">
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
