"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";

type Issue = {
  _id: string;
  title: string;
  description: string;
  location: {
    coordinates: [number, number];
  };
  image?: {
    url: string;
  };
  upvotes: number;
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [search, setSearch] = useState("");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/issues");
        setIssues(res.data);
        setFilteredIssues(res.data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      }
    };
    fetchIssues();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredIssues(
      issues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(lowerSearch) ||
          issue.description.toLowerCase().includes(lowerSearch)
      )
    );
  }, [search, issues]);

  // const handleUpvote = async (issueId: string) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       alert("Please login to upvote.");
  //       return;
  //     }

  //     const res = await axios.put(
  //       `http://localhost:5000/api/issues/${issueId}/upvote`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setIssues((prev) =>
  //       prev.map((issue) =>
  //         issue._id === issueId
  //           ? { ...issue, upvotes: res.data.upvotes }
  //           : issue
  //       )
  //     );
  //   } catch (error: any) {
  //     alert(error?.response?.data?.message || "Failed to upvote.");
  //   }
  // };

  return (
    <>
    <Navbar/>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">All Reported Issues</h1>

        <input
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md mb-6"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue) => {
            const [lon, lat] = issue.location.coordinates;
            return (
              <div key={issue._id} className="border rounded-lg shadow p-4">
                {issue.image?.url && (
                  <Image
                    src={issue.image.url}
                    alt={issue.title}
                    className="h-48 w-full object-cover rounded-md mb-3"
                    width={200}
                    height={200}
                  />
                )}
                <h2 className="text-lg font-semibold">{issue.title}</h2>
                <p className="text-gray-600 mb-2">{issue.description}</p>
                <p className="text-sm text-gray-500">
                  📍 {lat.toFixed(4)}, {lon.toFixed(4)}
                </p>
                <p className="mt-2 text-sm">
                  <strong>Danger Level:</strong> <em>{issue.dangerLevel}</em>
                </p>
                {/* <button
                  onClick={() => handleUpvote(issue._id)}
                  className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  👍 Upvote ({issue.upvotes})
                </button> */}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
