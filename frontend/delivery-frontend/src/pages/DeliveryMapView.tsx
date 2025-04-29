import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 6.9271,
  lng: 79.8612,
};

export default function DeliveryMapView({ deliveries }: { deliveries: any[] }) {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
        {deliveries.map((delivery) => (
          <Marker
            key={delivery._id}
            position={{
              lat: delivery.location.lat,
              lng: delivery.location.lng,
            }}
            title={`Customer: ${delivery.customerId}, Status: ${delivery.status}`}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
