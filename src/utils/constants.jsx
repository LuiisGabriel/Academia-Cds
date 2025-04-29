const API_URL = 'https://academia-cds-back-end.vercel.app'
export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/signup`,
  SIGN_IN: `${API_URL}/auth/signin`,
  CREATE_VIDEO: `${API_URL}/auth/createVideo`,
  CREATE_QUESTION: `${API_URL}/auth/createQuestion`,
  GET_USER: `${API_URL}/auth/me`,
  GET_VIDEOS: `${API_URL}/auth/getVideos`,
  UPDATE_USER_WATCHED_VIDEOS: `${API_URL}/auth/updateUserWatchedVideos`,
}

export const APP_ROUTES = {
  SIGN_UP: '/signup',
  SIGN_IN: '/signin',
  CREATE_USER: '/admin/createUser',
  LANDINGPAGE: '/landingPage',
  ADMIN_HOME_PAGE: '/admin/home',
  USER_HOME_PAGE: '/home',
  VIDEOS: '/videos',
  PROFILE: '/profile',
  ABOUT: '/about',
  TRAINMENTS: '/trainments',
  VALUATIONS: '/valuations',
  CREATEVIDEO: '/createvideo',
  CREATEQUESTION: '/createquestion',
  REGISTERS: '/registers',

  WEB_RETAGUARDA_CADASTROS: '/Web/Retaguarda/Cadastros',
  WEB_RETAGUARDA_FINANCEIRO: '/Web/Retaguarda/Financeiro',
  WEB_RETAGUARDA_OPERACOES: '/Web/Retaguarda/Operacoes',
  WEB_RETAGUARDA_RELATORIOS: '/Web/Retaguarda/Relatorios',

  WEB_FRENTEDELOJA_OPERACOES: '/Web/FrenteDeLoja/Operacoes',
  WEB_FRENTEDELOJA_CADASTROS: '/Web/FrenteDeLoja/Cadastros',
  WEB_FRENTEDELOJA_RELATORIOS: '/Web/FrenteDeLoja/Relatorios',

  DESKTOP_RETAGUARDA_CADASTROS: '/Desktop/Retaguarda/Cadastros',
  DESKTOP_RETAGUARDA_FINANCEIRO: '/Desktop/Retaguarda/Financeiro',
  DESKTOP_RETAGUARDA_OPERACOES: '/Desktop/Retaguarda/Operacoes',
  DESKTOP_RETAGUARDA_FERRAMENTAS: '/Desktop/Retaguarda/Ferramentas',
  DESKTOP_RETAGUARDA_RELATORIOS: '/Desktop/Retaguarda/Relatorios',

  DESKTOP_FRENTEDELOJA_OPERACOES: '/Desktop/FrenteDeLoja/Operacoes',
  DESKTOP_FRENTEDELOJA_CADASTROS: '/Desktop/FrenteDeLoja/Cadastros',
  DESKTOP_FRENTEDELOJA_FERRAMENTAS: '/Desktop/FrenteDeLoja/Ferramentas',
  DESKTOP_FRENTEDELOJA_RELATORIOS: '/Desktop/FrenteDeLoja/Relatorios',
}