import React from "react";
import { getUser } from "./Login";
import { User, Shield, KeyRound } from "lucide-react";

const Profile = () => {
  const user = getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {user?.username}
          </h1>
          <p className="text-white/80 text-sm">
            Employee Account
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Username Card */}
          <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-700 rounded-xl p-4 hover:scale-[1.02] transition">
            <User className="text-blue-400" />
            <div>
              <p className="text-slate-400 text-sm">Username</p>
              <p className="text-white font-semibold">
                {user?.username}
              </p>
            </div>
          </div>

          {/* Role Card */}
          <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-700 rounded-xl p-4 hover:scale-[1.02] transition">
            <Shield className="text-green-400" />
            <div>
              <p className="text-slate-400 text-sm">Role</p>
              <p className="text-white font-semibold">
                {user?.role || "User"}
              </p>
            </div>
          </div>

          {/* Password Card */}
          <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-700 rounded-xl p-4 hover:scale-[1.02] transition">
            <KeyRound className="text-yellow-400" />
            <div>
              <p className="text-slate-400 text-sm">Password</p>
              <p className="text-white font-semibold">
                {user?.password ? "••••••••" : "Not available"}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-xs pb-4">
          Secure Employee Profile
        </div>

      </div>
    </div>
  );
};

export default Profile;