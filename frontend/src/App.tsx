import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UsersPage from './pages/admin/UsersPage';
import ProfilePage from './pages/profile/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ForbiddenPage from './pages/ForbiddenPage';
import CreateUserPage from './pages/admin/CreateUserPage';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import InspectionsListPage from './pages/inspections/InspectionsListPage';
import CreateInspectionPage from './pages/inspections/CreateInspectionPage';
const theme = createTheme({
  palette: {
    primary: { main: '#1565C0' },
    secondary: { main: '#546E7A' },
    background: { default: '#F5F7FA' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
             <Route path="/set-password"    element={<SetPasswordPage />} />
            <Route path="/403" element={<ForbiddenPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN_HSEE']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />

               <Route
                path="/admin/users/new"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN_HSEE']}>
                    <CreateUserPage />
                  </ProtectedRoute>
                }
              />
              {/* Future epics — placeholder */}
              <Route path="/inspections" element={<InspectionsListPage />} />
              <Route path="/inspections/new" element={<CreateInspectionPage />} />
              <Route path="/checklists" element={<DashboardPage />} />
              <Route path="/anomalies" element={<DashboardPage />} />
              <Route path="/actions" element={<DashboardPage />} />
              <Route path="/dashboard/kpi" element={<DashboardPage />} />
              <Route path="/notifications" element={<DashboardPage />} />
              <Route path="/calendar" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}