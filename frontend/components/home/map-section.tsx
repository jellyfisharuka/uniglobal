'use client'

import React, { useState } from "react"
import { Map, Marker } from "pigeon-maps"
import { Card } from "@/components/ui/card"

const locations = [
    // North America
    { coordinates: [40.7128, -74.0060], name: "New York" },
    { coordinates: [34.0522, -118.2437], name: "Los Angeles" },
    // Europe
    { coordinates: [51.5074, -0.1278], name: "London" },
    { coordinates: [48.8566, 2.3522], name: "Paris" },
    { coordinates: [52.5200, 13.4050], name: "Berlin" },
    // Asia
    { coordinates: [35.6762, 139.6503], name: "Tokyo" },
    { coordinates: [39.9042, 116.4074], name: "Beijing" },
    { coordinates: [31.2304, 121.4737], name: "Shanghai" },
]

export default function MapSection() {
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
    const [hue] = useState(0);

    return (
        <section className="py-16">
            <div className="container max-w-5xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl text-center font-bold text-navy-900 mb-16">
                    Мы на карте
                </h2>
                <Card className="max-w-5xl mx-auto overflow-hidden">
                    <div className="relative">
                        <Map
                            height={600}
                            defaultCenter={[20, 0]}
                            defaultZoom={2}
                            minZoom={2}
                            maxZoom={8}
                        >
                            {locations.map((location, index) => (
                                <Marker
                                    key={index}
                                    width={50}
                                    anchor={location.coordinates}
                                    color={`hsl(${hue}, 100%, 45%)`}
                                    onClick={() => setSelectedMarker(location)}
                                />
                            ))}
                        </Map>

                        {selectedMarker && (
                            <div
                                className="absolute bg-white px-4 py-2 rounded-lg shadow-lg text-sm"
                                style={{
                                    left: '50%',
                                    bottom: '20px',
                                    transform: 'translateX(-50%)',
                                    zIndex: 1000
                                }}
                            >
                                <p className="font-medium">{selectedMarker.name}</p>
                                <button
                                    onClick={() => setSelectedMarker(null)}
                                    className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                                >
                                    x
                                </button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </section>
    )
}