import { useState, useEffect } from 'react';
import { createRoom, updateRoom } from '../services/roomService';

const RoomModal = ({ isOpen, onClose, onSave, isEditing, room, userToken }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
    images: ['']
  });
  
  useEffect(() => {
    if (isEditing && room) {
      setFormData({
        name: room.name,
        description: room.description,
        price: room.price,
        available: room.available,
        images: room.images.length > 0 ? room.images : ['']
      });
    }
  }, [isEditing, room]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };
  
  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };
  
  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };
  
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
      if (isEditing) {
        await updateRoom(room._id, roomData, userToken);
      } else {
        await createRoom(roomData, userToken);
      }
      onSave();
    } catch (err) {
      console.error('Error saving room:', err);
      // You could add error handling here
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Room' : 'Add New Room'}
          </h2>
          <button 
            onClick={onClose}
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
              onClick={onClose}
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
  );
};

export default RoomModal;