import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import { useLoadUserQuery } from './features/api/authApi';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { Provider } from 'react-redux';
import { appStore } from './app/store';
import { Toaster } from './components/ui/Sonner';


const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return <>{isLoading ? <LoadingSpinner/> : <>{children}</>}</>;
};
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={appStore}>
       
      <App />
      <Toaster/>
    
  </Provider>
</StrictMode>
)
