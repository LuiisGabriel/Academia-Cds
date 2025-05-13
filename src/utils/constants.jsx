const API_URL = 'https://academia-cds-back-end.vercel.app/'
export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/signup`,
  SIGN_IN: `${API_URL}/auth/signin`,
  CREATE_VIDEO: `${API_URL}/auth/createVideo`,
  CREATE_TRAINMENT: `${API_URL}/auth/createTreinamento`,
  CREATE_VALUATION: `${API_URL}/auth/createAvaliacao`,
  CREATE_QUESTION: `${API_URL}/auth/createQuestion`,
  GET_USER: `${API_URL}/auth/me`,
  GET_VIDEOS: `${API_URL}/auth/getVideos`,
  GET_QUESTIONS: `${API_URL}/auth/getQuestions`,
  GET_AMBIENTES: `${API_URL}/auth/getAmbientes`,
  GET_MODULOS: `${API_URL}/auth/getModulos`,
  GET_SUBMODULOS: `${API_URL}/auth/getSubModulos`,
  GET_TREINAMENTOS: `${API_URL}/auth/getTreinamentos`,
  GET_AVALIACOES: `${API_URL}/auth/getAvaliacoes`,
  UPDATE_USER_WATCHED_VIDEOS: `${API_URL}/auth/updateUserWatchedVideos`,
  UPDATE_USER_ANSWERED_VALUATIONS: `${API_URL}/auth/updateUserAnsweredValuations`,
}

export const APP_ROUTES = {

  LANDINGPAGE: '/landingPage',

  SIGN_UP: '/signup',
  SIGN_IN: '/signin',

  ADMIN_HOME_PAGE: '/admin/home',
  USER_HOME_PAGE: '/home',

  PROFILE: '/profile',
  ABOUT: '/about',
  TRAINMENTS: '/trainments',
  TRAINMENT: '/trainment',

  CREATE_USER: '/admin/createUser',
  CREATEVIDEO: '/createvideo',
  CREATETRAINMENT: '/createtrainment',
  CREATEVALUATION: '/createvaluation',
  CREATEQUESTION: '/createquestion',
  REGISTERS: '/registers',
  REPORTS: '/reports',

  VALUATIONS: '/valuations',
  VALUATION: '/valuation',
  POST_VALUATION: '/postvaluation',

}
