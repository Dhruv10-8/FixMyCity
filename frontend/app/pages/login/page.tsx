/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const [email, setemail] = React.useState('')
  const [password, setpassword] = React.useState('')
  const router = useRouter()
  
  const handleInput = async (e: any) => {
    e.preventDefault()
    if (!email || !password){
      alert('Please fill in all fields')
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email,
        password: password
      })
      console.log(res)
      if (res.data.token){
        localStorage.setItem('token', res.data.token)
      }
      router.push('../pages/dashboard')
    } catch (error) {
      console.log(error)
      console.log("Error while signing in")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="flex justify-center mb-6">
          <div className="rounded-full p-3">
            <LogIn size={32} className="text-black" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-6">Enter your credentials to access your account</p>
        
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e)=>setemail(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e)=>setpassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded font-medium mb-4"
            onClick = {handleInput}
          >
            Sign in
          </button>
          
          <div className="text-center text-sm">
            <span className="text-gray-600">Do not have an account?</span>{' '}
            <Link href="../pages/signup" className="text-black font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}