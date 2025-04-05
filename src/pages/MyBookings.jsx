import { useEffect, useState, useContext } from 'react';
import BookingCard from '../components/BookingCard';
import { AuthContext } from '../context/AuthContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/bookings/user', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await res.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchBookings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
      <div className="grid gap-4">
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <BookingCard 
              key={b._id} 
              booking={b} 
              isAdmin={user.isAdmin} 
              onUpdate={fetchBookings} 
            />
          ))
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;