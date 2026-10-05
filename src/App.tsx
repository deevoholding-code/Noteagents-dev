import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { ToastProvider } from './providers/ToastProvider';
import { ProtectedRoute, PublicOnlyRoute } from './components/layout/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';

// Auth Pages
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';

// Main Dashboard
import { DashboardPage } from './features/dashboard/DashboardPage';

// Features
import { TasksPage } from './features/tasks/TasksPage';
import { TaskDetailPage } from './features/tasks/TaskDetailPage';
import { IssuesPage } from './features/issues/IssuesPage';
import { IssueDetailPage } from './features/issues/IssueDetailPage';
import { PullRequestsPage } from './features/pullRequests/PullRequestsPage';
import { PullRequestDetailPage } from './features/pullRequests/PullRequestDetailPage';
import { IncidentsPage } from './features/incidents/IncidentsPage';
import { IncidentDetailPage } from './features/incidents/IncidentDetailPage';
import { RepositoriesPage } from './features/repositories/RepositoriesPage';
import { PipelinesPage } from './features/pipelines/PipelinesPage';
import { PipelineDetailPage } from './features/pipelines/PipelineDetailPage';
import { DeploymentsPage } from './features/deployments/DeploymentsPage';
import { AgentsPage } from './features/agents/AgentsPage';
import { AuditsPage } from './features/audits/AuditsPage';

// Observer Suite
import { LogsPage } from './features/observer/LogsPage';
import { ErrorsPage } from './features/observer/ErrorsPage';
import { NetworkPage } from './features/observer/NetworkPage';
import { PerformancePage } from './features/observer/PerformancePage';
import { TracesPage } from './features/observer/TracesPage';
import { MetricsPage } from './features/observer/MetricsPage';

// Collaboration & Account
import { DiscussionsPage } from './features/discussions/DiscussionsPage';
import { DocumentationPage } from './features/documentation/DocumentationPage';
import { ContributionsPage } from './features/contributions/ContributionsPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { SettingsPage } from './features/settings/SettingsPage';

// Root redirect handler: Always redirects to /login if unauthenticated, or /dashboard if authenticated
const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Initial entry point: ALWAYS starts at /login on localhost if unauthenticated */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/cadastro"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/recuperar-senha"
              element={
                <PublicOnlyRoute>
                  <ForgotPasswordPage />
                </PublicOnlyRoute>
              }
            />

            {/* Protected Application Routes inside AppShell */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/issues/:id" element={<IssueDetailPage />} />
              <Route path="/pull-requests" element={<PullRequestsPage />} />
              <Route path="/pull-requests/:id" element={<PullRequestDetailPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/incidents/:id" element={<IncidentDetailPage />} />
              <Route path="/repositories" element={<RepositoriesPage />} />
              <Route path="/pipelines" element={<PipelinesPage />} />
              <Route path="/pipelines/:id" element={<PipelineDetailPage />} />
              <Route path="/deployments" element={<DeploymentsPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/audits" element={<AuditsPage />} />

              {/* Observer */}
              <Route path="/observer/logs" element={<LogsPage />} />
              <Route path="/observer/errors" element={<ErrorsPage />} />
              <Route path="/observer/network" element={<NetworkPage />} />
              <Route path="/observer/performance" element={<PerformancePage />} />
              <Route path="/observer/traces" element={<TracesPage />} />
              <Route path="/observer/metrics" element={<MetricsPage />} />

              {/* Collaboration & Account */}
              <Route path="/discussions" element={<DiscussionsPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/contributions" element={<ContributionsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback wildcard */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
