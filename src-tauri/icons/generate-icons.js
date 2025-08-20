const fs = require('fs');
const path = require('path');

// Nota: En un proyecto real, deberías usar iconos personalizados
// Este es solo un script de ejemplo para generar placeholders

const iconSizes = [32, 128];
const iconTypes = ['png'];

iconSizes.forEach(size => {
    iconTypes.forEach(type => {
        const filename = `${size}x${size}.${type}`;
        const filepath = path.join(__dirname, filename);
        
        // Crear un archivo SVG básico como placeholder
        const svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="#4F46E5"/>
            <text x="50%" y="50%" font-family="Arial" font-size="${size/4}" fill="white" text-anchor="middle" dominant-baseline="middle">T</text>
        </svg>`;
        
        fs.writeFileSync(filepath, svgContent);
        console.log(`Generated: ${filename}`);
    });
});

// Generar icon.icns (macOS)
const icnsContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
</dict>
</plist>`;
fs.writeFileSync(path.join(__dirname, 'icon.icns'), icnsContent);

// Generar icon.ico (Windows)
const icoContent = `; Icon file placeholder - En un proyecto real, usaría un archivo .ico real`;
fs.writeFileSync(path.join(__dirname, 'icon.ico'), icoContent);

console.log('Icon placeholders generated. Replace with actual icons in production.');