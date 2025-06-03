import React, { useState, useEffect } from 'react';
import SavedStation from './SavedStation';
import axios from 'axios';

const Listing = ({ stations, onNavigate, userPosition }) => {
  const [showSaved, setShowSaved] = useState(false);
  const [savedStationIds, setSavedStationIds] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);  // Track selected station for highlight

  /* ─────────────────────────────────────────────────────────────
     Fetch saved-station IDs once (on mount) so we can flag them
  ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/savedStations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ids = new Set(res.data.map((s) => s.stationId));
        setSavedStationIds(ids);
      } catch (err) {
        console.error('Error fetching saved stations:', err);
      }
    };

    fetchSaved();
  }, []);

  /* ─────────────────────────────────────────────────────────────
     Helpers (distance calculation)
  ─────────────────────────────────────────────────────────────── */
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSave = async (station) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to save stations.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/savedStations',
        {
          stationId: station.id.toString(),
          lat: station.lat,
          lon: station.lon,
          tags: station.tags || {},
          note: '',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Station saved successfully!');
      setSavedStationIds((prev) => new Set(prev).add(station.id.toString()));
    } catch (err) {
      console.error('Save station error:', err);
      const msg = err.response?.data?.message || 'Error saving station.';
      alert(msg);
    }
  };

  /* ─────────────────────────────────────────────────────────────
     Render
  ─────────────────────────────────────────────────────────────── */
  return (
    <div className="p-4">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {showSaved ? 'Your Saved Stations' : 'Nearby Charging Stations'}
        </h2>
        <button
          onClick={() => setShowSaved((s) => !s)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {showSaved ? 'Back to List' : 'Saved Stations'}
        </button>
      </div>

      {/* Saved-stations view */}
      {showSaved ? (
        <SavedStation onNavigate={onNavigate} />
      ) : (
        /* Nearby-stations list */
        <>
          {stations.length === 0 ? (
            <p>No stations found.</p>
          ) : (
            <ul className="space-y-4">
              {stations.map((station) => {
                const { lat, lon, tags, id } = station;
                const name = tags?.name || 'Charging Station';

                const distance = userPosition
                  ? getDistance(userPosition[0], userPosition[1], lat, lon)
                  : 0;
                const distanceText = distance.toFixed(2);

                const powerOutput = tags?.power || tags?.['power output'] || 'Unknown';

                const isSaved = savedStationIds.has(id.toString());

                // Conditional class for persistent highlight on selected station
                const selectedClass = selectedId === id
                  ? 'bg-blue-100' // light blue highlight
                  : 'hover:bg-gray-100'; // normal hover effect

                return (
                  <li
                    key={id}
                    className={`bg-white shadow rounded p-4 flex flex-col gap-2 cursor-pointer transition-colors duration-200 ${selectedClass}`}
                  >
                    <div><strong>{name}</strong></div>
                    <div>Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}</div>
                    <div>Status: <span className="text-green-600">Active</span></div>
                    <div>Power Output: {powerOutput}</div>
                    <div>Distance: {distanceText} km</div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setSelectedId(id);
                          onNavigate(station);
                        }}
                        className="text-blue-600 underline"
                      >
                        Show Route
                      </button>

                      {isSaved ? (
                        <button
                          disabled
                          className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed"
                        >
                          Saved
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSave(station)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Listing;
