"use client";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { motion } from "motion/react";
import axios from "axios";
import { AnimatePresence } from "motion/react";
import { MapPin, Navigation2 } from "lucide-react";
function FitBounds({ p1, p2 }: { p1: [number, number]; p2: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.fitBounds([p1, p2], {
      padding: [72, 72],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });
  }, [p1, p2, map]);
  return null;
}
const pickUpIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22))">
      <div style="
        background:#0a0a0a;color:#fff;
        padding:5px 14px;border-radius:100px;
        font-size:10px;font-weight:800;letter-spacing:0.14em;
        text-transform:uppercase;white-space:nowrap;
        font-family:-apple-system,system-ui,sans-serif;
        box-shadow:0 2px 12px rgba(0,0,0,0.25);
      ">PICKUP</div>
      <div style="width:2px;height:10px;background:#0a0a0a;opacity:0.4"></div>
      <div style="
        width:13px;height:13px;background:#0a0a0a;border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3);
      "></div>
    </div>`,
  className: "",
  iconSize: [90, 58],
  iconAnchor: [45, 58],
});

const dropIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22))">
      <div style="
        background:#0a0a0a;color:#fff;
        padding:5px 14px;border-radius:100px;
        font-size:10px;font-weight:800;letter-spacing:0.14em;
        text-transform:uppercase;white-space:nowrap;
        font-family:-apple-system,system-ui,sans-serif;
        box-shadow:0 2px 12px rgba(0,0,0,0.25);
      ">Drop</div>
      <div style="width:2px;height:10px;background:#0a0a0a;opacity:0.4"></div>
      <div style="
        width:13px;height:13px;background:#0a0a0a;border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3);
      "></div>
    </div>`,
  className: "",
  iconSize: [90, 58],
  iconAnchor: [45, 58],
});
const SearchMap = ({ pickup, drop, onChange, onDistance }: any) => {
  const [p1, setP1] = useState<[number, number]>();
  const [p2, setP2] = useState<[number, number]>();
  const [route, setRoute] = useState<[number, number][]>([]);
  const [km, setKm] = useState();
  const [ready, setReady] = useState<boolean>(false);

  const geoCoding = async (q: string) => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`,
      );

      const [lon, lat] = data.features[0].geometry.coordinates;
      return [lat, lon];
    } catch (err) {
      console.log(err);
    }
  };
  const reverseGeocoding = async (lat: number, lng: number) => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`,
      );
      const p = data.features[0].properties;

      const address = [p.name, p.street, p.city, p.state, p.country]
        .filter(Boolean)
        .join(",");
      return address;
    } catch (err) {
      console.log(err);
    }
  };
  const loadRoute = async (p: [number, number], d: [number, number]) => {
    try {
      const { data } = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`,
      );
      if (data.routes.length == 0) {
        return;
      }
      setRoute(
        data.routes[0].geometry.coordinates.map(([lon, lat]: number[]) => {
          return [lat, lon];
        }),
      );
      const distkm = (data.routes[0].distance / 1000).toFixed(2);
      setKm(distkm);
      onDistance(distkm);
    } catch (err) {
      console.log(err);
    }
  };
  const drapPickup = async (lat: number, lon: number) => {
    const a = await reverseGeocoding(lat, lon);
    console.log("Reverse Address:", a);
    onChange(a, drop);
    setP1([lat, lon]);
    if (p2) {
      loadRoute([lat, lon], p2);
    }
  };
  const drapDrop = async (lat: number, lon: number) => {
    const a = await reverseGeocoding(lat, lon);
    onChange(pickup, a);

    setP2([lat, lon]);
    if (p1) {
      loadRoute(p1, [lat, lon]);
    }
  };
  useEffect(() => {
    if (pickup && drop) {
      (async () => {
        const a = await geoCoding(pickup);
        console.log(a);
        const b = await geoCoding(drop);
        if (!a || !b) {
          return;
        }
        await loadRoute(a, b);
        setP1(a);
        setP2(b);
        setReady(true);
      })();
    }
  }, [pickup, drop]);

  useEffect(() => {
    if (p1 && p2) {
      loadRoute(p1, p2);
    }
  }, [p1, p2]);
  return (
    <div className="relative h-full w-full bg-zinc-100">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={p1 ?? [0, 0]}
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">"CARTO"</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        {p1 && p2 && <FitBounds p1={p1} p2={p2} />}
        {p1 && (
          <Marker
            position={p1}
            icon={pickUpIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const { lat, lng } = marker.getLatLng();
                drapPickup(lat, lng);
              },
            }}
          />
        )}
        {p2 && (
          <Marker
            position={p2}
            icon={dropIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const { lat, lng } = marker.getLatLng();
                drapDrop(lat, lng);
              },
            }}
          />
        )}
        {route?.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#0a0a0a",
              weight: 4,

              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}
      </MapContainer>

      <AnimatePresence>
        {!ready && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 z-[500] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 shadow-lg"
            >
              <div className="relative flex h-14 w-14 items-center justify-center">
                <motion.div
                  className="absolute h-14 w-14 rounded-full border-[3px] border-zinc-200 border-t-black"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <motion.div
                  className="absolute h-9 w-9 rounded-full border-[3px] border-zinc-300 border-b-black"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Loading map
                </p>

                <motion.p
                  className="mt-0.5 text-xs text-zinc-500"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Plotting your route...
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {ready && km != null && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-20 left-4 z-[500] flex items-center gap-2 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl shadow-lg"
          >
            <Navigation2 size={13} className="text-zinc-900" />
            <span className="text-zinc-900 text-xs font-bold">{km} km</span>
            <span className="w-px h-3 bg-zinc-200" />
            <span> ~{Math.max(3, Math.round((km / 25) * 60))} min</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchMap;
