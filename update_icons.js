
const fs = require('fs');

try {
    const icon_b64 = fs.readFileSync('icon_b64.txt', 'utf8').trim();
    const icon_uri = 'data:image/png;base64,' + icon_b64;

    // We recreate the manifest with the NEW icon
    const manifest = JSON.stringify({
        name: 'Visba System',
        short_name: 'Visba',
        description: 'Professional Hosting & Domain Reminder System',
        start_url: './',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#ffffff',
        icons: [{ src: icon_uri, sizes: '512x512', type: 'image/png' }]
    });

    const manifest_b64 = Buffer.from(manifest).toString('base64');
    const manifest_uri = 'data:application/json;base64,' + manifest_b64;

    let content = fs.readFileSync('index.html', 'utf8');

    const new_block = `<!-- Icons -->
    <link rel="manifest" href="${manifest_uri}">
    <link rel="icon" type="image/png" href="${icon_uri}">
    <link rel="apple-touch-icon" href="${icon_uri}">`;

    // Replace the block between <!-- Icons --> and <title>
    const regex = /<!-- Icons -->[\s\S]*?<title>/;

    if (regex.test(content)) {
        content = content.replace(regex, new_block + '\n\n    <title>');
        fs.writeFileSync('index.html', content);
        console.log('Successfully updated index.html with LOGO SAJA.png');
    } else {
        console.log('Could not find Icons block in index.html to replace');
    }
} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
