// src/components/RoomCard.jsx
// const RoomCard = ({ room, onBook }) => {
//     return (
//       <div className="border p-4 rounded shadow">
//         <h3 className="text-xl font-bold">{room.name}</h3>
//         <p>{room.description}</p>
//         <p>Price: ${room.price}</p>
//         <div className="flex gap-2 overflow-x-auto">
//           {room.images.map((img, i) => (
//             <img key={i} src={img} alt="Room" className="w-24 h-24 object-cover" />
//           ))}
//         </div>
//         <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded" onClick={() => onBook(room._id)}>
//           Book Now
//         </button>
//       </div>
//     );
//   };
  
//   export default RoomCard;


import { useState } from 'react';

const RoomCard = ({ room, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Handle cases where room images array is empty
  const hasImages = room.images && room.images.length > 0;
  
  // Next image in carousel
  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  // Previous image in carousel
  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image carousel */}
      <div className="relative h-48 bg-gray-200">
        {hasImages ? (
          <>
            <img 
              src={room.images[currentImageIndex]} 
              alt={`${room.name} - View ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover"
            />
            
            {/* Only show navigation if there are multiple images */}
            {room.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >
                  &lt;
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >
                  &gt;
                </button>
                {/* Image counter */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-full">
                  {currentImageIndex + 1}/{room.images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No images available</span>
          </div>
        )}
      </div>
      
      {/* Room details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
          <span className="text-lg font-bold text-green-600">${room.price}<span className="text-sm text-gray-500">/night</span></span>
        </div>
        
        <p className="text-gray-600 mt-2 line-clamp-2">{room.description}</p>
        
        {/* Room details */}
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Up to {room.capacity} guests</span>
        </div>
        
        {/* Amenities
        {room.amenities && room.amenities.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700">Amenities</h4>
            <div className="mt-1 flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )} */}
        
        {/* Available status indicator */}
        <div className="mt-4 flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${room.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm">{room.isActive ? 'Available' : 'Currently unavailable'}</span>
        </div>
        
        {/* Book now button */}
        <button 
          className={`mt-4 w-full py-2 rounded-md text-white font-medium ${
            room.isActive 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={() => room.isActive && onBook(room._id)}
          disabled={!room.isActive}
        >
          {room.isActive ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;



