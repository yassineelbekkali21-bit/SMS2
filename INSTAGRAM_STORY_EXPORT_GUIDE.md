# Quick Export Guide - Instagram Story Rebranding

## 🎬 3 Ways to Export for Instagram

### Method 1: Screen Recording (Recommended)
**Best for: Full animated story with transitions**

#### On Mac:
1. Open Safari or Chrome to `/instagram-story`
2. Press `Cmd + Shift + 5` (Screenshot toolbar)
3. Select "Record Selected Portion"
4. Choose the story area (avoid controls)
5. Click "Record"
6. Let all 6 frames play (30 seconds)
7. Click Stop in menu bar
8. Video saves to Desktop

#### On Windows:
1. Open browser to `/instagram-story`
2. Press `Win + G` (Xbox Game Bar)
3. Click "Capture" → "Record"
4. Let all frames play
5. Press `Win + Alt + R` to stop
6. Video saves to Videos/Captures

#### On iPhone/Android:
1. Open the page on mobile browser
2. Start screen recording (Control Center on iOS)
3. Let story play through
4. Stop recording
5. Edit in Photos/Gallery if needed

---

### Method 2: Individual Screenshots
**Best for: Instagram carousel or multiple story posts**

#### Capture Each Frame:
1. Navigate to `/instagram-story`
2. Click to Frame 1
3. Take screenshot (hide browser UI)
4. Repeat for Frames 2-6

#### Screenshot Shortcuts:
- **Mac**: `Cmd + Shift + 4` (drag to select area)
- **Windows**: `Win + Shift + S` (Snip & Sketch)
- **Chrome**: DevTools → Toggle device toolbar → Set to iPhone X

#### Edit & Upload:
1. Crop to 1080×1920px (9:16 ratio)
2. Adjust brightness if needed
3. Upload to Instagram Stories as sequence

---

### Method 3: Professional Export
**Best for: Maximum quality & control**

#### Using OBS Studio (Free):
1. Download OBS Studio
2. Create Scene with Browser Source
3. Add URL: `http://localhost:5050/instagram-story`
4. Set Canvas to 1080×1920
5. Start Recording
6. Let story play through
7. Stop & export as MP4

#### Using Figma/After Effects:
1. Screenshot each frame
2. Import to Figma or After Effects
3. Add custom animations
4. Export at 1080×1920px
5. 30fps, MP4 format

---

## 📱 Instagram Story Specs

### Optimal Settings:
- **Resolution**: 1080×1920px
- **Aspect Ratio**: 9:16
- **Format**: MP4 or JPEG/PNG
- **Duration**: 5-7 seconds per frame
- **File Size**: Under 4GB

### Safe Zones:
- **Top**: 250px (avoid profile pic/time)
- **Bottom**: 250px (avoid UI elements)
- **Content should be centered**

---

## ✅ Pre-Upload Checklist

Before posting to Instagram:

- [ ] Video/images are 1080×1920px
- [ ] Text is readable on mobile
- [ ] Colors look correct on phone screen
- [ ] Transitions are smooth
- [ ] Logo is clearly visible (Frame 6)
- [ ] Total duration is under 60 seconds
- [ ] Tested on actual Instagram app
- [ ] Added music/stickers if desired
- [ ] Set story audience (Public/Close Friends)

---

## 🎨 Instagram Enhancement Ideas

### Native Instagram Features to Add:
1. **Music**: Add emotional/inspirational track
2. **Polls**: "Are you ready for the new SMS?" (Frame 4)
3. **Questions**: "What excites you most?" (Frame 6)
4. **Countdown**: Launch date sticker
5. **Links**: Swipe up to website (if available)
6. **Mentions**: Tag partner accounts
7. **Location**: Add your school/business location
8. **Hashtags**: #ScienceMadeSimple #Rebranding

---

## 🚀 Posting Strategy

### Timing:
- **Best days**: Tuesday-Thursday
- **Best times**: 11 AM - 2 PM, 7 PM - 9 PM
- **Avoid**: Early morning, late night

### Sequence:
1. **Pre-announcement**: Teaser story (coming soon)
2. **Main announcement**: All 6 frames
3. **Follow-up**: Behind-the-scenes, team reactions
4. **Reminder**: Repost key frames next day

### Engagement:
- Pin to Highlights: "Rebranding"
- Cross-post to Facebook Stories
- Share to WhatsApp Status
- Save as Reel for permanent post
- Ask followers to reshare

---

## 💡 Tips for Maximum Impact

### Visual Quality:
✅ Use iPhone/Android with good screen  
✅ Record in bright, non-reflective environment  
✅ Clean browser (no bookmarks bar)  
✅ Full screen mode (F11)  
✅ Close other tabs (better performance)  

### Content Timing:
- Frame 1 (Announcement): 5 seconds
- Frame 2 (Legacy): 7 seconds
- Frame 3 (Evolution): 6 seconds
- Frame 4 (Changes): 5 seconds
- Frame 5 (Thank You): 4 seconds
- Frame 6 (New Identity): 7 seconds
- **Total**: ~34 seconds

### Accessibility:
- Add closed captions to video
- Include alt text for images
- Use Instagram's accessibility features
- Test with VoiceOver/TalkBack

---

## 🎯 Quick Commands

### Start Dev Server:
```bash
npm run dev
# Navigate to http://localhost:5050/instagram-story
```

### For Mobile Testing:
```bash
# Find your local IP
# Mac/Linux: ifconfig | grep inet
# Windows: ipconfig

# Access from phone on same WiFi:
# http://YOUR_IP:5050/instagram-story
```

### Build for Production:
```bash
npm run build
npm run start
```

---

## 📞 Troubleshooting

### Issue: Animations choppy in recording
**Solution**: Close other apps, record at 60fps

### Issue: Colors look different on phone
**Solution**: Export in sRGB color space, test on device

### Issue: Text too small/hard to read
**Solution**: Increase font sizes in component, test on smallest phone

### Issue: Video too long for Instagram
**Solution**: Reduce frame duration to 4-5 seconds each

### Issue: File size too large
**Solution**: Compress with HandBrake or online tool

---

## 📊 Analytics to Track

After posting, monitor:
- Story views
- Replies and reactions
- Swipe-up clicks (if available)
- Profile visits
- New followers
- Story completion rate (Frame 1 → Frame 6)

---

**Ready to announce your rebrand! 🚀**

For detailed technical documentation, see `INSTAGRAM_STORY_REBRANDING.md`


