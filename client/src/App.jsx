import {BrowserRouter,Routes,Route} from'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashBoard from './pages/DashBoard';
import ResumePage from './pages/ResumePage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';

import InterviewPage from './pages/InterviewPage';
import CareerAssistantPage from './pages/CareerAssistantPage';

import Mainlayout from './layouts/Mainlayout';

import ProtectedRoute from "./components/ProtectedRoute";

const App=()=>{
   return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage/>}></Route>
            <Route path="/register" element={<RegisterPage/>}></Route>
            <Route path="/verify-otp" element={<VerifyOTPPage/>}></Route>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}></Route>
            <Route path="/reset-password" element={<ResetPasswordPage/>}></Route>

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Mainlayout>
                        <DashBoard/>
                    </Mainlayout>
                   
                </ProtectedRoute>}>
            </Route>  

            <Route path="/dashboard/resume" element={
                <ProtectedRoute>
                    <Mainlayout>
                        <ResumePage/>
                    </Mainlayout>
                </ProtectedRoute>
            }>
           </Route> 

           <Route path="/dashboard/jobs" element={
            <ProtectedRoute>
                <Mainlayout>
                    <JobsPage/>
                </Mainlayout>
            </ProtectedRoute>
           }>
           </Route>

           <Route path="/dashboard/career-assistant" element={
            <ProtectedRoute>
                <Mainlayout>
                    <CareerAssistantPage/>
                </Mainlayout>
            </ProtectedRoute>
           }>
           </Route>

           <Route path="/career-assistant" element={
            <ProtectedRoute>
                <Mainlayout>
                    <CareerAssistantPage/>
                </Mainlayout>
            </ProtectedRoute>
           }>
           </Route>

           <Route path="/dashboard/interview/:sessionId" element={
            <ProtectedRoute>
                <Mainlayout>
                    <InterviewPage/>
                </Mainlayout>
            </ProtectedRoute>
           }>
           </Route>

           <Route path="/interview/:sessionId" element={
            <ProtectedRoute>
                <Mainlayout>
                    <InterviewPage/>
                </Mainlayout>
            </ProtectedRoute>
           }>
           </Route>

           <Route path="/dashboard/profile" element={
            <ProtectedRoute>
                <Mainlayout>
                    <ProfilePage/>
                </Mainlayout>
            </ProtectedRoute>
           }>
           </Route>
             
        </Routes>
    </BrowserRouter>
}

export default App