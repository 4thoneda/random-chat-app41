/**
 * Mobile-specific AdMob service for Android/iOS apps
 * This service handles native mobile ad integration
 */

interface MobileAdConfig {
  appId: string;
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  rewardedAdUnitId: string;
  testMode: boolean;
}

class MobileAdService {
  private static instance: MobileAdService;
  private config: MobileAdConfig;
  private isInitialized = false;

  private constructor() {
    this.config = {
      appId: import.meta.env.VITE_ADMOB_APP_ID || 'ca-app-pub-1776596266948987~1234567890',
      bannerAdUnitId: import.meta.env.VITE_ADMOB_BANNER_ID || 'ca-app-pub-1776596266948987/2770517385',
      interstitialAdUnitId: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-1776596266948987/2725273599',
      rewardedAdUnitId: import.meta.env.VITE_ADMOB_REWARDED_ID || 'ca-app-pub-1776596266948987/9705792525',
      testMode: import.meta.env.DEV || false
    };
  }

  static getInstance(): MobileAdService {
    if (!MobileAdService.instance) {
      MobileAdService.instance = new MobileAdService();
    }
    return MobileAdService.instance;
  }

  /**
   * Initialize AdMob for mobile
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🎯 Initializing Mobile AdMob Service...');
      console.log('📱 App ID:', this.config.appId);
      console.log('🧪 Test Mode:', this.config.testMode);

      // Check if we're running in a mobile environment
      if (this.isMobileEnvironment()) {
        // In a real Capacitor app, you would use the AdMob plugin here
        // For now, we'll simulate mobile ad behavior
        console.log('📱 Mobile environment detected');
        
        // Simulate AdMob initialization
        await this.simulateMobileAdInit();
        
        this.isInitialized = true;
        console.log('✅ Mobile AdMob initialized successfully');
        return true;
      } else {
        console.log('🌐 Web environment - using web ad service');
        // Fall back to web ads
        return false;
      }
    } catch (error) {
      console.error('❌ Mobile AdMob initialization failed:', error);
      return false;
    }
  }

  /**
   * Check if running in mobile environment
   */
  private isMobileEnvironment(): boolean {
    // Check for Capacitor
    return !!(window as any).Capacitor;
  }

