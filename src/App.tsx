import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);  // Track the clicked image

  useEffect(() => {
    getAPIData();
  }, []); // Empty dependency array to run the effect only once

  const getAPIData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/tracking');
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);  // Set the clicked image
  };

  const closeModal = () => {
    setSelectedImage(null);  // Close the modal by resetting selectedImage
  };

  return (
    <div>
      <div>DashBoard</div>

      <h2>Data of Time Doctor</h2>

      {loading && <div>Loading...</div>}

      {data.map((item: any, index: number) => (
        <div key={item.id}>
          <h3>Active Time: {item.active_time}</h3>
          <br />
          <h3>ID: {item.id}</h3>
          <br />
          <h3>Keyboard Presses: {item.keyboard_presses}</h3>
          <br />
          <h3>Mouse Clicks: {item.mouse_clicks}</h3>
          <br />
          <h3>
            <img
              src={`data:image/jpg;base64,${item?.screenshots}`}  // Use Base64 image in the src attribute
              alt={`Screenshot ${index + 1}`}
              style={{ width: '300px', height: 'auto', cursor: 'pointer' }}
              onClick={() => handleImageClick(item?.screenshots)}  // Handle image click
            />
          </h3>
        </div>
      ))}

      {/* Modal for full-screen image */}
      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <img
            src={`data:image/jpg;base64,${selectedImage}`}
            alt="Full screen"
            style={{ width: '80%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
}
