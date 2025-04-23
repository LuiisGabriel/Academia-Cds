import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './utils/constants';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import About from './components/About';
import Trainments from './components/trainments';
import Valuations from './components/Valuations';



import RetaguardaWebCadastros from './components/cdsWeb/retaguardaWeb/RetaguardaWebCadastros';
import RetaguardaWebOperacoes from './components/cdsWeb/retaguardaWeb/RetaguardaWebOperacoes';
import RetaguardaWebFinanceiro from './components/cdsWeb/retaguardaWeb/RetaguardaWebFinanceiro';
import RetaguardaDesktopCadastros from './components/cdsDesktop/retaguardaDesktop/RetaguardaDesktopCadastros';
import RetaguardaDesktopFerramentas from './components/cdsDesktop/retaguardaDesktop/RetaguardaDesktopFerramentas';
import RetaguardaDesktopOperacoes from './components/cdsDesktop/retaguardaDesktop/RetaguardaDesktopOperacoes';
import RetaguardaDesktopFinanceiro from './components/cdsDesktop/retaguardaDesktop/RetaguardaDesktopFinanceiro';
import FrenteDeLojaWebCadastros from './components/cdsWeb/frenteDeLojaWeb/FrenteDeLojaWebCadastros';
import FrenteDeLojaWebOperacoes from './components/cdsWeb/frenteDeLojaWeb/FrenteDeLojaWebOperacoes';
import FrenteDeLojaDesktopFerramentas from './components/cdsDesktop/frenteDeLojaDesktop/FrenteDeLojaDesktopFerramentas';
import FrenteDeLojaDesktopCadastros from './components/cdsDesktop/frenteDeLojaDesktop/FrenteDeLojaDesktopCadastros';
import FrenteDeLojaDesktopOperacoes from './components/cdsDesktop/frenteDeLojaDesktop/FrenteDeLojaDesktopOperacoes';
import CreateVideo from './components/CreateVideo';
import AdminHomePage from './components/AdminHomePage';
import UserHomePage from './components/UserHomePage';
import CreateUser from './components/CreateUser';


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate to={APP_ROUTES.LANDINGPAGE} />} />
        <Route path={APP_ROUTES.SIGN_UP} exact element={<SignUp />} />
        <Route path={APP_ROUTES.SIGN_IN} element={<SignIn />} />
        <Route path={APP_ROUTES.CREATE_USER} element={<CreateUser />} />
        <Route path={APP_ROUTES.LANDINGPAGE} element={<LandingPage />} />
        <Route path={APP_ROUTES.ADMIN_HOME_PAGE} element={<AdminHomePage />} />
        <Route path={APP_ROUTES.USER_HOME_PAGE} element={<UserHomePage />} />
        <Route path={APP_ROUTES.PROFILE} element={<Profile />} />
        <Route path={APP_ROUTES.ABOUT} element={<About />} />
        <Route path={APP_ROUTES.TRAINMENTS} element={<Trainments />} />
        <Route path={APP_ROUTES.VALUATIONS} element={<Valuations />} />
        <Route path={APP_ROUTES.CREATEVIDEO} element={<CreateVideo />} />

        <Route path={APP_ROUTES.WEB_RETAGUARDA_CADASTROS} element={<RetaguardaWebCadastros />} />
        <Route path={APP_ROUTES.WEB_RETAGUARDA_OPERACOES} element={<RetaguardaWebOperacoes />} />
        <Route path={APP_ROUTES.WEB_RETAGUARDA_FINANCEIRO} element={<RetaguardaWebFinanceiro />} />

        <Route path={APP_ROUTES.WEB_FRENTEDELOJA_CADASTROS} element={<FrenteDeLojaWebCadastros />} />
        <Route path={APP_ROUTES.WEB_FRENTEDELOJA_OPERACOES} element={<FrenteDeLojaWebOperacoes />} />

        <Route path={APP_ROUTES.DESKTOP_RETAGUARDA_CADASTROS} element={<RetaguardaDesktopCadastros />} />
        <Route path={APP_ROUTES.DESKTOP_RETAGUARDA_FERRAMENTAS} element={<RetaguardaDesktopFerramentas />} />
        <Route path={APP_ROUTES.DESKTOP_RETAGUARDA_OPERACOES} element={<RetaguardaDesktopOperacoes />} />
        <Route path={APP_ROUTES.DESKTOP_RETAGUARDA_FINANCEIRO} element={<RetaguardaDesktopFinanceiro />} />

        <Route path={APP_ROUTES.DESKTOP_FRENTEDELOJA_CADASTROS} element={<FrenteDeLojaDesktopCadastros />} />
        <Route path={APP_ROUTES.DESKTOP_FRENTEDELOJA_OPERACOES} element={<FrenteDeLojaDesktopOperacoes/>} />
        <Route path={APP_ROUTES.DESKTOP_FRENTEDELOJA_FERRAMENTAS} element={<FrenteDeLojaDesktopFerramentas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;