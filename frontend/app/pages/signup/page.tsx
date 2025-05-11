/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setname] = React.useState("");
  const [email, setemail] = React.useState("");
  const [number, setnumber] = React.useState("");
  const [password, setpassword] = React.useState("");
  const router = useRouter();

  const handleInput = async (e: any) => {
    e.preventDefault();
    if (!name || !email || !number || !password) {
      alert("Please fill all the fields");
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        number,
        password,
      });
      console.log(res.data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      router.push("../pages/login");
    } catch (error) {
      console.log("Sign Up Failed");
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="flex justify-center mb-6">
          <div className="rounded-full p-3">
            <UserPlus size={32} className="text-black" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-600 text-center mb-6">
          Join our community to report and track local issues
        </p>

        <form>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={number}
              onChange={(e) => setnumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded font-medium mb-4"
            onClick={handleInput}
          >
            Create Account
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{" "}
            <Link href="../pages/login" className="text-black font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
