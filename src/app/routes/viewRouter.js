import React from 'react';
import { DirectoryPage } from '../../features/experts/pages/DirectoryPage';
import { SubmitHurdlePage } from '../../features/bottlenecks/pages/SubmitHurdlePage';
import { RegisterPage } from '../../features/experts/pages/RegisterPage';
import { ProfilePage } from '../../features/experts/pages/ProfilePage';
import { AdminPage } from '../../features/admin/pages/AdminPage';

export function renderView(view, props) {
  switch (view) {
    case 'directory':
      return React.createElement(DirectoryPage, props);
    case 'submitHurdle':
      return React.createElement(SubmitHurdlePage, props);
    case 'register':
      return React.createElement(RegisterPage, props);
    case 'profile':
      return React.createElement(ProfilePage, props);
    case 'admin':
      return React.createElement(AdminPage, props);
    default:
      return React.createElement(DirectoryPage, props);
  }
}
