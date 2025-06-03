import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SavedStation = ({ onNavigate }) => {
  const [savedStations, setSavedStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedStations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setSavedStations([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('https://electrowaystationfinder.onrender.com/savedStations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedStations(res.data);
      } catch (error) {
        console.error('Error fetching saved stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStations();
  }, []);

  const handleUnsave = async (stationId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to unsave stations.');
      return;
    }

    try {
      await axios.delete(`https://electrowaystationfinder.onrender.com/savedStations/${stationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedStations((prev) => prev.filter((s) => s.stationId !== stationId));
      alert('Station removed from saved list.');
    } catch (error) {
      console.error('Error unsaving station:', error);
      alert('Failed to remove station from saved list.');
    }
  };

  if (loading) {
    return <p>Loading saved stations...</p>;
  }

  if (savedStations.length === 0) {
    return <p>You have no saved stations.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Saved Stations</h2>

      <ul className="space-y-4">
        {savedStations.map((station) => {
          const name = station.tags?.name || 'Charging Station';
          const lat = station.lat || station.latitude || 0;
          const lon = station.lon || station.longitude || 0;
          const powerOutput = station.tags?.power || station.tags?.['power output'] || 'Unknown';

          return (
            <li
              key={station.stationId}
              className="bg-white shadow rounded p-4 flex flex-col gap-2"
            >
              <div><strong>{name}</strong></div>
              <div>Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}</div>
              <div>Status: <span className="text-green-600">Active</span></div>
              <div>Power Output: {powerOutput}</div>

              <div className="flex gap-4">
                <button
                  onClick={() => onNavigate({ lat, lon, id: station.stationId, tags: station.tags })}
                  className="text-blue-600 underline"
                >
                  Show Route
                </button>

                <button
                  onClick={() => handleUnsave(station.stationId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Unsave
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SavedStation;
