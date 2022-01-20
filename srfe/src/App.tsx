import { 
	BrowserRouter as Router,
	Routes,
	Route
} from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Profile from './pages/profile';
import Login from './pages/login';
import Register from './pages/register';
import PrivateRoute from './components/PrivateRoute';
import PageContainer from './components/PageContainer';
import Header from './components/Header';
import NotFound from './pages/404';
import Search from './pages/search';
import Footer from './components/Footer';
import AuthorProfile from './pages/authorProfile';
import FavoriteAuthors from './pages/favoriteAuthors';
import { UserProvider } from './utils/globalStates';

function App() {
	return (
		<Router>
			<UserProvider>
				<Header />
				<PageContainer >
					<Routes>
						<Route 
							path="/" 
							element={<Home />} 
						/>
						<Route 
							path="/register" 
							element={<PrivateRoute authenticated={false} component={Register} />} 
						/>
						<Route 
							path="/login" 
							element={<PrivateRoute authenticated={false} component={Login} />} 
						/>
						<Route 
							path="/profile" 
							element={<PrivateRoute authenticated={true} component={Profile} />} 
						/>
						<Route 
							path="/authors/favorites" 
							element={<PrivateRoute authenticated={true} component={FavoriteAuthors} />} 
						/>
						<Route 
							path="/authors/:authorId" 
							element={<PrivateRoute authenticated={true} component={AuthorProfile} />} 
						/>
						<Route 
							path="/search" 
							element={<PrivateRoute authenticated={true} component={Search} />} 
						/>
						<Route 
							path="*" 
							element={<NotFound />} 
						/>
					</Routes>
				</PageContainer>
				<Footer />
			</UserProvider>
		</Router>
	);
}

export default App;
