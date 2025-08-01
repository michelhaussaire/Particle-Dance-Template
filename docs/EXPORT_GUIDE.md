# Advanced Export Guide

## Overview

The Particle Dance Template now features an enhanced export system that allows you to export your particle animations in multiple formats with high quality and precise control over export settings.

## Key Features

### 🎯 Multiple Export Formats
- **PNG**: High-quality static images with transparency support
- **JPG**: Compressed images for smaller file sizes
- **GIF**: Animated images perfect for social media sharing
- **WebM**: Modern video format with excellent web compatibility
- **MP4**: Universal video format for all platforms

### 📐 Resolution Control
- Custom resolution settings (320px to 4096px width)
- Aspect ratio preservation
- High-DPI support for crisp exports
- Preset resolutions for common use cases

### ⚙️ Quality Settings
- Adjustable quality from 10% to 100%
- Real-time file size estimation
- Background color customization
- Transparency support for PNG exports

### 🎬 Animation Export
- Configurable duration (1-30 seconds)
- Frame rate control (15-60 fps)
- Progress tracking with time estimates
- Pause/resume animation during export

## Export Presets

### Image Presets
- **Thumbnail**: 400×300 PNG with transparency
- **Wallpaper HD**: 1920×1080 PNG for desktop
- **Wallpaper 4K**: 3840×2160 PNG for high-res displays
- **Social Media**: 1080×1080 PNG with transparency

### GIF Presets
- **GIF Small**: 480×360, 3 seconds, 15 fps
- **GIF Medium**: 800×600, 5 seconds, 20 fps
- **GIF Social**: 1080×1080, 6 seconds, 24 fps

### Video Presets
- **Video Preview**: 640×480, 10 seconds, 30 fps
- **Video HD**: 1920×1080, 15 seconds, 60 fps
- **Video 4K**: 3840×2160, 20 seconds, 60 fps

## Usage Guide

### Basic Export

1. **Open Export Dialog**
   - Click the "Advanced Export" button in the sidebar
   - Or use the keyboard shortcut `Ctrl+E` (or `Cmd+E` on Mac)

2. **Choose Export Format**
   - Select from PNG, JPG, GIF, WebM, or MP4
   - Each format has different use cases and quality characteristics

3. **Configure Settings**
   - Set resolution (width × height)
   - Adjust quality slider
   - Choose background color or transparency
   - For animations: set duration and frame rate

4. **Preview and Export**
   - Use the "Preview" button to see your export settings
   - Click "Export" to start the process
   - Monitor progress with real-time updates

### Advanced Features

#### Canvas Integration
The export system is deeply integrated with the particle canvas:
- Direct frame capture from the canvas
- High-resolution rendering
- Animation pause/resume during export
- Real-time quality preview

#### Progress Tracking
- Real-time progress bar
- Frame-by-frame tracking for animations
- Estimated time remaining
- Export history with file details

#### File Management
- Automatic filename generation with timestamps
- Export history tracking
- File size estimation before export
- One-click download

## Best Practices

### For Social Media
- **Instagram**: Use 1080×1080 PNG with transparency
- **Twitter**: Keep GIFs under 10MB, use 800×600 resolution
- **TikTok**: Use 1080×1920 MP4 format
- **YouTube**: Use 1920×1080 WebM or MP4

### For Wallpapers
- **Desktop**: 1920×1080 or 3840×2160 PNG
- **Mobile**: 1080×1920 or 1440×2560 PNG
- **Ultra-wide**: 3440×1440 or 5120×1440 PNG

### For Presentations
- **Slides**: 1920×1080 PNG or MP4
- **Thumbnails**: 400×300 JPG for smaller files
- **Animations**: 5-10 second GIFs or 15-30 second videos

### Performance Tips
- **High particle counts**: Use lower frame rates (15-24 fps)
- **Long durations**: Consider file size limits
- **4K exports**: May take longer, use progress tracking
- **Batch exports**: Export multiple formats with different settings

## Technical Details

### Export Process
1. **Canvas Preparation**: The system prepares the canvas for export resolution
2. **Frame Capture**: For static images, captures current frame
3. **Animation Recording**: For videos/GIFs, records frames over time
4. **Processing**: Converts captured data to target format
5. **Download**: Automatically downloads the exported file

### File Size Estimation
- **PNG**: ~4 bytes per pixel (with transparency)
- **JPG**: ~0.5 bytes per pixel (compressed)
- **GIF**: ~0.5 bytes per pixel × frames × duration
- **Video**: ~0.001 bytes per pixel × duration

### Quality Settings
- **90-100%**: Professional quality, large files
- **70-90%**: Web quality, balanced size
- **50-70%**: Preview quality, small files
- **10-50%**: Thumbnail quality, very small files

## Troubleshooting

### Common Issues

**Export fails to start**
- Check that the canvas is properly initialized
- Ensure you have sufficient memory for high-resolution exports
- Try refreshing the page and restarting the export

**Large file sizes**
- Reduce quality setting (70-80% is usually sufficient)
- Lower resolution for web use
- Use JPG instead of PNG for photos
- Reduce duration for animated exports

**Slow export performance**
- Close other browser tabs
- Reduce particle count during export
- Use lower frame rates for videos
- Consider exporting at lower resolution first

**Poor quality exports**
- Increase quality setting to 90-100%
- Use PNG format for best quality
- Ensure high-resolution settings
- Check that canvas is properly scaled

### Browser Compatibility
- **Chrome/Edge**: Full support for all formats
- **Firefox**: Full support for all formats
- **Safari**: Limited WebM support, use MP4 instead
- **Mobile browsers**: May have limitations with large files

## Advanced Usage

### Custom Export Scripts
```javascript
// Example: Programmatic export
const canvasRef = document.querySelector('canvas');
const exporter = new MediaExporter(canvasRef);

// Export high-quality PNG
const pngBlob = await exporter.exportImage({
  width: 1920,
  height: 1080,
  quality: 0.95,
  format: 'png',
  transparent: true
});

// Export animated GIF
const gifBlob = await exporter.exportGIF({
  width: 800,
  height: 600,
  duration: 5,
  fps: 24,
  quality: 0.8,
  format: 'gif'
});
```

### Integration with External Tools
The export system can be integrated with:
- **Image editors**: Use PNG exports for further editing
- **Video editors**: Use MP4 exports for video projects
- **Web platforms**: Use WebM for web embedding
- **Social media APIs**: Use appropriate formats for each platform

## Future Enhancements

Planned improvements include:
- **Batch export**: Export multiple formats simultaneously
- **Custom presets**: Save and share custom export settings
- **Cloud export**: Direct upload to cloud storage
- **Advanced compression**: Better compression algorithms
- **Export scheduling**: Queue exports for later processing

---

For more information, see the main [README.md](../README.md) or contact the development team. 