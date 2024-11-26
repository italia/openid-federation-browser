import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SlimHeader } from './components/SlimHeader';
import { SideMenu } from './components/SideMenu';
import { GraphView } from './components/GraphView';
import { IntlProvider } from 'react-intl';
import { translations } from './lib/translations';

function App() {
  return (
    <div className="App">
      <IntlProvider
        locale={navigator.language}
        defaultLocale="en-EN"
        messages={translations[navigator.language]}
      >
        <SlimHeader />
        <div className="container">
          <div className="row">
            <div className="col-sm">
              <SideMenu />
            </div>
            <div className="col-lg-8">
              <GraphView/>
            </div>
          </div>
        </div>
      </IntlProvider>
    </div>
  );
}

export default App;
