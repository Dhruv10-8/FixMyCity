"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
// Dynamically import AllMap
const AllMap = dynamic(() => import("../../components/AllMap"), {
  ssr: false,
});

const Mapspage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/issues");
        setIssues(res.data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  return (
    <>
      <Navbar/>
      <main className="max-w-6xl mx-auto px-4 py-6 h-screen">
        <h1 className="text-2xl font-bold mb-4">City Hazard Map</h1>
        <p className="text-gray-600 mb-6">
          View all reported infrastructure issues on the map.
        </p>
        <p className="text-gray-600 mb-6">
          Color Scheme: 🔴 High Danger,🟡 Medium Danger,🟢 Low Danger,🔘 Unknown Danger
        </p>
        {loading ? (
          <p>Loading map and issues...</p>
        ) : (
          <div className="h-full">
            <AllMap issues={issues} /> {/* Passing the issues directly */}
          </div>
        )}
      </main>
    </>
  );
};

export default Mapspage;
