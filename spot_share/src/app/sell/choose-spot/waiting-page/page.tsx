'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, DollarSign, Users, Edit2, X, Bell, Eye } from 'lucide-react';
import { useLocation } from "@/components/contexts/LocationContext";

interface Activity {
  id: number;
  type: 'view' | 'listed';
  time: string;
  message: string;
}

export default function WaitingPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { userLocation } = useLocation();
  const [viewCount, setViewCount] = useState<number>(3);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(30);
  const [matchFound, setMatchFound] = useState<boolean>(false);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([
    { id: 1, type: 'view', time: '2 mins ago', message: 'Someone viewed your spot' },
    { id: 2, type: 'view', time: '5 mins ago', message: 'Someone viewed your spot' },
    { id: 3, type: 'listed', time: '7 mins ago', message: 'Your spot is now live' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // Countdown timer for auto-redirect
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setMatchFound(true);
          // Redirect to ETA page after countdown
          setTimeout(() => {
            window.location.href = 'http://localhost:3000/sell/choose-spot/waiting-page/eta';
          }, 2000); // Wait 2 seconds after showing "Match Found!" message
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate view updates
    const viewTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        setViewCount(prev => prev + 1);
        setRecentActivity(prev => [
          { id: Date.now(), type: 'view', time: 'Just now', message: 'Someone viewed your spot' },
          ...prev.slice(0, 4)
        ]);
      }
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(countdownTimer);
      clearInterval(viewTimer);
    };
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Don't initialize map until we have user location
    if (!userLocation) return;

    // Google Maps is loaded via GoogleMapsProvider, just initialize when ready
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Wait for GoogleMapsProvider to load the script
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, [userLocation]);

  const initMap = () => {
    if (
      !mapRef.current ||
      typeof window === "undefined" ||
      !window.google ||
      !window.google.maps ||
      !userLocation
    ) {
      console.log("Map not ready");
      return;
    }

    try {
      // Parking spot location
      const parkingLot = { lat: 33.966566, lng: -118.417312 };

      // Seller's location (user location)
      const sellerLocation = { lat: userLocation.lat, lng: userLocation.lng };

      const map = new window.google.maps.Map(mapRef.current, {
        center: parkingLot,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });

      // Red parking spot marker
      new window.google.maps.Marker({
        position: parkingLot,
        map: map,
        title: "Parking Spot",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#EF4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });

      // Add red double pulse overlay
      class RedPulseOverlay extends window.google.maps.OverlayView {
        position: google.maps.LatLng;
        div: HTMLDivElement | null = null;

        constructor(position: google.maps.LatLng) {
          super();
          this.position = position;
        }

        onAdd() {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.pointerEvents = 'none';
          div.style.width = '0px';
          div.style.height = '0px';
          
          const pulse1 = document.createElement('div');
          pulse1.className = 'pulse-ring';
          pulse1.style.position = 'absolute';
          pulse1.style.left = '-7.5px';
          pulse1.style.top = '-7.5px';
          pulse1.style.width = '15px';
          pulse1.style.height = '15px';
          pulse1.style.borderRadius = '50%';
          pulse1.style.background = '#E82A2A';
          pulse1.style.opacity = '0.6';

          const pulse2 = document.createElement('div');
          pulse2.className = 'pulse-ring';
          pulse2.style.position = 'absolute';
          pulse2.style.left = '-7.5px';
          pulse2.style.top = '-7.5px';
          pulse2.style.width = '15px';
          pulse2.style.height = '15px';
          pulse2.style.borderRadius = '50%';
          pulse2.style.background = '#E82A2A';
          pulse2.style.opacity = '0.85';
          pulse2.style.animationDelay = '0.2s';
          
          div.appendChild(pulse1);
          div.appendChild(pulse2);
          this.div = div;
          
          const panes = this.getPanes();
          if (panes) {
            panes.overlayMouseTarget.appendChild(div);
          }
        }

        draw() {
          if (!this.div) return;
          
          const overlayProjection = this.getProjection();
          const position = overlayProjection.fromLatLngToDivPixel(this.position);
          
          if (position) {
            this.div.style.left = position.x + 'px';
            this.div.style.top = position.y + 'px';
            this.div.style.transform = 'translate(-50%, -50%)';
          }
        }

        onRemove() {
          if (this.div && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
          }
        }
      }

      const redPulseOverlay = new RedPulseOverlay(new window.google.maps.LatLng(parkingLot.lat, parkingLot.lng));
      redPulseOverlay.setMap(map);

      // Blue seller marker
      new window.google.maps.Marker({
        position: sellerLocation,
        map: map,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#0C76F2",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      });

      // Add blue pulse overlay
      class BluePulseOverlay extends window.google.maps.OverlayView {
        position: google.maps.LatLng;
        div: HTMLDivElement | null = null;

        constructor(position: google.maps.LatLng) {
          super();
          this.position = position;
        }

        onAdd() {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.pointerEvents = 'none';
          
          const pulse = document.createElement('div');
          pulse.className = 'pulse-ring';
          pulse.style.width = '20px';
          pulse.style.height = '20px';
          pulse.style.borderRadius = '50%';
          pulse.style.background = '#59A3FF';
          pulse.style.opacity = '0.6';
          
          div.appendChild(pulse);
          this.div = div;
          
          const panes = this.getPanes();
          if (panes) {
            panes.overlayMouseTarget.appendChild(div);
          }
        }

        draw() {
          if (!this.div) return;
          
          const overlayProjection = this.getProjection();
          const position = overlayProjection.fromLatLngToDivPixel(this.position);
          
          if (position) {
            this.div.style.left = position.x + 'px';
            this.div.style.top = position.y + 'px';
            this.div.style.transform = 'translate(-50%, -50%)';
          }
        }

        onRemove() {
          if (this.div && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
          }
        }
      }

      const bluePulseOverlay = new BluePulseOverlay(new window.google.maps.LatLng(sellerLocation.lat, sellerLocation.lng));
      bluePulseOverlay.setMap(map);

      // Fit bounds to show both markers
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(parkingLot);
      bounds.extend(sellerLocation);
      map.fitBounds(bounds);

      console.log("Map initialized successfully");
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bannerClasses = matchFound 
    ? 'rounded-2xl p-8 mb-6 text-white transition-all duration-500 bg-gradient-to-r from-green-600 to-green-700'
    : 'rounded-2xl p-8 mb-6 text-white transition-all duration-500 bg-gradient-to-r from-blue-600 to-blue-700';

  const statusDotClasses = matchFound ? 'w-3 h-3 rounded-full bg-green-300' : 'w-3 h-3 rounded-full bg-green-400 animate-pulse';
  const statusTextClasses = matchFound ? 'text-lg text-green-100' : 'text-lg text-blue-100';
  const timerLabelClasses = matchFound ? 'text-sm mb-1 text-green-100' : 'text-sm mb-1 text-blue-100';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">
              Spot <span className="text-blue-600">Share</span>
            </h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className={bannerClasses}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={statusDotClasses}></div>
                <span className="text-lg font-semibold">
                  {matchFound ? 'Match Found!' : 'Your spot is live!'}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {matchFound ? 'Buyer is on their way!' : 'Waiting for a buyer...'}
              </h2>
              <p className={statusTextClasses}>
                {matchFound 
                  ? 'Redirecting to tracking page...' 
                  : 'Your parking spot is now visible to nearby drivers looking for parking'}
              </p>
            </div>
            <div className="text-right">
              <div className={timerLabelClasses}>
                {matchFound ? 'Redirecting in' : 'Time Listed'}
              </div>
              <div className="text-3xl font-bold">
                {matchFound ? `${countdown}s` : formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spot Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Your Spot Details</h3>
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="font-semibold text-gray-900">
                      Lat: 33.967012, Lng: -118.417280
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Near Marina Del Rey, Los Angeles
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Price</div>
                    <div className="font-semibold text-gray-900 text-2xl">$4.00</div>
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="mt-6 rounded-lg overflow-hidden border border-gray-200">
                <div 
                  ref={mapRef}
                  className="relative h-64 bg-gray-200"
                  style={{ minHeight: "256px" }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Live Stats</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Views</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{viewCount}</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Nearby Buyers</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">12</div>
                </div>
              </div>
            </div>

            {/* Average Wait Time */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Average Wait</h3>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">1 minute</div>
              <p className="text-sm text-gray-600">
                Most spots in this area get matched within 3 minutes
              </p>
            </div>

            {/* Cancel Button */}
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition font-medium border border-red-200">
              <X className="w-5 h-5" />
              <span>Cancel Listing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: any;
  }
}