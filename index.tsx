import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ativa fundo neon na tela de login
function applyLoginBackground() {
  const hash = window.location.hash;

  if (hash.includes("login") || hash.includes("register")) {
    document.body.classList.add("login-screen");
  } else {
    document.body.classList.remove("login-screen");
  }
}

applyLoginBackground();
window.addEventListener("hashchange", applyLoginBackground);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);