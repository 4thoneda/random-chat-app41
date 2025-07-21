import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { Settings, User, Bug, ArrowLeft, Database } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-25 via-cream-50 to-blush-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-peach-600 hover:text-peach-700 hover:bg-peach-100"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-peach-800">Profile</h1>
          <div className="w-10"></div>
        </div>

        {/* User Info Card */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-peach-200 rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-peach-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-peach-800">Guest User</h2>
              <p className="text-sm text-peach-600">Anonymous User</p>
            </div>
          </div>
        </Card>

        {/* Settings Section */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-peach-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-5 w-5 text-peach-600" />
            <h2 className="text-lg font-semibold text-peach-800">Settings & Tools</h2>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/firebase-debug')}
              variant="outline"
              className="w-full justify-start gap-3 text-peach-700 border-peach-200 hover:bg-peach-50 hover:border-peach-300"
            >
              🔥
              <span>Firebase Debug Dashboard</span>
            </Button>
            
            <Button
              onClick={() => navigate('/storage-debug')}
              variant="outline"
              className="w-full justify-start gap-3 text-peach-700 border-peach-200 hover:bg-peach-50 hover:border-peach-300"
            >
              <Database className="h-4 w-4" />
              <span>Storage Debug</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
