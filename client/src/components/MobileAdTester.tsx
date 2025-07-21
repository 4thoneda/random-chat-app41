import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Smartphone, Play, Gift, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { mobileAdService } from '../lib/mobileAdService';
import { useCoin } from '../context/CoinProvider';

export default function MobileAdTester() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addCoins } = useCoin();

  useEffect(() => {
    initializeMobileAds();
  }, []);

  const initializeMobileAds = async () => {
    setIsLoading(true);
    try {
      const success = await mobileAdService.initialize();
      setIsInitialized(success);
      addTestResult('Initialization', success, success ? 'AdMob initialized successfully' : 'Failed to initialize AdMob');
    } catch (error) {
      addTestResult('Initialization', false, `Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addTestResult = (test: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testBannerAd = async () => {
    setIsLoading(true);
    try {
      const success = await mobileAdService.showBannerAd();
      addTestResult('Banner Ad', success, success ? 'Banner ad displayed' : 'Banner ad failed to load');
    } catch (error) {
      addTestResult('Banner Ad', false, `Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testInterstitialAd = async () => {
    setIsLoading(true);
    try {
      const success = await mobileAdService.showInterstitialAd();
      addTestResult('Interstitial Ad', success, success ? 'Interstitial ad displayed' : 'Interstitial ad failed to load');
    } catch (error) {
      addTestResult('Interstitial Ad', false, `Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testRewardedAd = async () => {
    setIsLoading(true);
    try {
      const result = await mobileAdService.showRewardedAd();
      if (result.success) {
        await addCoins(result.reward);
        addTestResult('Rewarded Ad', true, `Rewarded ad completed! Earned ${result.reward} coins`);
      } else {
        addTestResult('Rewarded Ad', false, 'Rewarded ad failed to complete');
      }
    } catch (error) {
      addTestResult('Rewarded Ad', false, `Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const isMobile = !!(window as any).Capacitor;

  return (
    <div className="space-y-6">
      {/* Mobile Detection */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            Mobile Environment Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {isMobile ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Running on Mobile (Capacitor detected)</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-orange-600" />
                <span className="text-orange-700 font-medium">Running on Web (Mobile simulation mode)</span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {isMobile 
              ? 'Perfect! You can test real mobile ads.' 
              : 'Build the APK to test real mobile ads. Current tests will simulate mobile behavior.'
            }
          </p>
        </CardContent>
      </Card>

      {/* AdMob Configuration */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            AdMob Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>App ID:</strong> {mobileAdService.getConfig().appId}</div>
            <div><strong>Banner ID:</strong> {mobileAdService.getConfig().bannerAdUnitId}</div>
            <div><strong>Interstitial ID:</strong> {mobileAdService.getConfig().interstitialAdUnitId}</div>
            <div><strong>Rewarded ID:</strong> {mobileAdService.getConfig().rewardedAdUnitId}</div>
            <div><strong>Test Mode:</strong> {mobileAdService.getConfig().testMode ? 'Yes' : 'No'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Ad Testing Controls */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle>Ad Testing Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={testBannerAd}
              disabled={!isInitialized || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Test Banner Ad
            </Button>

            <Button
              onClick={testInterstitialAd}
              disabled={!isInitialized || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Test Interstitial
            </Button>

            <Button
              onClick={testRewardedAd}
              disabled={!isInitialized || isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Gift className="h-4 w-4 mr-2" />
              Test Rewarded Ad
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={initializeMobileAds}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? 'Initializing...' : 'Reinitialize AdMob'}
            </Button>

            <Button
              onClick={clearResults}
              variant="outline"
              className="flex-1"
            >
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle>Test Results ({testResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{result.test}</span>
                    <span className="text-xs text-gray-500 ml-auto">{result.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{result.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">📱 Mobile Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Build the APK using: <code className="bg-yellow-200 px-1 rounded">npm run mobile:build</code></li>
            <li>Install the APK on your Android device</li>
            <li>Open the app and navigate to this testing page</li>
            <li>Test each ad type and verify they display correctly</li>
            <li>Check your AdMob dashboard for impressions and earnings</li>
            <li>Monitor app performance and user experience</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}