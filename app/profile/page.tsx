"use client";

import { UserIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/profile';
import { Profile } from '@/app/types/profile';

const ProfilePage = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const fetchedProfile = await getProfile();
        setUser(fetchedProfile);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Profile could not be loaded.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-center text-(--text-primary)">Profile</h2>
        <div className="flex items-center mb-4 text-(--text-primary)">
          <UserIcon className="w-12 h-12 mr-4" />
          <h3 className="text-2xl font-bold">{user.name}</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-(--text-primary)">
            <span className="font-medium">Studentnumber</span>
            <span className="px-4 py-1 bg-(--bg-input) rounded-full">{user.studentNumber}</span>
          </div>
          <div className="flex justify-between items-center text-(--text-primary)">
            <span className="font-medium">E-mail</span>
            <span className="px-4 py-1 bg-(--bg-input) rounded-full">{user.email}</span>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;
