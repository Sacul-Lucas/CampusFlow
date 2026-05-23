import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { Login } from "./login/Login";
import { Register } from "./register/Register";

export const AppRoutes = () => {
    return (
        <Router basename="/CampusFlow">
            <Routes>
                {/* <Route 
                    path="/Dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard/> 
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
                    path="/Settings" 
                    element={
                        <ProtectedRoute>
                            <Settings/> 
                        </ProtectedRoute>
                    } 
                />
                <Route path="/" element={<Landing/>} />
                
                 */}
                <Route path="/Register" element={<Register/>} />
                <Route path="/Login" element={<Login/>} />
            </Routes>
        </Router>
    )
}