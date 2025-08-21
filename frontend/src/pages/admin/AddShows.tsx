import { useEffect, useState } from 'react';
import type { Movie } from '../../types/types';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { voteConvert } from '../../lib/voteConvert';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../../lib/axiosConfig';
import type {
  ApiResponse,
  NowPlayingMovieResponse,
} from '../../types/apiResponseTypes';
import toast from 'react-hot-toast';

interface DateTimeSelection {
  [date: string]: string[];
}

const AddShows = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [dateTimeSelection, setDateTimeSelection] = useState<DateTimeSelection>(
    {}
  );
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [showPrice, setShowPrice] = useState('');
  const [addingShow, setAddingShow] = useState(false);

  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      const { data } = await api.get<NowPlayingMovieResponse>(
        '/api/show/now-playing',
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    };

    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      setAddingShow(true);

      if (
        !selectedMovie ||
        Object.keys(dateTimeSelection).length === 0 ||
        !showPrice
      ) {
        return toast('Missing required fields');
      }

      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, time]) => ({ date, time })
      );

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice),
      };

      const { data } = await api.post<ApiResponse>('/api/show/add', payload, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        toast.success(data.message || 'Show added successfully');
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice('');
      } else {
        toast.error(data.message || 'Error add show');
      }
    } catch (error) {
      console.error('Adding show error', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setAddingShow(false);
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return toast.error('Missing add time');
    const [date, time] = dateTimeInput.split('T');
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
  };

  const handleRemoveTime = (date: string, time: string) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  const handleSelectMovie = (id: number) => {
    setSelectedMovie((prevId) => {
      if (prevId === id) {
        return null;
      }
      return id;
    });
  };

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1='Add' text2='Shows' />
      <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>
      <div className='overflow-x-auto pb-4'>
        <div className='group flex flex-wrap gap-4 mt-4 w-max'>
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
              onClick={() => handleSelectMovie(movie.id)}
            >
              <div className='relative rounded-lg overflow-hidden'>
                <img
                  src={`${
                    import.meta.env.VITE_TMDB_IMAGE_BASE_URL + movie.poster_path
                  }`}
                  alt=''
                  className='w-full object-cover brightness-90'
                />
                <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                  <p className='flex items-center gap-1 text-gray-400'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary' />{' '}
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className='text-gray-400'>
                    {voteConvert(movie.vote_count)} Votes
                  </p>
                </div>
              </div>

              {selectedMovie === movie.id && (
                <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded'>
                  <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                </div>
              )}
              <p className='font-medium truncate'>{movie.title}</p>
              <p className='text-gray-400 text-sm'>{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Show Price Input */}
      <div className='mt-8'>
        <label className='block text-sm font-medium mb-2'>Show Price</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>
          <p className='text-gray-400 text-sm'>$</p>
          <input
            type='number'
            min={0}
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder='Enter show price'
            className='outline-none'
          />
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className='mt-6'>
        <label className='block text-sm font-medium mb-2'>
          Select Date and Time
        </label>
        <div className='inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg'>
          <input
            type='datetime-local'
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className='outline-none'
          />
          <button
            className='bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer'
            onClick={handleDateTimeAdd}
          >
            Add Time
          </button>
        </div>
      </div>

      {/* Display Selected Time */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className='mt-6'>
          <h2 className='mb-2'>Selected Date-Time</h2>
          <ul className='space-y-3'>
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className='font-medium'>{date}</div>
                <div className='flex flex-wrap gap-2 mt-1 text-sm'>
                  {times.map((time) => (
                    <div
                      key={time}
                      className='border border-primary px-2 py-1 flex items-center rounded'
                    >
                      <span>{time}</span>
                      <DeleteIcon
                        onClick={() => handleRemoveTime(date, time)}
                        width={15}
                        className='ml-2 text-red-500 hover:text-red-700 cursor-pointer'
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'
        onClick={handleSubmit}
        disabled={addingShow}
      >
        {addingShow ? 'Adding...' : 'Add Show'}
      </button>
    </>
  ) : (
    <Loading />
  );
};
export default AddShows;
