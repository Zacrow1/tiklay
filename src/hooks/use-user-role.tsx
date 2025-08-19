"use client"

import { useState, useEffect } from "react"

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT"

export function useUserRole() {
  const [role, setRole] = useState<UserRole>("STUDENT")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate getting user role from localStorage or API
    // In a real app, this would come from authentication context
    const savedRole = localStorage.getItem("userRole") as UserRole
    if (savedRole) {
      setRole(savedRole)
    } else {
      // Default to admin for demo purposes
      setRole("ADMIN")
      localStorage.setItem("userRole", "ADMIN")
    }
    setLoading(false)
  }, [])

  const setRoleAndSave = (newRole: UserRole) => {
    setRole(newRole)
    localStorage.setItem("userRole", newRole)
  }

  return { role, setRole: setRoleAndSave, loading }
}