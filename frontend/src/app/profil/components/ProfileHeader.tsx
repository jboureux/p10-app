"use client";

export default function ProfileHeader() {
  const handleLogout = () => {
    // TODO: add logout logic and redirect to login page
  };

  return (
    <div className="text-white px-4 py-4 lg:px-0 text-end">
      <button
        onClick={handleLogout}
        className="text-sm text-gray-800 hover:text-red-200 cursor-pointer"
      >
        Se déconnecter
      </button>
    </div>
  );
}
