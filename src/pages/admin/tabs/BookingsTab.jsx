import { useState, useEffect } from 'react';
import BookingCard from '../components/BookingCard';
import BookingFilters from '../components/BookingFilters.jsx';
import { fetchAllBookings, updateBookingStatus } from '../services/bookingService.js';

const BookingsTab = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'cancelled', 'rejected'
  
  useEffect(() => {
    if (user?.token) {
      loadBookings();
    }
  }, [user]);
  
  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await fetchAllBookings(user.token);
      setBookings(data);
      setBookingsError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookingsError('Failed to load bookings. Please try again later.');
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleApproveBooking = (bookingId) => {
    handleStatusChange(bookingId, 'confirmed');
  };

  const handleRejectBooking = (bookingId) => {
    handleStatusChange(bookingId, 'rejected');
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      handleStatusChange(bookingId, 'cancelled');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus, user.token);
      loadBookings();
    } catch (err) {
      setBookingsError(err.message);
    }
  };
  
  // Filter bookings based on selected status
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);
    
  return (
    <div>
      {bookingsLoading ? (
        <div className="p-6 flex justify-center">
          <p>Loading bookings...</p>
        </div>
      ) : bookingsError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {bookingsError}
        </div>
      ) : (
        <>
          <BookingFilters filter={filter} setFilter={setFilter} />
          
          <div className="grid gap-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard 
                  key={booking._id}
                  booking={booking}
                  onApprove={handleApproveBooking}
                  onReject={handleRejectBooking}
                  onCancel={handleCancelBooking}
                />
              ))
            ) : (
              <p>No {filter !== 'all' ? filter : ''} bookings found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsTab;