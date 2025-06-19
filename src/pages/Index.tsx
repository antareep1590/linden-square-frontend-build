
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // Redirect to landing page instead of login
  return <Navigate to="/landing" replace />;
};

export default Index;
