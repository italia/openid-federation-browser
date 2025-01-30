import "./App.css";
import { IntlProvider } from "react-intl";
import { getTranslations } from "./lib/translations";
import { Header } from "./components/Header";
import { BodyComponent } from "./components/Body";

function App() {
  return (
    <div className="App">
      <IntlProvider
        locale={navigator.language.split(",")[0]}
        defaultLocale="en-EN"
        messages={getTranslations(navigator.language)}
      >
        <Header />
        <BodyComponent />
        <canvas id="canvas" style={{ display: "none" }}></canvas>
      </IntlProvider>
    </div>
  );
}

export default App;
