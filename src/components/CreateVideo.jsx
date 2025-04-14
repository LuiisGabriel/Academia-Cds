import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES } from '../utils/constants';
import Navbar from './Navbar';
import { useQuery } from '@apollo/client';
import { getAmbientes, getModulos, getSubModulos } from '../graphQl/Querys';
import { useUser } from '../lib/customHooks';

const CreateVideo = () => {

  const { user, authenticated } = useUser();

  const modulos = useQuery(getModulos);
  const subModulos = useQuery(getSubModulos);
  const ambientes = useQuery(getAmbientes);

  const [titulo, setTitulo] = useState('');
  const [ambiente, setAmbiente] = useState('');
  const [modulo, setModulo] = useState('');
  const [url, setUrl] = useState('');
  const [subModulo, setSubModulo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createVideo = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'POST',
        url: API_ROUTES.CREATE_VIDEO,
        data: {
          titulo,
          ambiente,
          modulo,
          url,
          subModulo
        }
      });
      if (!response?.data) {
        console.log('Algo deu errado durante o cadstro: ', response);
        return;
      } else {
        alert('Video cadastrado com sucesso');
      }
    }
    catch (err) {
      console.log('Ocorreu algum erro no cadastro: ', err);
    }
    finally {
      setTitulo('');
      setAmbiente('');
      setModulo('');
      setSubModulo('');
      setUrl('');
      setIsLoading(false);
    }
  };

  if (!user || !authenticated || user.role !== 'ADMIN') {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  return (
    <>
      <nav className="sticky top-0 z-50"><Navbar /></nav>
      <div className="w-full h-screen flex justify-center items-center bg-gray-300">
        <div className=" w-2/3 sm:w-1/2 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col">
          <h2 className="text-center font-medium text-2xl mb-4">
            Cadastre um vídeo
          </h2>
          <div className="flex flex-1 flex-col justify-evenly">
            <input
              className="border-2 outline-none p-2 rounded-md"
              type="email"
              placeholder="titulo"
              value={titulo}
              required
              onChange={(e) => { setTitulo(e.target.value); }}
            />
            <select
              type="text"
              onChange={(e) => { setAmbiente(e.target.value); }}
              value={ambiente}
              className="border-2 outline-none p-2 rounded-md"
            >
              <option disabled={true} value="">Escolha um ambiente</option>
              {ambientes.data?.ambientes?.map((ambiente) => (
                <option
                  value={ambiente.nome}
                >
                  {ambiente.nome}
                </option>
              ))}
            </select>
            <select
              type="text"
              onChange={(e) => { setModulo(e.target.value); }}
              value={modulo}
              className="border-2 outline-none p-2 rounded-md"
            >
              <option disabled={true} value="">Escolha um módulo</option>
              {modulos.data?.modulos?.map((modulo) => (
                <option
                  value={modulo.nome}
                >
                  {modulo.nome}
                </option>
              ))}
            </select>
            <select
              type="text"
              onChange={(e) => { setSubModulo(e.target.value); }}
              value={subModulo}
              className="border-2 outline-none p-2 rounded-md"
            >
              <option disabled={true} value="">Escolha um sub-módulo</option>
              {subModulos.data?.subModulos?.map((subModulo) => (
                <option
                  value={subModulo.nome}
                >
                  {subModulo.nome}
                </option>
              ))}
            </select>
            <input
              className="border-2 outline-none p-2 rounded-md"
              type="email"
              placeholder="Url" 
              value={url}
              required
              onChange={(e) => { setUrl(e.target.value); }}
            />

            <button
              className="
             flex justify-center
             p-2 rounded-md w-1/2 self-center
             bg-gray-800  text-white 
             hover:bg-gray-700"
              onClick={createVideo}
            >
              {
                isLoading ?
                  <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : null
              }
              <span>
                Cadastrar
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateVideo;
