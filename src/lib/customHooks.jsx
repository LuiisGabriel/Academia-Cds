import { useState, useEffect } from 'react';
import { getAuthenticatedUser } from './common';
import { APP_ROUTES } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../utils/constants';

export function useUser() {
  const [user, setUser] = useState(null);
  const [authenticated, setAutenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      if (!authenticated || !user) {
        navigate(APP_ROUTES.SIGN_IN);
        return;
      }
      setUser(user);
      setAutenticated(authenticated);
    }
    getUserDetails();
  }, []);
  return { user, authenticated };
}

export function useUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios({
          method: 'GET',
          url: API_ROUTES.GET_USERS,
          params: {},
        });
        if (response?.data?.nextUsers) {
          setUsers(response.data.nextUsers);
        } else {
          console.log('Videos não usuários:', response);
        }
      } catch (err) {
        console.error('Erro buscando usuários:', err);
      }
    }
    fetchUsers();
  }, []);
  return users;
}

export function useAmbientes() {
  const [ambientes, setAmbientes] = useState([]);
  useEffect(() => {
    async function fetchAmbientes() {
      try {
        const response = await axios({
          method: 'GET',
          url: API_ROUTES.GET_AMBIENTES,
          params: {},
        });
        if (response?.data?.ambientes) {
          setAmbientes(response.data.ambientes);
        } else {
          console.log('Ambientes não encontrados:', response);
        }
      } catch (err) {
        console.error('Erro buscando ambientes:', err);
      }
    }
    fetchAmbientes();
  }, []);
  return ambientes;
}

export function useModulos() {
  const [modulos, setModulos] = useState([]);
  useEffect(() => {
    async function fetchModulos() {
      try {
        const response = await axios({
          method: 'GET',
          url: API_ROUTES.GET_MODULOS,
          params: {},
        });
        if (response?.data?.modulos) {
          setModulos(response.data.modulos);
        } else {
          console.log('Modulos não encontrados:', response);
        }
      } catch (err) {
        console.error('Erro buscando modulos:', err);
      }
    }
    fetchModulos();
  }, []);
  return modulos;
}

export function useSubModulos() {
  const [subModulos, setSubModulos] = useState([]);
  useEffect(() => {
    async function fetchSubModulos() {
      try {
        const response = await axios({
          method: 'GET',
          url: API_ROUTES.GET_SUBMODULOS,
          params: {},
        });
        if (response?.data?.subModulos) {
          setSubModulos(response.data.subModulos);
        } else {
          console.log('SubModulos não encontrados:', response);
        }
      } catch (err) {
        console.error('Erro buscando subModulos:', err);
      }
    }
    fetchSubModulos();
  }, []);
  return subModulos;
}

export function useTreinamentos() {
  const [treinamentos, setTreinamentos] = useState([]);
  useEffect(() => {
    async function fetchTreinamentos() {
      try {
        const response = await axios({
          method: 'GET',
          url: API_ROUTES.GET_TREINAMENTOS,
          params: {},
        });
        if (response?.data?.treinamentos) {
          setTreinamentos(response.data.treinamentos);
        } else {
          console.log('Treinamentos não encontrados:', response);
        }
      } catch (err) {
        console.error('Erro buscando treinamentos:', err);
      }
    }
    fetchTreinamentos();
  }, []);
  return treinamentos;

}

export function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  useEffect(() => {
    async function fetchAvaliacoes() {
      try {
        const response = await axios({
          method: 'GET',
          url: API_ROUTES.GET_AVALIACOES,
          params: {},
        });
        if (response?.data?.avaliacoes) {
          setAvaliacoes(response.data.avaliacoes);
        } else {
          console.log('Avaliações não encontradas:', response);
        }
      } catch (err) {
        console.error('Erro buscando avaliações:', err);
      }
    }
    fetchAvaliacoes();
  }, []);
  return avaliacoes;

}