  /**
   * Simulate mobile ad initialization
   */
  private async simulateMobileAdInit(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('📱 AdMob SDK initialized');
        console.log('🎯 Ad units configured:');
        console.log('  - Banner:', this.config.bannerAdUnitId);
        console.log('  - Interstitial:', this.config.interstitialAdUnitId);
        console.log('  - Rewarded:', this.config.rewardedAdUnitId);
        resolve();
      }, 1000);
    });
  }

  /**
   * Show banner ad
   */
  async showBannerAd(): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('⚠️ AdMob not initialized');
      return false;
    }

    try {
      console.log('📱 Showing mobile banner ad...');
      
      if (this.isMobileEnvironment()) {
        // In a real app, this would call the Capacitor AdMob plugin
        // await AdMob.showBanner({
        //   adId: this.config.bannerAdUnitId,
        //   adSize: BannerAdSize.BANNER,
        //   position: BannerAdPosition.BOTTOM_CENTER
        // });
        
        // Simulate banner ad
        this.simulateBannerAd();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Failed to show banner ad:', error);
      return false;
    }
  }

  /**
   * Show interstitial ad
   */
  async showInterstitialAd(): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('⚠️ AdMob not initialized');
      return false;
    }

    try {
      console.log('🎬 Showing mobile interstitial ad...');
      
      if (this.isMobileEnvironment()) {
        // In a real app:
        // await AdMob.prepareInterstitial({
        //   adId: this.config.interstitialAdUnitId
        // });
        // await AdMob.showInterstitial();
        
        // Simulate interstitial ad
        return await this.simulateInterstitialAd();
      }
      
      return false;
    } catch (error) {
      console.error('❌ Failed to show interstitial ad:', error);
      return false;
    }
  }

  /**
   * Show rewarded ad
   */
  async showRewardedAd(): Promise<{ success: boolean; reward: number }> {
    if (!this.isInitialized) {
      console.warn('⚠️ AdMob not initialized');
      return { success: false, reward: 0 };
    }

    try {
      console.log('💰 Showing mobile rewarded ad...');
      
      if (this.isMobileEnvironment()) {
        // In a real app:
        // await AdMob.prepareRewardVideoAd({
        //   adId: this.config.rewardedAdUnitId
        // });
        // const result = await AdMob.showRewardVideoAd();
        
        // Simulate rewarded ad
        return await this.simulateRewardedAd();
      }
      
      return { success: false, reward: 0 };
    } catch (error) {
      console.error('❌ Failed to show rewarded ad:', error);
      return { success: false, reward: 0 };
    }
  }

  /**
   * Simulate banner ad for testing
   */
  private simulateBannerAd(): void {
    // Create a mobile-style banner ad overlay
    const banner = document.createElement('div');
    banner.id = 'mobile-banner-ad';
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
    `;
    banner.innerHTML = '📱 Mobile AdMob Banner - Tap to close';
    
    banner.onclick = () => banner.remove();
    document.body.appendChild(banner);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 10000);
  }

  /**
   * Simulate interstitial ad for testing
   */
  private simulateInterstitialAd(): Promise<boolean> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      `;

      overlay.innerHTML = `
        <div style="
          background: white;
          padding: 40px;
          border-radius: 15px;
          text-align: center;
          max-width: 350px;
          margin: 20px;
        ">
          <h2 style="color: #4285f4; margin-bottom: 20px;">📱 Mobile AdMob</h2>
          <p style="margin-bottom: 20px;">Interstitial Ad Test</p>
          <div style="background: #f0f0f0; padding: 30px; margin: 20px 0; border-radius: 10px;">
            <p style="font-size: 18px; margin: 10px 0;">🎯 Native Mobile Ad</p>
            <p style="font-size: 12px; color: #999;">Running on Android/iOS</p>
          </div>
          <p style="font-size: 12px; color: #999;">Tap anywhere to continue</p>
        </div>
      `;

      document.body.appendChild(overlay);

      const closeAd = () => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        resolve(true);
      };

      setTimeout(closeAd, 5000);
      overlay.addEventListener('click', closeAd);
    });
  }

  /**
   * Simulate rewarded ad for testing
   */
  private simulateRewardedAd(): Promise<{ success: boolean; reward: number }> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      let watchTime = 0;
      const requiredWatchTime = 5; // 5 seconds for mobile

      overlay.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
          color: white;
          padding: 40px;
          border-radius: 15px;
          text-align: center;
          max-width: 350px;
          margin: 20px;
        ">
          <h2 style="margin-bottom: 20px;">💰 Mobile Rewarded Ad</h2>
          <p style="margin-bottom: 20px;">Watch to earn 15 coins!</p>
          <div style="background: rgba(255,255,255,0.1); padding: 30px; margin: 20px 0; border-radius: 10px;">
            <p style="font-size: 18px; margin: 10px 0;">📱 Native Mobile Video</p>
            <p id="mobile-countdown" style="font-size: 14px;">Watch for ${requiredWatchTime} seconds...</p>
          </div>
          <button id="mobile-claim-reward" style="
            background: #34a853;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            opacity: 0.5;
            font-size: 16px;
          " disabled>Claim 15 Coins</button>
        </div>
      `;

      document.body.appendChild(overlay);

      const countdownEl = overlay.querySelector('#mobile-countdown');
      const claimBtn = overlay.querySelector('#mobile-claim-reward') as HTMLButtonElement;

      const timer = setInterval(() => {
        watchTime++;
        if (countdownEl) {
          countdownEl.textContent = `${Math.max(0, requiredWatchTime - watchTime)} seconds remaining...`;
        }

        if (watchTime >= requiredWatchTime) {
          clearInterval(timer);
          if (claimBtn && countdownEl) {
            claimBtn.disabled = false;
            claimBtn.style.opacity = '1';
            countdownEl.textContent = 'Ready to claim!';
          }
        }
      }, 1000);

      claimBtn.addEventListener('click', () => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        clearInterval(timer);
        resolve({
          success: true,
          reward: 15 // Higher reward for mobile
        });
      });

      // Auto-close after 30 seconds
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        clearInterval(timer);
        resolve({
          success: false,
          reward: 0
        });
      }, 30000);
    });
  }

  /**
   * Get mobile ad configuration
   */
  getConfig(): MobileAdConfig {
    return { ...this.config };
  }

  /**
   * Check if ads are available
   */
  isAvailable(): boolean {
    return this.isInitialized && this.isMobileEnvironment();
  }
}

export default MobileAdService;
export const mobileAdService = MobileAdService.getInstance();