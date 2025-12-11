#!/bin/bash

# Instagram Story Export Helper Script
# Science Made Simple - Rebranding Story
# This script helps document the export process

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Instagram Story Rebranding - Export Helper     ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Function to display menu
show_menu() {
    echo -e "${GREEN}📱 Choose Your Export Method:${NC}"
    echo ""
    echo "  1) Start Dev Server (to view and record)"
    echo "  2) Build for Production"
    echo "  3) Export Instructions (Mac Screen Recording)"
    echo "  4) Export Instructions (Windows Screen Recording)"
    echo "  5) Export Instructions (Mobile Screen Recording)"
    echo "  6) Export Instructions (OBS Studio)"
    echo "  7) View on Mobile (QR Code)"
    echo "  8) Quality Checklist"
    echo "  9) Exit"
    echo ""
}

# Function for Mac recording instructions
mac_recording() {
    echo ""
    echo -e "${YELLOW}📹 Mac Screen Recording Instructions:${NC}"
    echo ""
    echo "1. Press Cmd + Shift + 5"
    echo "2. Click 'Record Selected Portion'"
    echo "3. Select the story area (avoid browser chrome)"
    echo "4. Click 'Record' button"
    echo "5. Open http://localhost:5050/instagram-story"
    echo "6. Let all 6 frames play (~34 seconds)"
    echo "7. Click Stop icon in menu bar"
    echo "8. Video saves to Desktop"
    echo ""
    echo "📐 Recommended Browser: Chrome in Device Mode (iPhone X)"
    echo "   - Press Cmd + Option + I (DevTools)"
    echo "   - Click device toggle icon"
    echo "   - Select 'iPhone X' (375 × 812)"
    echo ""
    read -p "Press Enter to continue..."
}

# Function for Windows recording instructions
windows_recording() {
    echo ""
    echo -e "${YELLOW}📹 Windows Screen Recording Instructions:${NC}"
    echo ""
    echo "1. Press Win + G (Xbox Game Bar)"
    echo "2. Click 'Capture' → 'Record'"
    echo "3. Open http://localhost:5050/instagram-story"
    echo "4. Let all 6 frames play (~34 seconds)"
    echo "5. Press Win + Alt + R to stop"
    echo "6. Video saves to Videos/Captures folder"
    echo ""
    echo "📐 Alternative: Use OBS Studio for better quality"
    echo ""
    read -p "Press Enter to continue..."
}

# Function for mobile recording instructions
mobile_recording() {
    echo ""
    echo -e "${YELLOW}📹 Mobile Screen Recording Instructions:${NC}"
    echo ""
    echo "iOS:"
    echo "1. Add Screen Recording to Control Center"
    echo "2. Open http://YOUR_IP:5050/instagram-story"
    echo "3. Swipe down from top-right for Control Center"
    echo "4. Tap screen record button"
    echo "5. Let story play through"
    echo "6. Stop recording from status bar"
    echo ""
    echo "Android:"
    echo "1. Swipe down for Quick Settings"
    echo "2. Tap 'Screen Recorder'"
    echo "3. Open http://YOUR_IP:5050/instagram-story"
    echo "4. Let story play through"
    echo "5. Tap stop notification"
    echo ""
    echo "To find your IP:"
    echo "  Mac/Linux: ifconfig | grep inet"
    echo "  Windows: ipconfig"
    echo ""
    read -p "Press Enter to continue..."
}

# Function for OBS instructions
obs_recording() {
    echo ""
    echo -e "${YELLOW}📹 OBS Studio Professional Export:${NC}"
    echo ""
    echo "Setup:"
    echo "1. Download OBS Studio (free)"
    echo "2. Create new Scene"
    echo "3. Add Browser Source:"
    echo "   - URL: http://localhost:5050/instagram-story"
    echo "   - Width: 1080"
    echo "   - Height: 1920"
    echo ""
    echo "Recording Settings:"
    echo "4. Settings → Video:"
    echo "   - Base Canvas: 1080x1920"
    echo "   - Output Resolution: 1080x1920"
    echo "   - FPS: 60"
    echo ""
    echo "5. Settings → Output:"
    echo "   - Format: MP4"
    echo "   - Encoder: H.264"
    echo "   - Bitrate: 5000-8000 Kbps"
    echo ""
    echo "6. Click 'Start Recording'"
    echo "7. Let story play through (~34 seconds)"
    echo "8. Click 'Stop Recording'"
    echo ""
    read -p "Press Enter to continue..."
}

