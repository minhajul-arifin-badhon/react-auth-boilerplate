import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/globals.css';
import './styles/utils';
import App from './App';
import { QueryProvider } from './lib/react-query/QueryProvider';
import { AuthProvider } from './context/AuthContext';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
    <Router>
        <QueryProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryProvider>
    </Router>
);
