const API_URL = 'https://academia-cds-back-end.vercel.app'
export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/signup`,
  SIGN_IN: `${API_URL}/auth/signin`,
  CREATE_VIDEO: `${API_URL}/auth/createVideo`,
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

  WEB_RETAGUARDA_CADASTROS: '/web/retaguarda/cadastros',
  WEB_RETAGUARDA_FINANCEIRO: '/web/retaguarda/financeiro',
  WEB_RETAGUARDA_OPERACOES: '/web/retaguarda/operacoes',
  WEB_RETAGUARDA_RELATORIOS: '/web/retaguarda/relatorios',

  WEB_FRENTEDELOJA_OPERACOES: '/web/frentedeloja/operacoes',
  WEB_FRENTEDELOJA_CADASTROS: '/web/frentedeloja/cadastros',
  WEB_FRENTEDELOJA_RELATORIOS: '/web/frentedeloja/relatorios',

  DESKTOP_RETAGUARDA_CADASTROS: '/desktop/retaguarda/cadastros',
  DESKTOP_RETAGUARDA_FINANCEIRO: '/desktop/retaguarda/financeiro',
  DESKTOP_RETAGUARDA_OPERACOES: '/desktop/retaguarda/operacoes',
  DESKTOP_RETAGUARDA_FERRAMENTAS: '/desktop/retaguarda/ferramentas',
  DESKTOP_RETAGUARDA_RELATORIOS: '/desktop/retaguarda/relatorios',

  DESKTOP_FRENTEDELOJA_OPERACOES: '/desktop/frentedeloja/operacoes',
  DESKTOP_FRENTEDELOJA_CADASTROS: '/desktop/frentedeloja/cadastros',
  DESKTOP_FRENTEDELOJA_FERRAMENTAS: '/desktop/frentedeloja/ferramentas',
  DESKTOP_FRENTEDELOJA_RELATORIOS: '/desktop/frentedeloja/relatorios',
}