# Function to show QR code instructions
qr_code() {
    echo ""
    echo -e "${YELLOW}📱 View on Mobile Device:${NC}"
    echo ""
    echo "1. Make sure mobile is on same WiFi network"
    echo "2. Find your computer's IP address:"
    echo ""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "   Running: ifconfig | grep inet"
        ifconfig | grep "inet " | grep -v 127.0.0.1
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "   Running: hostname -I"
        hostname -I
    else
        echo "   Windows: Open cmd and run 'ipconfig'"
    fi
    echo ""
    echo "3. On your phone, open browser and go to:"
    echo "   http://YOUR_IP:5050/instagram-story"
    echo ""
    echo "💡 Tip: Create a QR code at qr-code-generator.com"
    echo "   pointing to your IP for easy mobile access"
    echo ""
    read -p "Press Enter to continue..."
}

# Function for quality checklist
quality_check() {
    echo ""
    echo -e "${GREEN}✅ Pre-Export Quality Checklist:${NC}"
    echo ""
    echo "Visual Quality:"
    echo "  [ ] Story displays correctly in browser"
    echo "  [ ] All 6 frames load properly"
    echo "  [ ] Animations are smooth (no lag)"
    echo "  [ ] Text is readable and clear"
    echo "  [ ] Colors appear correct"
    echo "  [ ] Logo is visible (Frame 6)"
    echo ""
    echo "Technical Quality:"
    echo "  [ ] Resolution is 1080x1920 (9:16 ratio)"
    echo "  [ ] Recording is smooth (60fps if possible)"
    echo "  [ ] No browser UI visible in recording"
    echo "  [ ] Audio track ready (if adding music)"
    echo "  [ ] File size under 4GB"
    echo "  [ ] Format is MP4 or H.264"
    echo ""
    echo "Content Quality:"
    echo "  [ ] No typos in text"
    echo "  [ ] Brand colors accurate"
    echo "  [ ] All frames complete (~34 seconds total)"
    echo "  [ ] Message is clear and inspiring"
    echo ""
    echo "Instagram Specific:"
    echo "  [ ] Tested on actual Instagram app"
    echo "  [ ] Safe zones respected (no text cut off)"
    echo "  [ ] Looks good in dark mode"
    echo "  [ ] Hashtags prepared"
    echo "  [ ] Music/stickers planned (optional)"
    echo ""
    read -p "Press Enter to continue..."
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice [1-9]: " choice
    
    case $choice in
        1)
            echo ""
            echo -e "${GREEN}🚀 Starting Development Server...${NC}"
            echo ""
            echo "Opening: http://localhost:5050/instagram-story"
            echo ""
            npm run dev
            ;;
        2)
            echo ""
            echo -e "${GREEN}🏗️  Building for Production...${NC}"
            echo ""
            npm run build
            echo ""
            echo -e "${GREEN}✅ Build complete!${NC}"
            echo ""
            echo "To start production server:"
            echo "  npm run start"
            echo ""
            read -p "Press Enter to continue..."
            ;;
        3)
            mac_recording
            ;;
        4)
            windows_recording
            ;;
        5)
            mobile_recording
            ;;
        6)
            obs_recording
            ;;
        7)
            qr_code
            ;;
        8)
            quality_check
            ;;
        9)
            echo ""
            echo -e "${BLUE}👋 Good luck with your rebranding announcement!${NC}"
            echo ""
            exit 0
            ;;
        *)
            echo ""
            echo -e "${RED}❌ Invalid option. Please choose 1-9.${NC}"
            echo ""
            sleep 2
            ;;
    esac
done


