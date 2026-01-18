# Amethyst Catalytic Converter - 3D Website

An interactive 3D website showcasing the Amethyst catalytic converter project using Three.js, featuring FBX model loading, smooth animations, and scroll-based transitions.

## Features

- **Interactive 3D Model Viewer** - Rotate, zoom, and pan using OrbitControls
- **FBX Model Loading** - Load and display 3D models from FBX files
- **Smooth Animations** - GSAP-powered animations for model entrance and UI transitions
- **Scroll-Based Transitions** - Camera movements synchronized with page scroll
- **Loading Screen** - Progress indicator during model loading
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **View Controls** - Preset camera views (front, side, top, reset)

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add your FBX model files to `src/assets/models/` folder. The default filename expected is `model.fbx`. To use a different filename, update the `modelPath` variable in `src/main.js`.

### Running the Development Server

```bash
npm run dev
```

The website will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
amethyst/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.js            # Application entry point
│   ├── styles.css         # Styles and responsive design
│   ├── js/
│   │   ├── SceneManager.js       # Three.js scene setup
│   │   ├── ModelLoader.js         # FBX model loading
│   │   ├── CameraController.js    # Camera animations
│   │   ├── AnimationController.js # Animation system
│   │   └── UIManager.js           # UI management
│   └── assets/
│       └── models/        # Place your FBX files here
└── public/
    └── images/            # Additional assets
```

## Usage

### Adding Your FBX Model

1. Place your FBX model file(s) in `src/assets/models/`
2. Update the `modelPath` in `src/main.js` if using a different filename:
   ```javascript
   const modelPath = '/src/assets/models/your-model.fbx';
   ```

### Customizing Content

Edit `index.html` to update:
- Project title and descriptions
- Section content (Overview, Technology, Specifications)
- Navigation menu items

### Customizing Styles

Modify `src/styles.css` to change:
- Colors (CSS variables in `:root`)
- Layout and spacing
- Animations and transitions

### Adjusting Camera Presets

Edit camera positions in `src/js/CameraController.js`:
```javascript
this.presets = {
    default: { position: [5, 5, 10], target: [0, 0, 0] },
    // Add your custom presets here
};
```

## Technical Details

- **Three.js** - 3D graphics library
- **GSAP** - Animation library with ScrollTrigger plugin
- **Vite** - Fast build tool and development server
- **OrbitControls** - Mouse/touch controls for 3D interaction

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- If an FBX model fails to load, a placeholder geometric model will be displayed
- For better performance, consider converting large FBX files to GLTF/GLB format
- The website uses a dark theme optimized for showcasing 3D models

## License

ISC
