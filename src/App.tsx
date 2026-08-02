// App.tsx — Root component and client-side router.
// Responsibilities:
//   - Wraps the whole app in the AuthProvider so every page can read the
//     current session, profile and role.
//   - Defines every route in the app and which component renders it.
//   - Uses route guard wrappers to enforce access rules:
//       * ProtectedRoute   -> must be signed in (dashboard, profile, editors)
//       * AdminRoute       -> must be signed in AND have the 'admin' role
//       * PublicOnlyRoute  -> must be signed OUT (auth pages only)
//   - Route table overview:
//       /                    public heritage site (SiteApp)
//       /stories             public community feed of user posts/pages
//       /u/:userName         public profile page of a member
//       /auth                sign in / sign up
//       /profile             signed-in user profile editor
//       /dashboard*          contributor studio (posts, pages, editors)
//       /admin*              admin console (dashboard, content, users)
//       *                    fallback 404 page
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from './lib/guards';
import SiteApp from './site/SiteApp';
import { AuthPage } from './views/auth/AuthPage';
import { ProfilePage } from './views/auth/ProfilePage';
import { UserDashboard } from './views/dashboard/UserDashboard';
import { PostsView } from './views/dashboard/PostsView';
import { PostEditor } from './views/dashboard/PostEditor';
import { PagesView } from './views/dashboard/PagesView';
import { PageEditor } from './views/dashboard/PageEditor';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { ContentManager } from './views/admin/ContentManager';
import { UsersManager } from './views/admin/UsersManager';
import { CommunityFeed } from './views/public/CommunityFeed';
import { PublicProfile } from './views/public/PublicProfile';

const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf8f6] p-6">
    <h1 className="font-display-lg text-5xl text-[#6f250f] font-bold">404</h1>
    <p className="font-body-lg text-[#55423e] mt-2 mb-6">This page has been lost to history.</p>
    <Link to="/" className="bg-[#6f250f] text-white px-6 py-3 rounded-lg font-label-md text-sm hover:bg-[#8e3b24]">
      Return Home
    </Link>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SiteApp />} />
          <Route path="/stories" element={<CommunityFeed />} />
          <Route path="/u/:userName" element={<PublicProfile />} />

          <Route
            path="/auth"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/posts"
            element={
              <ProtectedRoute>
                <PostsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/posts/new"
            element={
              <ProtectedRoute>
                <PostEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/posts/:id/edit"
            element={
              <ProtectedRoute>
                <PostEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pages"
            element={
              <ProtectedRoute>
                <PagesView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pages/new"
            element={
              <ProtectedRoute>
                <PageEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pages/:id/edit"
            element={
              <ProtectedRoute>
                <PageEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <AdminRoute>
                <ContentManager />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersManager />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
