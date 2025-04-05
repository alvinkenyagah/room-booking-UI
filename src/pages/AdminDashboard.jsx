import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import BookingCard from '../components/BookingCard';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Redirect if not admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  // Tab state
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'rooms'
  
  // ===== BOOKINGS MANAGEMENT STATE =====
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'cancelled'
  
  // ===== ROOMS MANAGEMENT STATE =====
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);
  
  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
    images: ['']
  });
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  
  // ===== FETCH DATA =====
  useEffect(() => {
    if (user?.token) {
      if (activeTab === 'bookings') {
        fetchAllBookings();
      } else {
        fetchRooms();
      }
    }
  }, [user, activeTab]);
  
  // Fetch all bookings
  const fetchAllBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/bookings/all', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await res.json();
      setBookings(data);
      setBookingsError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookingsError('Failed to load bookings. Please try again later.');
    } finally {
      setBookingsLoading(false);
    }
  };
  
  // Fetch all rooms
  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      setRooms(data);
      setRoomsError(null);
    } catch (err) {
      setRoomsError(err.message);
    } finally {
      setRoomsLoading(false);
    }
  };
  
  // Update booking status (approve, reject, cancel)
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${newStatus} booking`);
      }
      
      // Refresh bookings after update
      fetchAllBookings();
    } catch (err) {
      setBookingsError(err.message);
    }
  };
  
  // Handle approve booking
  const handleApproveBooking = (bookingId) => {
    updateBookingStatus(bookingId, 'confirmed');
  };
  
  // Handle reject booking
  const handleRejectBooking = (bookingId) => {
    updateBookingStatus(bookingId, 'rejected');
  };
  
  // Handle cancel booking
  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateBookingStatus(bookingId, 'cancelled');
    }
  };
  
  // ===== ROOM FORM HANDLERS =====
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle image URL changes
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };
  
  // Add new image field
  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };
  
  // Remove image field
  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      available: true,
      images: ['']
    });
    setIsEditing(false);
    setCurrentRoom(null);
  };
  
  // Open modal for adding room
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };
  
  // Open modal for editing room
  const openEditModal = (room) => {
    setIsEditing(true);
    setCurrentRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      price: room.price,
      available: room.available,
      images: room.images.length > 0 ? room.images : ['']
    });
    setShowModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };
  
  // Submit form (create or update room)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const roomData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      available: formData.available,
      images: formData.images.filter(img => img.trim() !== '')
    };
    
    try {
      let response;
      
      if (isEditing) {
        // Update existing room
        response = await fetch(`http://localhost:5000/api/rooms/${currentRoom._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(roomData)
        });
      } else {
        // Create new room
        response = await fetch('http://localhost:5000/api/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(roomData)
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      // Refresh rooms list
      fetchRooms();
      closeModal();
    } catch (err) {
      setRoomsError(err.message);
    }
  };
  
  // Delete room
  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete room');
      }
      
      // Refresh rooms list
      fetchRooms();
    } catch (err) {
      setRoomsError(err.message);
    }
  };
  
  // Filter bookings based on selected status
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);
    
  // ===== RENDER UI =====
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'bookings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('bookings')}
        >
          Manage Bookings
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'rooms' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('rooms')}
        >
          Manage Rooms
        </button>
      </div>
      
      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
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
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Filter Bookings:</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => setFilter('confirmed')}
                    className={`px-3 py-1 rounded ${filter === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  >
                    Confirmed
                  </button>
                  <button 
                    onClick={() => setFilter('rejected')}
                    className={`px-3 py-1 rounded ${filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                  >
                    Rejected
                  </button>
                  <button 
                    onClick={() => setFilter('cancelled')}
                    className={`px-3 py-1 rounded ${filter === 'cancelled' ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
              
              <div className="grid gap-4">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div key={booking._id} className="border rounded-lg shadow-sm p-4 bg-white">
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
                            onClick={() => handleApproveBooking(booking._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectBooking(booking._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No {filter !== 'all' ? filter : ''} bookings found.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* ROOMS TAB */}
      {activeTab === 'rooms' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Room Management</h2>
            <button 
              onClick={openAddModal}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Add New Room
            </button>
          </div>
          
          {roomsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl">Loading rooms...</div>
            </div>
          ) : roomsError ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              Error: {roomsError}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No rooms found. Add a new room to get started.
                      </td>
                    </tr>
                  ) : (
                    rooms.map((room) => (
                      <tr key={room._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{room.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 truncate max-w-xs">{room.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${room.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {room.available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.images.length} images
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => openEditModal(room)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(room._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Add/Edit Room Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {isEditing ? 'Edit Room' : 'Add New Room'}
                  </h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Room Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-32"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                      Price per Night ($)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        name="available"
                        type="checkbox"
                        checked={formData.available}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-gray-700 text-sm font-bold">Available for Booking</span>
                    </label>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Images
                    </label>
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          placeholder="Image URL"
                          className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          disabled={formData.images.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mt-2"
                    >
                      Add Image URL
                    </button>
                  </div>
                  
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      {isEditing ? 'Update Room' : 'Add Room'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;