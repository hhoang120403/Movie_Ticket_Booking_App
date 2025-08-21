export interface Cast {
  name: string;
  profile_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  _id: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: Genre[];
  casts: Cast[];
  release_date: string;
  original_language: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

export interface ShowTime {
  time: string;
  showId: string;
}

export type DateTimeData = Record<string, ShowTime[]>;

export interface Show {
  _id: string;
  movie: Movie;
  showDateTime: string;
  showPrice: number;
}

interface User {
  name: string;
}

export interface Booking {
  _id: string;
  user: User;
  show: Show;
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;
  paymentLink: string;
}

export interface ActiveShow {
  _id: string;
  movie: Movie;
  showDateTime: string;
  showPrice: number;
  occupiedSeats: Record<string, string | undefined>;
  __v?: number;
}

export interface DashboardData {
  totalBookings: number;
  totalRevenue: number;
  totalUser: number;
  activeShows: ActiveShow[];
}
