import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    getAPIData();
  }, []);

  const getAPIData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/tracking');
      console.log(response.data);

      const sortedData = response.data.sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setData(sortedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Time Tracking Dashboard</h2>

      {loading && <div>Loading...</div>}

      {data.map((item: any, index: number) => {
        // Define max values for progress bar calculations
        const maxActiveTime = 60; // Assume 60 minutes max active time per hour
        const maxKeyPresses = 1000; // Assume max 1000 key presses per session
        const maxMouseClicks = 500; // Assume max 500 clicks per session
        const maxMouseMoves = 2000; // Assume max 2000 mouse moves per session

        return (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
            <h3>ID: {item.id}</h3>
            <p>{new Date(item?.created_at).toLocaleString()}</p>

            {/* Active Time Progress */}
            <div>
              <h4>Active Time: {item.active_time} min</h4>
              <progress value={Math.min(item.active_time, maxActiveTime)} max={maxActiveTime} style={{ width: '100%' }} />
            </div>

            {/* Keyboard Presses Progress */}
            <div>
              <h4>Keyboard Presses: {item.keyboard_presses}</h4>
              <progress value={Math.min(item.keyboard_presses, maxKeyPresses)} max={maxKeyPresses} style={{ width: '100%' }} />
            </div>

            {/* Mouse Clicks Progress */}
            <div>
              <h4>Mouse Clicks: {item.mouse_clicks}</h4>
              <progress value={Math.min(item.mouse_clicks, maxMouseClicks)} max={maxMouseClicks} style={{ width: '100%' }} />
            </div>

            {/* Mouse Movements Progress */}
            <div>
              <h4>Mouse Movements: {item.mouse_movements}</h4>
              <progress value={Math.min(item.mouse_movements, maxMouseMoves)} max={maxMouseMoves} style={{ width: '100%' }} />
            </div>

            {/* Screenshot */}
            <h4>Screenshot:</h4>
            <img
              src={`data:image/jpg;base64,${item?.screenshots}`}
              alt={`Screenshot ${index + 1}`}
              style={{ width: '300px', height: 'auto', cursor: 'pointer' }}
              onClick={() => handleImageClick(item?.screenshots)}
            />
          </div>
        );
      })}

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
