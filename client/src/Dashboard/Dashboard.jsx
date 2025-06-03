import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import Listing from "./Listing";           // ← make sure the import path/case matches

const ORS_API_KEY =
  "5b3ce3597851110001cf6248f5160cd9a6e046cab45b176900516896"; // replace with your own if needed

const Dashboard = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [stations, setStations] = useState([]);
  const [route, setRoute] = useState([]);

  /* ---------- get user location & nearby stations ---------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setUserPosition(pos);
        fetchChargingStations(pos);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Please enable location services to use this feature.");
      }
    );
  }, []);

  /* ---------- fetch stations from Overpass ---------- */
  const fetchChargingStations = async ([lat, lon]) => {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const query = `
      [out:json];
      node(around:10000,${lat},${lon})["amenity"="charging_station"];
      out;
    `;
    try {
      const res = await fetch(
        `${overpassUrl}?data=${encodeURIComponent(query)}`
      );
      const json = await res.json();
      setStations(json.elements || []);
    } catch (err) {
      console.error("Error fetching charging stations:", err);
    }
  };

  /* ---------- fetch route from OpenRouteService ---------- */
  const fetchRoute = async ([sLat, sLon], [eLat, eLon]) => {
    const url =
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ORS_API_KEY, // OR 'Bearer <key>' if your key requires
        },
        body: JSON.stringify({
          coordinates: [
            [sLon, sLat],
            [eLon, eLat],
          ],
        }),
      });
      const data = await res.json();
      const coords =
        data.features?.[0].geometry.coordinates.map(([lon, lat]) => [
          lat,
          lon,
        ]) || [];
      setRoute(coords);
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  const handleNavigate = (station) => {
    if (userPosition) fetchRoute(userPosition, [station.lat, station.lon]);
  };

  /* ---------- Leaflet icons ---------- */
  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61168.png",
    iconSize: [25, 25],
  });

  const stationIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Listing panel */}
        <div className="md:w-1/3 w-full bg-gray-100 overflow-y-auto">
          <Listing
            stations={stations}
            userPosition={userPosition}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Map panel */}
        <div className="md:w-2/3 w-full">
          {userPosition ? (
            <MapContainer
              center={userPosition}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* user marker */}
              <Marker position={userPosition} icon={userIcon}>
                <Popup>Your Location</Popup>
              </Marker>

              {/* station markers */}
              {stations.map((st) => (
                <Marker
                  key={st.id}
                  position={[st.lat, st.lon]}
                  icon={stationIcon}
                >
                  <Popup>
                    <strong>{st.tags?.name || "Charging Station"}</strong>
                    <br />
                    <button
                      onClick={() => handleNavigate(st)}
                      className="mt-2 text-blue-600 underline"
                    >
                      Show Route
                    </button>
                  </Popup>
                </Marker>
              ))}

              {/* route polyline */}
              {route.length > 0 && (
                <Polyline positions={route} color="blue" weight={4} />
              )}
            </MapContainer>
          ) : (
            <p className="text-center mt-10">Fetching your location…</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
