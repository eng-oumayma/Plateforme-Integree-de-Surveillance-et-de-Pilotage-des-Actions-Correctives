import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import UsersPage from "./pages/admin/UsersPage";
import ProfilePage from "./pages/profile/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import CreateUserPage from "./pages/admin/CreateUserPage";
import SetPasswordPage from "./pages/auth/SetPasswordPage";
import InspectionsListPage from "./pages/inspections/InspectionsListPage";
import CreateInspectionPage from "./pages/inspections/CreateInspectionPage";
import PlanningCalendarPage from "./pages/planning/Planningcalendarpage";
import PlanningConfigPage from "./pages/planning/Planningconfigpage";
import FillChecklistPage from "./pages/admin/checklists/FillChecklistPage";
import ChecklistResultsPage from "./pages/admin/checklists/ChecklistResultsPage";
import ChecklistTemplatePage from "./pages/admin/checklists/ChecklistTemplatePage";
import AnomaliesListPage from "./pages/anomalies/AnomaliesListPage";
import AnomalyDetailPage from "./pages/anomalies/AnomalyDetailPage";
import CreateCorrectiveActionPage from "./pages/corrective-actions/CreateCorrectiveActionPage";

import ChecklistTemplatesPage from "./pages/admin/checklists/ChecklistTemplatesPage";
import ChecklistBuilderPage from "./pages/admin/checklists/ChecklistBuilderPage";
import MesTachesPage from "./pages/planning/MesTachesPage";
const theme = createTheme({
  palette: {
    primary: { main: "#1565C0" },
    secondary: { main: "#546E7A" },
    background: { default: "#F5F7FA" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500 },
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
            <Route path="/set-password" element={<SetPasswordPage />} />
            <Route path="/403" element={<ForbiddenPage />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE"]}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/new"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE"]}>
                    <CreateUserPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inspections"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE", "AUDITEUR"]}>
                    <InspectionsListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inspections/new"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE", "AUDITEUR"]}>
                    <CreateInspectionPage />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/inspections/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN_HSEE', 'AUDITEUR']}>
                    <EditInspectionPage />
                  </ProtectedRoute>
                }
              /> */}
              {/* ── Planning 52 semaines (Admin seulement) ── */}
              <Route
                path="/planning"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE"]}>
                    <PlanningCalendarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/planning/new"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE"]}>
                    <PlanningConfigPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mes-taches"
                element={
                  <ProtectedRoute allowedRoles={["AUDITEUR"]}>
                    <MesTachesPage />
                  </ProtectedRoute>
                }
              />
              {/* Future epics — placeholder */}

              <Route
                path="/checklists"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE", "AUDITEUR"]}>
                    <ChecklistTemplatesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checklists/builder"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE"]}>
                    <ChecklistBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checklists/builder/:id"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE"]}>
                    <ChecklistBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checklists/fill/:inspectionId/:templateId"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE", "AUDITEUR"]}>
                    <FillChecklistPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checklists/results/:inspectionId/:templateId"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE", "AUDITEUR"]}>
                    <ChecklistResultsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checklists/:id"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE", "AUDITEUR"]}>
                    <ChecklistTemplatePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/anomalies"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE", "AUDITEUR"]}>
                    <AnomaliesListPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/anomalies/:id"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE", "AUDITEUR"]}>
                    <AnomalyDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/actions/new"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN_HSEE", "AUDITEUR"]}>
                    <CreateCorrectiveActionPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/dashboard/kpi" element={<DashboardPage />} />
              <Route path="/notifications" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
