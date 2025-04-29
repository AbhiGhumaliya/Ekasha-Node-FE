import React from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/antd.min.css';
import './assets/fonts/font.css';
import './global.scss';
import App from './App';

const root = createRoot(document.getElementById('root'));
root?.render(
  <App />,
);
