"use client";
import { Flag, ThumbsUp } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";

export default function UserDashboardPage() {
  const [user, setUser] = React.useState(null);
  const [issues, setIssues] = React.useState([]);
  const [reports, setReports] = React.useState(0);
  const [upvotes, setUpvotes] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("../pages/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token"); // Clean token if invalid
        router.push("../pages/login");
      }
    };
    fetchUser();
  }, [router]);

  React.useEffect(() => {
    const fetchIssues = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/userissues",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        setIssues(res.data.issues);
        setReports(res.data.totalReports);
        setUpvotes(res.data.totalUpvotesRecieved);
      } catch (error) {
        console.log(error);
      }
    };
    fetchIssues();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("../pages/login");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const userInitial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <>
      <Navbar/>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center my-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded font-medium flex items-center"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar - User info */}
          <div className="col-span-12 md:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-medium mb-4">
                  {userInitial}
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-gray-400 text-xs mt-1">({user.role})</p>{" "}
                {/* 👈 Show role */}
              </div>

              <button className="w-full py-2 border border-gray-300 rounded font-medium mb-6">
                Edit Profile
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reports created</span>
                  <span className="font-medium">{reports}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upvotes received</span>
                  <span className="font-medium">{upvotes}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4">Community Impact</h3>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded">
                  <Flag size={18} className="mx-auto mb-1" />
                  <div className="font-bold text-lg">{reports}</div>
                  <div className="text-xs text-gray-500">Reports</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <ThumbsUp size={18} className="mx-auto mb-1" />
                  <div className="font-bold text-lg">{upvotes}</div>
                  <div className="text-xs text-gray-500">Upvotes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="col-span-12 md:col-span-9">
            <h2 className="text-xl font-bold mb-4">Your Reported Issues</h2>
            {issues.length === 0 ? (
              <p className="text-gray-500">
                You haven't reported any issues yet.
              </p>
            ) : (
              <div className="grid gap-4">
                {issues.map((issue) => (
                  <div
                    key={issue._id}
                    className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{issue.title}</h3>
                      <p className="text-sm text-gray-600">
                        {issue.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Category:{" "}
                        <span className="font-medium">{issue.category}</span> |
                        Status:{" "}
                        <span className="font-medium">{issue.status}</span>
                      </p>
                    </div>
                    {issue.image?.url && (
                      <Image
                        src={issue.image.url}
                        alt="Issue"
                        className="w-24 h-24 object-cover rounded mt-4 md:mt-0 md:ml-4"
                        width={200}
                        height={200}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
