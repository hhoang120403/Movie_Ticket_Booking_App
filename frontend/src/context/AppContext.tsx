import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppContext = createContext({});

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get('/api/admin/is-admin', {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      console.log('isAdmin', data.isAdmin);
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith('/admin')) {
        navigate('/');
        toast.error('You are not authorized to access admin dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get('/api/user/favorites', {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Dang check');
      fetchIsAdmin();
      console.log('Admin: ', isAdmin);
      fetchFavoriteMovies();
    }
  }, [user]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data } = await axios.get('/api/show/all');

        if (data.success) {
          setShows(data.shows);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchShows();
  }, []);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
