#!/bin/bash

# AjnabiCam APK Build Script
# This script builds the web app and generates an Android APK

set -e

echo "🚀 Building AjnabiCam APK..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the client directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the client directory${NC}"
    exit 1
fi

# Check if Android Studio or SDK is available
check_android_sdk() {
    if [ -z "$ANDROID_HOME" ] && [ ! -d "$HOME/Android/Sdk" ] && [ ! -d "/usr/local/android-sdk" ]; then
        echo -e "${YELLOW}Warning: Android SDK not found. Please install Android Studio or set ANDROID_HOME${NC}"
        echo "You can download it from: https://developer.android.com/studio"
        return 1
    fi
    return 0
}

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Build the web app
echo -e "${BLUE}🏗️  Building web application...${NC}"
npm run build

# Sync with Capacitor
echo -e "${BLUE}🔄 Syncing with Capacitor...${NC}"
npx cap sync android

# Make gradlew executable
echo -e "${BLUE}🛠️  Setting up Android build...${NC}"
chmod +x ./android/gradlew

# Check if we can build with Gradle
if check_android_sdk; then
    echo -e "${BLUE}📱 Building Android APK...${NC}"
    cd android
    
    # Build debug APK
    ./gradlew assembleDebug
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ APK built successfully!${NC}"
        echo -e "${GREEN}📱 Debug APK location: ./android/app/build/outputs/apk/debug/app-debug.apk${NC}"
        
        # Check file size
        if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
            SIZE=$(du -h app/build/outputs/apk/debug/app-debug.apk | cut -f1)
            echo -e "${GREEN}📊 APK size: $SIZE${NC}"
        fi
        
        echo -e "${YELLOW}💡 To install on device: adb install app/build/outputs/apk/debug/app-debug.apk${NC}"
    else
        echo -e "${RED}❌ APK build failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}📱 Opening Android Studio for manual build...${NC}"
    npx cap open android
    echo -e "${BLUE}In Android Studio:${NC}"
    echo -e "1. Go to Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo -e "2. Wait for build to complete"
    echo -e "3. APK will be in app/build/outputs/apk/debug/"
fi

echo -e "${GREEN}🎉 Build process completed!${NC}"
