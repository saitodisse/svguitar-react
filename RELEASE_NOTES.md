# Release Notes - @svguitar/react v1.0.0

## 🎸 @svguitar/react v1.0.0 - Initial Release

**Release Date**: December 19, 2024

### 🚀 What's New

We're excited to announce the first release of **@svguitar/react**, a high-performance React component for rendering beautiful guitar chord diagrams in SVG format.

### ✨ Key Features

- **🎸 Beautiful Chord Diagrams**: Render professional-quality guitar chord diagrams in SVG format
- **⚡ High Performance**: Optimized with React.memo and efficient rendering for smooth performance
- **🎨 Fully Customizable**: Complete control over colors, fonts, sizes, and spacing
- **📱 Responsive**: SVG-based rendering that scales perfectly on any device
- **🔧 TypeScript First**: Full TypeScript support with comprehensive type definitions
- **🧪 Well Tested**: 18 comprehensive tests with 100% pass rate
- **📚 Great Documentation**: Interactive Storybook with live examples

### 🎯 Use Cases

Perfect for:

- Music education applications
- Guitar learning platforms
- Chord reference tools
- Music composition software
- Guitar tablature applications
- Any app that needs to display guitar chords

### 🛠️ Installation

```bash
pnpm install @svguitar/react
# or
npm install @svguitar/react
# or
yarn add @svguitar/react
```

### 📖 Quick Start

```tsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const cMajor = {
		fingers: [
			{ fret: 1, string: 2, text: "1" },
			{ fret: 2, string: 4, text: "2" },
			{ fret: 3, string: 5, text: "3" },
		],
		barres: [],
	};

	return <ChordDiagram chord={cMajor} />;
};
```

### 🎨 Customization

```tsx
<ChordDiagram
	chord={chordData}
	style={{
		width: 200,
		height: 250,
		dotColor: "#FF5733",
		stringColor: "#CCCCCC",
		fontFamily: "Arial, sans-serif",
	}}
/>
```

### 🔧 Advanced Features

- **Fret Notation Support**: Parse strings like "x32010" or "(10)(12)..."
- **Barre Chords**: Full support for barre chords across multiple strings
- **Custom Tunings**: Support for any guitar tuning
- **High Positions**: Display chords in higher fret positions
- **Open Strings**: Handle open and muted strings

### 📊 Technical Specifications

- **Bundle Size**: 18.22 kB (ESM) / 12.86 kB (CJS)
- **Dependencies**: React 18+ (peer dependency)
- **TypeScript**: Full type definitions included
- **Browser Support**: All modern browsers
- **Tree Shaking**: Fully supported

### 🧪 Quality Assurance

- ✅ 18 comprehensive tests (100% passing)
- ✅ Full TypeScript coverage
- ✅ ESLint and Prettier configured
- ✅ Storybook documentation
- ✅ Performance optimized

### 📚 Documentation

- [README.md](./README.md) - Complete usage guide
- [Storybook](http://localhost:6006) - Interactive examples
- [API Reference](./README.md#api-reference) - Complete API documentation

### 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

### 🔗 Links

- [GitHub Repository](https://github.com/svguitar/svguitar-react)
- [NPM Package](https://www.npmjs.com/package/@svguitar/react)
- [Documentation](https://github.com/svguitar/svguitar-react#readme)

---

**Thank you for using @svguitar/react!** 🎸

If you find this library helpful, please consider giving it a ⭐ on GitHub!
