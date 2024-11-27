import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SlimHeader } from './atoms/SlimHeader';
import { SideMenu } from './components/SideMenu';
import { GraphView } from './components/GraphView';
import { IntlProvider } from 'react-intl';
import { translations } from './lib/translations';
import { Header } from './components/Header';

function App() {
  return (
    <div className="App">
      <IntlProvider
        locale={navigator.language}
        defaultLocale="en-EN"
        messages={translations[navigator.language]}
      >
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-sm">
              <SideMenu />
            </div>
            <GraphView/>
          </div>
        </div>
      </IntlProvider>
    </div>
  );
}

export default App;
