"use client";

import { useEffect, useRef, useState } from "react";

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  favorite?: boolean;
  visited?: boolean;
  days?: number[];
  relativePrice?: string | null;
}

interface Props {
  locations: Location[];
  selectedId?: string | null;
  selectedDay?: "all" | number;
  onSelect: (location: Location) => void;
}

const dayColors: Record<number, string> = {
  1: "#e15b64",
  2: "#e67e22",
  3: "#f1c40f",
  4: "#2ecc71",
  5: "#1abc9c",
  6: "#3498db",
};

const walkingZones = [
  {
    name: "Historic center",
    points: [
      [52.5163, 13.3777],
      [52.5168, 13.3889],
      [52.5163, 13.3926],
    ] as Array<[number, number]>,
  },
  {
    name: "Museum Island area",
    points: [
      [52.5192, 13.401],
      [52.5219, 13.399],
      [52.5245, 13.402],
    ] as Array<[number, number]>,
  },
];

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[character] || character));
}

/**
 * Curated portfolio sample based on the production Berlin map.
 *
 * The map is a visualization of product state, not just geography.
 * A marker can communicate trip day, category, favorite state,
 * visited state, price and current selection.
 */
export default function BerlinMap({
  locations,
  selectedId,
  selectedDay = "all",
  onSelect,
}: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const walkingLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [walkingVisible, setWalkingVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !nodeRef.current || mapRef.current) return;

      const map = L.map(nodeRef.current, {
        zoomControl: true,
        attributionControl: true,
        minZoom: 9,
      }).setView([52.515, 13.405], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      walkingLayerRef.current = L.layerGroup().addTo(map);
      markerLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !walkingLayerRef.current) return;

    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !walkingLayerRef.current) return;

      walkingLayerRef.current.clearLayers();
      if (!walkingVisible) return;

      walkingZones.forEach((zone) => {
        L.polyline(zone.points, {
          weight: 6,
          opacity: 0.7,
          dashArray: "9 11",
          lineCap: "round",
        })
          .bindTooltip(zone.name)
          .addTo(walkingLayerRef.current!);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [mapReady, walkingVisible]);

  useEffect(() => {
    if (!mapReady || !markerLayerRef.current || !mapRef.current) return;

    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !markerLayerRef.current || !mapRef.current) return;

      markerLayerRef.current.clearLayers();
      const visibleBounds: Array<[number, number]> = [];

      locations.forEach((location, index) => {
        const assignedDays = location.days ?? [];

        const isInActiveDay = selectedDay === "all"
          ? assignedDays.length > 0
          : assignedDays.includes(selectedDay);

        const activeDay = selectedDay === "all"
          ? assignedDays[0]
          : selectedDay;

        const markerColor = isInActiveDay && activeDay
          ? dayColors[activeDay] ?? "#64748b"
          : "#94a3b8";

        const isSelected = location.id === selectedId;
        const stopNumber = selectedDay !== "all" && isInActiveDay
          ? `<span class="stop-number">${index + 1}</span>`
          : "";

        const icon = L.divIcon({
          className: "trip-marker-wrapper",
          html: `
            <span
              class="trip-marker ${isSelected ? "selected" : ""}"
              style="--marker-color:${markerColor}"
            >
              ${stopNumber}
              <span class="category">${escapeHtml(location.category)}</span>
              ${location.relativePrice ? `<span class="price">${escapeHtml(location.relativePrice)}</span>` : ""}
              ${location.favorite ? '<span class="favorite">★</span>' : ""}
              ${location.visited ? '<span class="visited">✓</span>' : ""}
            </span>
          `,
          iconSize: isSelected ? [44, 52] : [38, 46],
          iconAnchor: isSelected ? [22, 50] : [19, 44],
        });

        const tooltip = `
          <strong>${escapeHtml(location.name)}</strong>
          <br />
          ${assignedDays.length ? `Day ${assignedDays.join(", ")}` : "Not assigned yet"}
        `;

        L.marker([location.lat, location.lng], {
          icon,
          riseOnHover: true,
        })
          .bindTooltip(tooltip, { direction: "top" })
          .on("click", () => onSelect(location))
          .addTo(markerLayerRef.current!);

        visibleBounds.push([location.lat, location.lng]);
      });

      if (visibleBounds.length && locations.length < 70) {
        mapRef.current.fitBounds(visibleBounds, {
          padding: [60, 60],
          maxZoom: 13,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locations, selectedId, selectedDay, onSelect, mapReady]);

  return (
    <section>
      <div
        ref={nodeRef}
        className="map-canvas"
        aria-label="Berlin trip map"
      />

      <button
        type="button"
        onClick={() => setWalkingVisible((value) => !value)}
        aria-pressed={walkingVisible}
      >
        Walking areas
      </button>
    </section>
  );
}
