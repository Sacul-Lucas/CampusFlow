import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

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
                <Route path="/Login" element={<Login/>} />
                <Route path="/Register" element={<Register/>} /> */}
            </Routes>
        </Router>
    )
}