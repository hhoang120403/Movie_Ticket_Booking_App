import { useEffect, useState } from 'react';
import type { ActiveShow } from '../../types/types';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/timeFormat';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../../lib/axiosConfig';
import type { ListShowResponse } from '../../types/apiResponseTypes';

const ListShows = () => {
  const [shows, setShows] = useState<ActiveShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const getAllShows = async () => {
      try {
        const { data } = await api.get<ListShowResponse>(
          '/api/admin/all-shows',
          {
            headers: { Authorization: `Bearer ${await getToken()}` },
          }
        );

        setShows(data.shows);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      getAllShows();
    }
  }, [user]);

  return !isLoading ? (
    <>
      <Title text1='List' text2='Shows' />
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Total Bookings</th>
              <th className='p-2 font-medium'>Earnings</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {shows.map((show, index) => (
              <tr
                key={index}
                className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'
              >
                <td className='p-2 min-w-45 pl-5'>{show.movie.title}</td>
                <td className='p-2 min-w-45'>
                  {dateFormat(show.showDateTime)}
                </td>
                <td className='p-2 min-w-45'>
                  {Object.keys(show.occupiedSeats).length}
                </td>
                <td className='p-2 min-w-45'>
                  $ {Object.keys(show.occupiedSeats).length * show.showPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};
export default ListShows;
