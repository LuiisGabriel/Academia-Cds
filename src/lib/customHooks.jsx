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

export function useVideos(ambiente, modulo, subModulo) {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await axios({
          method: 'GET',
          url: API_ROUTES.GET_VIDEOS,
          params: {
            ambiente,
            modulo,
            subModulo,
          },
        });
        if (response?.data?.videos) {
          setVideos(response.data.videos);
        } else {
          console.log('Videos não encontrados:', response);
        }
      } catch (err) {
        console.error('Erro buscando videos:', err);
      }
    }
    fetchVideos();
  }, [ambiente, modulo, subModulo]);
  return videos;
}

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios({
          method: 'GET',
          url: API_ROUTES.GET_QUESTIONS,
          params:{},
        });
        if (response?.data?.questions) {
          setQuestions(response.data.questions);
        } else {
          console.log('Questões não encontradas:', response);
        }
      } catch (err) {
        console.error('Erro buscando questões:', err);
      }
    }
    fetchQuestions();
  },[]);
  return questions;
}


