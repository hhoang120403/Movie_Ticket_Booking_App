import type {
  ActiveShow,
  Booking,
  DashboardData,
  Movie,
  ShowTime,
} from './types';

export interface ApiResponse {
  success: boolean;
  message?: string;
}

interface Auth {
  isAdmin: boolean;
}

export type AuthResponse = ApiResponse & Auth;

export type NowPlayingMovieResponse = ApiResponse & { movies: Movie[] };

export type DashboardResponse = ApiResponse & { dashboardData: DashboardData };

export type ListShowResponse = ApiResponse & { shows: ActiveShow[] };

export type BookingsResponse = ApiResponse & { bookings: Booking[] };

export type OccupiedSeatsResponse = ApiResponse & { occupiedSeats: string[] };

export type BookTicketsResponse = ApiResponse & { url: string };

export type ShowsResponse = ApiResponse & { shows: Movie[] };

export type ShowResponse = ApiResponse & {
  movie: Movie;
  dateTime: { [date: string]: ShowTime[] };
};

export type FavoritesResponse = ApiResponse & { movies: Movie[] };
