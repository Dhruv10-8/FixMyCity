"use client";
import Link from "next/link";
import { Map, AlertTriangle, Users } from "lucide-react";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const handleReport = () => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("../pages/report");
    } else {
      router.push("../pages/signup");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">FixMyCity</h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Help make our community safer by reporting and tracking civic
            issues. Together, we can prioritize and address problems that matter
            most.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={handleReport}
              className="bg-black text-white px-6 py-3 rounded font-medium"
            >
              Report an Issue
            </button>
            <Link
              href="../pages/issues"
              className="bg-white border border-gray-300 px-6 py-3 rounded font-medium"
            >
              Explore Issues
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4 p-2 inline-block bg-gray-100 rounded">
                <Map size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location Mapping</h3>
              <p className="text-gray-600">
                Precisely locate and track issues using interactive maps for
                better coordination.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4 p-2 inline-block bg-gray-100 rounded">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Risk Assessment</h3>
              <p className="text-gray-600">
                Advanced AI analysis to determine issue priority based on
                surrounding infrastructure.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4 p-2 inline-block bg-gray-100 rounded">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Upvote important issues and collaborate with your community for
                faster resolution.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
