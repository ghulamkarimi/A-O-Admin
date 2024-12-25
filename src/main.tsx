
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './feuture/store/index.ts'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'



axios.defaults.withCredentials = true;
createRoot(document.getElementById('root')!).render(
  <Provider store={store} >
    
    <App />
    <ToastContainer />
  </Provider>,
)
