import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
   <>
    <Auth0Provider
    domain="dev-hkrxzyxlrcc0fb8t.us.auth0.com"
    clientId="SYYEF3KrL2GQiRDDEDvvbgq6fllVsfKr"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>
   </>
);
