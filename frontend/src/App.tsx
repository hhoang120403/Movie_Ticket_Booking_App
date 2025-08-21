import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favorite from './pages/Favorite';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Layout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AddShows from './pages/admin/AddShows';
import ListShows from './pages/admin/ListShows';
import ListBookings from './pages/admin/ListBookings';
import { SignIn, useAuth, useUser } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './context/store';
import { useEffect } from 'react';
import { fetchShows } from './context/shows/showsSlice';
import { fetchFavoriteMovies } from './context/favorites/favoritesSlice';
import Loading from './components/Loading';

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useUser(); // Clerk check login
  const { getToken } = useAuth();

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFavoriteMovies({ getToken }));
  }, [dispatch, getToken]);

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/loading/:nextUrl' element={<Loading />} />
        <Route path='/favorite' element={<Favorite />} />
        <Route
          path='/admin/*'
          element={
            user ? (
              <Layout />
            ) : (
              <div className='min-h-screen flex justify-center items-center'>
                <SignIn fallbackRedirectUrl={'/admin'} />
              </div>
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='add-shows' element={<AddShows />} />
          <Route path='list-shows' element={<ListShows />} />
          <Route path='list-bookings' element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};
export default App;
