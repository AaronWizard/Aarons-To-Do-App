import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicOnlyRoute from "./auth/PublicOnlyRoute";
import TasksMain from "./tasks/TasksMain";
import Login from "./users/Login";
import Register from "./users/Register";

export default function Main() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <TasksMain />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={
                    <PublicOnlyRoute>
                        <Login nextUrl='/' registerUrl='/register' />
                    </PublicOnlyRoute>
                } />
                <Route path="/register" element={
                    <PublicOnlyRoute>
                        <Register loginUrl='/login' />
                    </PublicOnlyRoute>
                } />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
