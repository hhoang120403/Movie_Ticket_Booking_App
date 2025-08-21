import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIsAdmin } from '../../context/admin/adminSlice';
import { useEffect } from 'react';
import type { AppDispatch, RootState } from '../../context/store';
import Loading from '../../components/Loading';

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin } = useSelector((state: RootState) => state.admin);
  const { getToken } = useAuth();

  useEffect(() => {
    dispatch(fetchIsAdmin({ getToken }));
  }, [getToken, dispatch]);

  return isAdmin ? (
    <>
      <AdminNavbar />
      <div className='flex'>
        <AdminSidebar />
        <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};
export default Layout;
