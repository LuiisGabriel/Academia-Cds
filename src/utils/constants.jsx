const API_URL = 'http://localhost:4000'
export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/signup`,
  SIGN_IN: `${API_URL}/auth/signin`,
  CREATE_TRAINMENT: `${API_URL}/auth/createTreinamento`,
  CREATE_VALUATION: `${API_URL}/auth/createAvaliacao`,
  GET_USER: `${API_URL}/auth/me`,
  GET_USERS: `${API_URL}/auth/getNextUsers`,
  GET_TRAINMENT_VIDEOS: `${API_URL}/auth/getTrainmentVideos`,
  GET_VIDEOS: `${API_URL}/auth/getVideos`,
  GET_AMBIENTES: `${API_URL}/auth/getAmbientes`,
  GET_MODULOS: `${API_URL}/auth/getModulos`,
  GET_SUBMODULOS: `${API_URL}/auth/getSubModulos`,
  GET_TREINAMENTOS: `${API_URL}/auth/getTreinamentos`,
  GET_AVALIACOES: `${API_URL}/auth/getAvaliacoes`,
  UPDATE_USER_WATCHED_VIDEOS: `${API_URL}/auth/updateUserWatchedVideos`,
  UPDATE_USER_ANSWERED_VALUATIONS: `${API_URL}/auth/updateUserAnsweredValuations`,
  PUBLISH_VALUATION: `${API_URL}/auth/publishValuation`,
  PUBLISH_TRAINMENT: `${API_URL}/auth/publishTrainment`,
  UNPUBLISH_TRAINMENT: `${API_URL}/auth/unpublishTrainment`,
  DELETE_TRAINMENT: `${API_URL}/auth/deleteTrainment`  
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
  CREATETRAINMENT: '/createtrainment',
  CREATEVALUATION: '/createvaluation',
  REGISTERS: '/registers',

  REPORTS: '/reports',
  USER_REPORTS: '/userReports',
  TRAINMENT_REPORTS: '/trainmentReports',

  VALUATIONS: '/valuations',
  VALUATION: '/valuation',
  POST_VALUATION: '/postvaluation',

}