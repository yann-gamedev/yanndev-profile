import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ArticlesPage from './Articles';
import './style.css';
import './articles.css';

// ponytail: full-page links cover three routes; add a router when client-side navigation is needed.
const pathname = window.location.pathname;
const page = pathname === '/' ? <App /> : <ArticlesPage pathname={pathname} />;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {page}
  </React.StrictMode>,
);
