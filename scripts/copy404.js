import { copyFileSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
copyFileSync(join(distDir, 'index.html'), join(distDir, '404.html'));
console.log('Copied index.html to 404.html for SPA fallback');
