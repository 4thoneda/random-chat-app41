// Razorpay integration for premium purchase
const RAZORPAY_KEY_ID = "rzp_test_1234567890"; // Use test key for development


import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Crown, Check, X } from "lucide-react";

interface PremiumPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (plan: string) => void;
}

export default function PremiumPaywall({ isOpen, onClose, onPurchase }: PremiumPaywallProps) {

  const [selectedPlan, setSelectedPlan] = useState<string>("vip-weekly");

  // Razorpay handler
  const handleRazorpay = async (): Promise<void> => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;
    
    // Check if Razorpay is loaded
    if (typeof window.Razorpay === 'undefined') {
      console.error('Razorpay SDK not loaded');
      // Fallback to direct purchase
      onPurchase(selectedPlan);
      return;
    }
    
    const amount = plan.id === "weekly" ? 9900 : 29900; // in paise (₹99/₹299)
    const options = {
      key: RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      name: "AjnabiCam Premium",
      description: plan.name,
      image: "/logo.png",
      handler: function (response: any) {
        // On successful payment
        console.log('Payment successful:', response);
        onPurchase(selectedPlan);
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
        }
      },
      prefill: {},
      theme: { color: "#a21caf" },
    };
    
    try {
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      // Fallback to direct purchase
      onPurchase(selectedPlan);
    }
  };


  if (!isOpen) return null;

  const plans = [
    {
      id: "weekly",
      name: "Weekly Premium",
      price: "₹99",
      duration: "/week",
      savings: "",
      popular: false
    },
    {
      id: "monthly",
      name: "Monthly Premium", 
      price: "₹299",
      duration: "/month",
      savings: "Save ₹97!",
      popular: true
    }
  ];

  const features = [
    "🚫 Ad-Free Experience - No interruptions, pure chatting",
    "🎙️ Voice-Only Mode - Audio calls without video",
    "🚻 Gender Filter - Choose who you want to chat with",
    "⏰ Unlimited Chat Time - No more time limits!",
    "👑 Premium Badge - Show off your status",
    "🎯 Priority Matching - Get connected faster"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 p-1"
          >
            <X size={20} />
          </Button>
          <div className="flex justify-center mb-2">
            <Crown className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Upgrade to Premium! 💎
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Unlock amazing features and enhance your chat experience
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 dark:text-white">What you'll get:</h3>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing Plans */}
          <div className="space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                } ${plan.popular ? "ring-2 ring-purple-400" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                    Most Popular! 🔥
                  </span>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{plan.name}</h4>
                    {plan.savings && (
                      <p className="text-sm text-green-600 font-medium">{plan.savings}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-purple-600">{plan.price}</span>
                    <span className="text-gray-500">{plan.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handleRazorpay}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-200"
          >
            🚀 Get Premium Now - {plans.find(p => p.id === selectedPlan)?.price}
          </Button>

          <p className="text-xs text-center text-gray-500">
            💳 Pay easily with <span className="font-semibold text-purple-700">UPI (preselected)</span>, Cards, Wallets, or Netbanking<br />
            🔒 Secure payment • Cancel anytime • 💯 30-day money-back guarantee
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
