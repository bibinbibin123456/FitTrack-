import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/common/Button";
import { addWorkout } from "../../services/userServices";

const GPSTracker = () => {
  const [activity, setActivity] = useState("Running");
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gpsStatus, setGpsStatus] = useState("Ready to start");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [accuracy, setAccuracy] = useState(null);

  const watchIdRef = useRef(null);
  const previousPositionRef = useRef(null);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const distanceRef = useRef(0);
  const trackingRef = useRef(false);
  const routeRef = useRef([]);

  // Calculate distance between two GPS coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const earthRadiusKm = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return (
      earthRadiusKm *
      2 *
      Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    );
  };

  // Clear GPS and timer resources
  const clearTrackingResources = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Convert GPS errors into understandable messages
  const getGpsErrorMessage = (error) => {
    switch (error.code) {
      case 1:
        return "Location permission is blocked. Allow location access in your browser settings, then try again.";
      case 2:
        return "Your device could not determine a location. Check device location services and try outdoors.";
      case 3:
        return "No GPS fix yet. Move outdoors with a clear view of the sky and retry.";
      default:
        return error.message || "An unknown GPS error occurred.";
    }
  };

  // Stop workout tracking
  const handleStop = () => {
    trackingRef.current = false;
    clearTrackingResources();

    setTracking(false);
    setGpsStatus("Stopped");
    setSaved(false);

    toast.success("Tracking stopped.");
  };

  const handleSave = async () => {
    if (distance <= 0 || elapsedTime <= 0) {
      toast.error("Track a route before saving the workout.");
      return;
    }

    const caloriesPerMinute = {
      Running: 11,
      Walking: 4,
      Cycling: 8,
    }[activity];

    try {
      setSaving(true);
      await addWorkout({
        workoutType: activity,
        distance: Number(distance.toFixed(3)),
        duration: Math.max(1, Math.ceil(elapsedTime / 60)),
        calories: Math.round(
          (elapsedTime / 60) * caloriesPerMinute
        ),
        route: routeRef.current,
      });

      setSaved(true);
      setGpsStatus("Workout saved successfully");
      toast.success("GPS workout saved.");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to save the workout."
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle GPS errors
  const handleGpsError = (error) => {
    console.error("GPS Error:", {
      code: error.code,
      message: error.message,
    });

    if (!trackingRef.current) return;

    if (error.code === 3) {
      setGpsStatus("Still waiting for a GPS fix. Keep the page open and try moving to a clearer area.");
      return;
    }

    trackingRef.current = false;
    clearTrackingResources();

    setTracking(false);

    const message = getGpsErrorMessage(error);

    setGpsStatus(message);
    toast.error(message);
  };

  // Start workout tracking
  const handleStart = () => {
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(
      window.location.hostname
    );

    if (!window.isSecureContext && !isLocalhost) {
      const message = "GPS requires a secure connection. Open FitTrack over HTTPS or use localhost.";
      setGpsStatus(message);
      toast.error(message);
      return;
    }

    if (!navigator.geolocation) {
      const message = "Location is unavailable in this browser or page context. Use HTTPS or localhost and enable location services.";
      setGpsStatus(message);
      toast.error(message);
      return;
    }

    if (trackingRef.current) return;

    trackingRef.current = true;
    setTracking(true);
    setGpsStatus("Waiting for your location. Allow location access if prompted.");

    previousPositionRef.current = null;
    distanceRef.current = 0;
    routeRef.current = [];
    setSaved(false);

    setDistance(0);
    setElapsedTime(0);

    startTimeRef.current = null;
    setAccuracy(null);

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        if (!trackingRef.current) return;

        const {
          latitude: nextLat,
          longitude: nextLon,
          accuracy: nextAccuracy,
        } = position.coords;

        setAccuracy(Math.round(nextAccuracy));

        if (startTimeRef.current === null) {
          startTimeRef.current = Date.now();
          timerRef.current = setInterval(() => {
            if (startTimeRef.current !== null) {
              setElapsedTime(
                Math.floor((Date.now() - startTimeRef.current) / 1000)
              );
            }
          }, 1000);
        }

        if (nextAccuracy > 120) {
          setGpsStatus(
            `Timing is active, but location accuracy is ±${Math.round(nextAccuracy)} m. Move outdoors for reliable distance tracking.`
          );
          return;
        }

        routeRef.current.push({
          latitude: nextLat,
          longitude: nextLon,
        });

        setGpsStatus(`GPS signal locked · ±${Math.round(nextAccuracy)} m accuracy`);

        const previous = previousPositionRef.current;

        if (!previous) {
          previousPositionRef.current = {
            latitude: nextLat,
            longitude: nextLon,
            accuracy: nextAccuracy,
            timestamp: position.timestamp,
          };
          return;
        }

        const segmentDistance = calculateDistance(
          previous.latitude,
          previous.longitude,
          nextLat,
          nextLon
        );

        const elapsedHours =
          (position.timestamp - previous.timestamp) / 3_600_000;
        const maxSpeedKmh = {
          Running: 25,
          Walking: 12,
          Cycling: 80,
        }[activity];

        if (
          elapsedHours <= 0 ||
          segmentDistance / elapsedHours > maxSpeedKmh
        ) {
          previousPositionRef.current = {
            latitude: nextLat,
            longitude: nextLon,
            accuracy: nextAccuracy,
            timestamp: position.timestamp,
          };
          return;
        }

        distanceRef.current += segmentDistance;
        setDistance(distanceRef.current);

        previousPositionRef.current = {
          latitude: nextLat,
          longitude: nextLon,
          accuracy: nextAccuracy,
          timestamp: position.timestamp,
        };
      },
      handleGpsError,
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 30000,
      }
      );
    } catch (error) {
      trackingRef.current = false;
      clearTrackingResources();
      setTracking(false);
      const message = getGpsErrorMessage(error);
      setGpsStatus(message);
      toast.error(message);
      return;
    }

    toast.info("Waiting for a GPS location fix...");
  };

  // Clean up if the user leaves this page
  useEffect(() => {
    return () => {
      trackingRef.current = false;
      clearTrackingResources();
    };
  }, []);

  // Format seconds as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="font-bold uppercase tracking-widest text-lime-500">
          FitTrack
        </p>

        <h1 className="mt-2 text-3xl font-black md:text-4xl">
          GPS Workout Tracker
        </h1>

        <p className="mt-3 text-base-content/70">
          Track your running, walking, and cycling distance.
        </p>

        <div className="mt-8 space-y-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
          <div>
            <label className="mb-2 block font-semibold">
              Choose Activity
            </label>

            <select
              className="select select-bordered w-full"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              disabled={tracking}
            >
              <option value="Running">Running</option>
              <option value="Walking">Walking</option>
              <option value="Cycling">Cycling</option>
            </select>
          </div>

          <div className="text-center">
            <p className="text-sm text-base-content/60">
              Distance Travelled
            </p>

            <p className="mt-2 text-5xl font-black text-lime-500">
              {distance.toFixed(3)} km
            </p>

            <p className="mt-6 text-sm text-base-content/60">
              Elapsed Time
            </p>

            <p className="mt-1 text-3xl font-bold">
              {formatTime(elapsedTime)}
            </p>

            {accuracy !== null && (
              <p className="mt-2 text-xs text-base-content/50">
                Location accuracy: ±{accuracy} m
              </p>
            )}

            <p className="mt-3 text-sm text-base-content/70">
              {gpsStatus}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              onClick={handleStart}
              disabled={tracking}
              className="w-full sm:w-auto"
            >
              Start Tracking
            </Button>

            <Button
              type="button"
              onClick={handleStop}
              disabled={!tracking}
              variant="danger"
              className="w-full sm:w-auto"
            >
              Stop
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              disabled={tracking || saving || saved || distance <= 0}
              className="w-full sm:w-auto"
            >
              {saved
                ? "Saved"
                : saving
                  ? "Saving..."
                  : "Save Workout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPSTracker;