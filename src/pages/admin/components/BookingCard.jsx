const BookingCard = ({ booking, onApprove, onReject, onCancel }) => {
    return (
      <div className="border rounded-lg shadow-sm p-4 bg-white">
        <div className="flex flex-col md:flex-row md:justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{booking.room?.name || 'Unknown Room'}</h3>
            <p className="text-gray-600">
              {new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Guest:</span> {booking.user?.name || booking.guestEmail}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Contact:</span> {booking.user?.email || booking.guestEmail}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Guests:</span> {booking.guests} | <span className="font-semibold">Total:</span> ${booking.totalPrice}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Special Requests:</span> {booking.specialRequests || 'None'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center mb-2">
              <span className="font-semibold mr-2">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
            
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Booked on: {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        {booking.status === 'pending' && (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => onApprove(booking._id)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Approve
            </button>
            <button 
              onClick={() => onReject(booking._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Reject
            </button>
          </div>
        )}
        
        {booking.status === 'confirmed' && (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => onCancel(booking._id)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default BookingCard;