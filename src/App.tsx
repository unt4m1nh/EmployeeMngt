import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EmployeeList from './pages/EmployeeList';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path='employees' element={<EmployeeList />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
