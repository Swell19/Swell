/**
 * @file Defines the main entrypoint for the Swell app's frontend.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './client/components/App';
import store from './client/toolkit-refactor/store';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';

// Moved index.html rendering logic into Webpack Template to make use of CSP meta tag options

// Sets up Material UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#51819b',
    },
    secondary: {
      main: '#f0f6fa',
    },
  },
});

/**
 * TODO: Find a way to parse nonce and add it to the MUI cache so 'unsafe-inline' can also be removed
 * TODO: Randomly generate nonce on app launch (within index.js?)
 * * Currently nonce is generated once per build via Webpack per previous Teams -- may be an issue when building exe/dmg for distribution
 * * Due to the nature of Electron.js -- not using backend to generate nonce per request
 * * nonce for style is disabled right now due to dynamic css
 */

// Cache to catch Material UI Dynamic Elements and append tags to it for nonce
const cache = createCache({
  key: 'swell-mui',
  // nonce: nonce,
  prepend: false,
});

// Render the app
const container = document.getElementById('root');
const rt = createRoot(container);

// Created this method to allow Redux State to be accessible in Integration testing
window.getReduxState = () => store.getState();

rt.render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </CacheProvider>
);
