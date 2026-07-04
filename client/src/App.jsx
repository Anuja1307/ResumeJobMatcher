import {BrowserRouter,Routes,Route} from'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashBoard from './pages/DashBoard';

const App=()=>{
   return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage/>}></Route>
            <Route path="/register" element={<RegisterPage/>}></Route>
            <Route path="/dashboard" element={<DashBoard/>}></Route>
        </Routes>
    </BrowserRouter>
}

export default App