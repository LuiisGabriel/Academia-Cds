import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './utils/constants';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import About from './components/About';
import Trainments from './components/trainments';
import Valuations from './components/Valuations';
import CreateVideo from './components/CreateVideo';
import AdminHomePage from './components/AdminHomePage';
import UserHomePage from './components/UserHomePage';
import CreateUser from './components/CreateUser';
import CreateQuestion from './components/CreateQuestion';
import Registers from './components/Registers';
import PostValuation from './components/PostValuation';
import Valuation from './components/Valuation';
import Trainment from './components/Trainment';
import CreateTrainment from './components/CreateTrainment';
import CreateValuation from './components/CreateValuation';
import Reports from './components/Reports';

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
        <Route path={APP_ROUTES.TRAINMENT} element={<Trainment />} />
        <Route path={APP_ROUTES.VALUATIONS} element={<Valuations />} />
        <Route path={APP_ROUTES.CREATEVIDEO} element={<CreateVideo />} />
        <Route path={APP_ROUTES.CREATETRAINMENT} element={<CreateTrainment />} />
        <Route path={APP_ROUTES.CREATEVALUATION} element={<CreateValuation />} />
        <Route path={APP_ROUTES.CREATEQUESTION} element={<CreateQuestion />} />
        <Route path={APP_ROUTES.REGISTERS} element={<Registers />} />
        <Route path={APP_ROUTES.REPORTS} element={<Reports />} />
        <Route path={APP_ROUTES.POST_VALUATION} element={<PostValuation />} />
        <Route path={APP_ROUTES.VALUATION} element={<Valuation />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;