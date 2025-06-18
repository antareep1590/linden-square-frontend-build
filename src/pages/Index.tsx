
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // Redirect to login page as the default behavior
  return <Navigate to="/login" replace />;
};

export default Index;
