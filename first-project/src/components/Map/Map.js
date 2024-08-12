import React, { useState, useEffect, useRef } from 'react';
import classes from './map.module.css';
import 'leaflet/dist/leaflet.css';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from 'react-leaflet';
import { toast } from 'react-toastify';

export default function Map({ readonly, location, onChange }) {
    const mapRef = useRef(null);

    return (
        <div className={classes.container}>
            <MapContainer
                className={classes.map}
                center={[0, 0]}
                zoom={1}
                dragging={!readonly}
                touchZoom={!readonly}
                doubleClickZoom={!readonly}
                scrollWheelZoom={!readonly}
                boxZoom={!readonly}
                keyboard={!readonly}
                attributionControl={false}
                ref={mapRef}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FindButtonAndMarker
                    readonly={readonly}
                    location={location}
                    onChange={onChange}
                    mapRef={mapRef}
                />
            </MapContainer>
        </div>
    );
}

function FindButtonAndMarker({ readonly, location, onChange, mapRef }) {
    const [position, setPosition] = useState(location);
    const map = useMap();

    useEffect(() => {
        if (readonly) {
            map.setView(position, 13);
            return;
        }
        if (position) onChange(position);
    }, [position]);

    useEffect(() => {
        const handleFindMyLocationClick = () => {
            map.locate().on('locationfound', (e) => {
                setPosition(e.latlng);
                map.flyTo(e.latlng, 13);
            });
        };

        if (!readonly) {
            mapRef.current?.addEventListener('click', handleFindMyLocationClick);
        }

        return () => {
            if (!readonly && mapRef.current) {
                mapRef.current.removeEventListener('click', handleFindMyLocationClick);
            }
        };
    }, [readonly, map, mapRef]);

    return (
        <>
            {!readonly && (
                <button
                    type="button"
                    className={classes.find_location}
                    onClick={(e) => e.stopPropagation()}
                >
                    Find My Location
                </button>
            )}

            {position && (
                <Marker
                    eventHandlers={{
                        dragend: (e) => {
                            setPosition(e.target.getLatLng());
                        },
                    }}
                    position={position}
                    draggable={!readonly}
                >
                    <Popup>Shipping Location</Popup>
                </Marker>
            )}
        </>
    );
}