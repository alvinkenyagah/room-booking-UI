// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from './context/AuthContext';

// import Navbar from './components/Navbar';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import HomePage from './pages/HomePage';
// import AdminDashboard from './pages/AdminDashboard';
// import MyBookings from './pages/MyBookings';

// function App() {
//   const { user } = useContext(AuthContext);

//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
//         <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
//         <Route path="/admin" element={user && user.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
//         <Route
//           path="/bookings"
//           element={user ? <MyBookings /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import MyBookings from './pages/MyBookings';
import BookingForm from './pages/BookingForm';
import AdminDashboard from './pages/AdminDashboard';

// Protected route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/book" 
                element={
                  <ProtectedRoute>
                    <BookingForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;