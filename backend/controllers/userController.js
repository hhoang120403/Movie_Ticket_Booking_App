import { clerkClient } from '@clerk/express';
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';

// API to get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;

    const bookings = await Booking.find({ user })
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};

// API to update favorite movie in Clerk User Metadata
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'Movie Id is required',
      });
    }

    const user = await clerkClient.users.getUser(userId);
    const currentFavorites = user.privateMetadata?.favorites || [];

    const isFavorite = currentFavorites.includes(movieId);
    const updatedFavorites = isFavorite
      ? currentFavorites.filter((id) => id !== movieId)
      : [...currentFavorites, movieId];

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        favorites: updatedFavorites,
      },
    });

    res.status(200).json({
      success: true,
      message: isFavorite
        ? 'Favorite removed successfully.'
        : 'Favorite added successfully.',
    });
  } catch (error) {
    console.error('Update Favorite error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favorites;

    const movies = await Movie.find({ _id: { $in: favorites } });

    res.status(200).json({ success: true, movies });
  } catch (error) {
    console.error('Getting Favorite error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
