"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { Camera, Map, AlertCircle, BarChart2, Sun } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import dynamic from "next/dynamic";
import Navbar from "@/app/components/Navbar";
const IssueMap = dynamic(() => import("../../components/IssueMap"), {
  ssr: false,
});

const ReportIssuePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!title || !description || !category) {
      setError("Please fill out all required fields");
      setIsSubmitting(false);
      return;
    }

    if (lat === null || lon === null) {
      setError("Please select a location on the map");
      setIsSubmitting(false);
      return;
    }
    console.log({ lat, lon });
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      console.log({ lon, lat });
      formData.append("lat", lat.toString());
      formData.append("lon", lon.toString());
      formData.append("category", category);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/issues",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error submitting report:", err);
      setError(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Failed to get your location. Please select manually.");
        }
      );
    } else {
      setError("Geolocation not supported.");
    }
  };

  return (
    <>
      <Head>
        <title>Report an Issue | CivicWatch</title>
        <meta
          name="description"
          content="Report infrastructure problems in your community"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Report an Issue
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Help improve your community by reporting infrastructure problems
            </p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              {/* Photo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6">
                  {imagePreview ? (
                    <div className="relative h-48 flex justify-center">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={300}
                        height={300}
                        className="max-h-48 mx-auto rounded object-contain"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <p className="text-sm font-medium text-blue-600">
                          Upload a photo
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPEG, PNG or WebP, up to 5MB
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        Select image
                      </button>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Issue Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Large pothole on Main Street"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="pothole">Roads & Potholes</option>
                  <option value="streetlight">Street Lights</option>
                  <option value="other">Sidewalks</option>
                  <option value="garbage">Trash & Debris</option>
                  <option value="other">Graffiti</option>
                  <option value="leak">Water Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Location Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Pick Issue Location
                </label>
                <div className="h-64 mt-2 rounded-md overflow-hidden">
                  <IssueMap
                    lat={lat}
                    lon={lon}
                    setLat={setLat}
                    setLon={setLon}
                  />
                </div>
                <button
                  type="button"
                  onClick={useMyLocation}
                  className="mt-2 text-blue-600 text-sm"
                >
                  📍 Use my current location
                </button>
                {lat && lon && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {lat.toFixed(6)}, {lon.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => router.push("../pages/report")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default ReportIssuePage;
