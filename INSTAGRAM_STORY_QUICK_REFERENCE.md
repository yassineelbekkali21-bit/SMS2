# 📱 Instagram Story Rebranding - Quick Reference Card

## 🚀 Start Here

```bash
npm run dev
# Visit: http://localhost:5050/instagram-story
```

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `src/components/InstagramStoryRebranding.tsx` | Main component |
| `src/app/instagram-story/page.tsx` | Demo page |
| `src/components/instagram-story-config.ts` | Config template |
| `INSTAGRAM_STORY_PROJECT_COMPLETE.md` | Full summary |
| `INSTAGRAM_STORY_REBRANDING.md` | Technical docs |
| `INSTAGRAM_STORY_EXPORT_GUIDE.md` | Export instructions |
| `INSTAGRAM_STORY_VISUAL_SHOWCASE.md` | Visual breakdown |

---

## 🎨 Brand Colors

```typescript
deepBlue: '#0A0F2C'   // Primary
softGold: '#E4C77F'   // Accent
white:    '#FFFFFF'
black:    '#000000'
lightGrey:'#E5E7EB'
```

---

## 🎬 6 Frames Summary

| # | Title | Duration | Background | Key Element |
|---|-------|----------|------------|-------------|
| 1 | Announcement | 5s | Blue→Black | Big reveal |
| 2 | Legacy | 7s | Deep Blue | Testimonial |
| 3 | Evolution | 6s | Blue Gradient | Vision |
| 4 | Changes | 5s | White | Bullet points |
| 5 | Thank You | 4s | White→Grey | Gratitude |
| 6 | New Identity | 7s | Blue→Black | Logo + tagline |

**Total: ~34 seconds**

---

## 📤 Quick Export (3 Methods)

### Method 1: Screen Recording ⭐
- **Mac**: `Cmd + Shift + 5` → Record
- **Windows**: `Win + G` → Capture
- **Mobile**: Screen record from Control Center

### Method 2: Screenshots
- Navigate to each frame
- Screenshot at 1080×1920px
- Upload as carousel

### Method 3: Professional (OBS Studio)
- Set canvas to 1080×1920px
- Add browser source
- Record and export MP4

---

## ⚙️ Quick Customization

### Change Colors
```typescript
// In InstagramStoryRebranding.tsx, line ~10
const BRAND_COLORS = {
  deepBlue: '#YOUR_COLOR',
  softGold: '#YOUR_COLOR',
};
```

### Change Auto-Advance Time
```typescript
// Line ~24 in InstagramStoryRebranding.tsx
setTimeout(() => {...}, 5000); // Change 5000 (5s)
```

### Disable Auto-Advance
```typescript
// Comment out the useEffect hook (lines ~21-30)
```

### Add Your Logo
```typescript
// Frame 6 component (~line 450)
<img src="/your-logo.svg" alt="Logo" />
```

---

## 📱 Instagram Specs

| Setting | Value |
|---------|-------|
| Resolution | 1080×1920px |
| Aspect Ratio | 9:16 |
| Format | MP4 or JPEG |
| Max Size | 4GB |
| Frame Rate | 30-60fps |
| Safe Top | 250px margin |
| Safe Bottom | 250px margin |

---

## ✅ Pre-Publish Checklist

- [ ] Tested on mobile device
- [ ] Text is readable
- [ ] Colors accurate
- [ ] Animations smooth
- [ ] Correct file size/format
- [ ] Logo visible (Frame 6)
- [ ] No typos
- [ ] Music added (optional)
- [ ] Hashtags prepared

---

## 🎯 Posting Best Practices

**When to Post:**
- Tuesday-Thursday
- 11 AM - 2 PM or 7 PM - 9 PM

**How to Maximize:**
- Pin to Highlights ("Rebranding")
- Add music or stickers
- Cross-post to Facebook/WhatsApp
- Engage with replies immediately
- Follow up with BTS content

**Suggested Hashtags:**
```
#ScienceMadeSimple
#Rebranding
#NewBeginnings
#EducationRevolution
#ScienceEducation
```

---

## 🔧 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Choppy animations | Close other apps, record at 60fps |
| Colors look different | Export in sRGB, test on device |
| Text too small | Increase font sizes in component |
| File too large | Compress with HandBrake |
| Not responsive | Already optimized, check viewport |

---

## 💡 Pro Tips

1. **Preview on Phone** - Always test on actual device
2. **Add Music** - Enhances emotional impact
3. **Track Analytics** - Monitor completion rates
4. **Engage Fast** - Respond to DMs within 1 hour
5. **Create Variations** - Test different versions

---

## 🎨 Design Principles

✨ **Minimalism** - Clean, focused, uncluttered  
🎓 **Excellence** - Professional and trustworthy  
🌊 **Flow** - Smooth transitions and rhythm  
❤️ **Emotion** - Tells a compelling story  
📱 **Mobile-First** - Optimized for vertical viewing  

---

## 📊 Frame Navigation

**Controls:**
- **Left Arrow** - Previous frame
- **Right Arrow** - Next frame
- **Progress Bars** - Tap to jump to frame
- **Auto-Advance** - 5 seconds per frame

**Keyboard Shortcuts:**
- `←` Previous
- `→` Next
- `Space` Pause (if implemented)

---

## 🎬 Animation Timeline

```
Frame 1: 0-5s   (Announcement)
Frame 2: 5-12s  (Legacy)
Frame 3: 12-18s (Evolution)
Frame 4: 18-23s (Changes)
Frame 5: 23-27s (Thank You)
Frame 6: 27-34s (New Identity)
```

---

## 📞 Quick Links

- **Demo**: `http://localhost:5050/instagram-story`
- **Component**: `src/components/InstagramStoryRebranding.tsx`
- **Docs**: `INSTAGRAM_STORY_PROJECT_COMPLETE.md`
- **Export Guide**: `INSTAGRAM_STORY_EXPORT_GUIDE.md`
- **Visual**: `INSTAGRAM_STORY_VISUAL_SHOWCASE.md`

---

## 🎉 Status

✅ **Component Built**  
✅ **Fully Animated**  
✅ **Mobile Optimized**  
✅ **Documentation Complete**  
✅ **Ready to Export**  
✅ **Ready to Publish**  

---

**You're ready to announce your rebrand! 🚀**

*Quick Reference v1.0 | Science Made Simple*


