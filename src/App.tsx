import {SettingsProvider} from '@/contexts/settings';
import SelectSongs from './pages/SelectSongs';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/Main';
import Test from './pages/Test';
import SelectType from './pages/SelectType';

const App = () => {
  return (
    <SettingsProvider>
      <Router>
      <Routes>
        <Route path="/" element={<SelectType />} />
        <Route path="/select-songs" element={<SelectSongs />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
    </SettingsProvider>
  );
};

export default App;
