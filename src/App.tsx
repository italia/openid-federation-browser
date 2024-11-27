import './App.css';
import { IntlProvider } from 'react-intl';
import { translations } from './lib/translations';
import { Header } from './components/Header';
import { BodyComponent } from './components/Body';

function App() {
  return (
    <div className="App">
      <IntlProvider
        locale={navigator.language}
        defaultLocale="en-EN"
        messages={translations[navigator.language]}
      >
        <Header />
        <BodyComponent/>
      </IntlProvider>
    </div>
  );
}

export default App;
