import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { Login } from "./login/Login";
import { Register } from "./register/Register";
import { Dashboard } from "./dashboard/Dashboard";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { SettingsPage } from "./settings/Settings";
import { Administration } from "./administration/Administration";
import { AdminRoute } from "./utils/AdminRoute";
import { Contents } from "./contents/Contents";
import { CoursePage } from "./course/Course";
import { Live } from "./live/Live";

export const AppRoutes = () => {
    return (
        <Router basename="/CampusFlow">
            <Routes>
                {/* 


                <Route path="/" element={<Landing/>} />
                
                 */}
                <Route 
                    path="/Dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard/> 
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/Settings" 
                    element={
                        <ProtectedRoute>
                            <SettingsPage/> 
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/Contents" 
                    element={
                        <ProtectedRoute>
                            <Contents/> 
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/Administration" 
                    element={
                        <AdminRoute>
                            <Administration/> 
                        </AdminRoute>
                    } 
                />

                <Route 
                    path="/Course/:courseId"
                    element={
                        <ProtectedRoute>
                            <CoursePage />
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path="/Live"
                    element={
                        <ProtectedRoute>
                            <Live />
                        </ProtectedRoute>
                    }
                />

                <Route path="/Register" element={<Register/>} />
                <Route path="/Login" element={<Login/>} />
            </Routes>
        </Router>
    )
}