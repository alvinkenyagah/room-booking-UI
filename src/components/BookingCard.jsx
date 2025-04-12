  import { useState } from 'react';

const BookingCard = ({ booking, isAdmin, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);


  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
  
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
  
      const res = await fetch(`https://room-booking-server-j6su.onrender.com/api/bookings/cancel/${booking._id}`, {
        method: 'PUT', // Changed from DELETE to PUT
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      if (!res.ok) throw new Error('Failed to cancel booking');
      onUpdate();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`https://room-booking-server-j6su.onrender.com/api/bookings/approve/${booking._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) throw new Error('Failed to approve booking');
      onUpdate(); // Refresh bookings list
    } catch (error) {
      console.error('Error approving booking:', error);
      alert('Failed to approve booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="border p-4 rounded shadow">
  <h4 className="font-bold">Room: {booking.room?.name || 'Unknown Room'}</h4>
  <p className={`font-medium ${
    booking.status === 'confirmed' ? 'text-green-600' : 
    booking.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
  }`}>
    Status: {booking.status}
  </p>
  <p><span className='font-bold'>Booked by: </span>{booking.user?.email || 'Unknown User'}</p>
  
  <p><span className='font-bold'>Check-in: </span>{new Date(booking.checkInDate).toLocaleDateString()}</p>
  <p><span className='font-bold'>Check-out: </span>{new Date(booking.checkOutDate).toLocaleDateString()}</p>
  <p><span className='font-bold'>Booked on: </span>{new Date(booking.createdAt).toLocaleDateString()}</p>

  {booking.status === 'pending' && (
    <div className="flex gap-2 mt-2">
      {isAdmin ? (
        <button 
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:bg-gray-400" 
          onClick={handleApprove}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Approve'}
        </button>
      ) : (
        <button 
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:bg-gray-400" 
          onClick={handleCancel}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Cancel'}
        </button>
      )}
    </div>
  )}
</div>

  );
};

export default BookingCard;