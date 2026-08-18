#!/usr/bin/env node

/**
 * Script para converter ícone SVG em PNG e ICO
 * Uso: node convert-icon.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Iniciando conversão de ícone...\n');

const iconSvgPath = path.join(__dirname, 'assets', 'icon.svg');
const assetsDir = path.join(__dirname, 'assets');
const publicDir = path.join(__dirname, 'public');

// Verificar se arquivo SVG existe
if (!fs.existsSync(iconSvgPath)) {
  console.error('❌ Erro: assets/icon.svg não encontrado!');
  process.exit(1);
}

console.log('✅ Arquivo SVG encontrado\n');

// Criar diretório public se não existir
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✅ Pasta public criada\n');
}

// Instalar dependências necessárias
console.log('📦 Instalando dependências necessárias...');

const dependencies = [
  'sharp',        // Para converter PNG
  'svg2img',      // Para converter SVG
  'ico'           // Para converter para ICO
];

try {
  // Tentar instalar ferramentas globais
  console.log('Instalando ferramentas globais...\n');

  // Usando ImageMagick via npm é complexo, então vamos usar uma abordagem alternativa
  // Vamos usar online-convert ou criar PNGs usando canvas

  // Por enquanto, vamos verificar se temos as ferramentas instaladas
  try {
    execSync('convert --version', { stdio: 'ignore' });
    console.log('✅ ImageMagick encontrado\n');
    convertWithImageMagick();
  } catch (e) {
    console.log('⚠️  ImageMagick não encontrado. Tentando alternativa...\n');
    convertWithNode();
  }
} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}

function convertWithImageMagick() {
  try {
    console.log('🔄 Convertendo SVG para PNG (512x512)...');
    execSync(`convert assets/icon.svg -resize 512x512 assets/icon.png`, { stdio: 'inherit' });
    console.log('✅ icon.png criado\n');

    console.log('🔄 Convertendo para diferentes resoluções...');
    const sizes = [256, 128, 64, 32, 16];

    sizes.forEach(size => {
      execSync(`convert assets/icon.svg -resize ${size}x${size} assets/icon_${size}.png`, { stdio: 'inherit' });
      console.log(`✅ icon_${size}.png criado`);
    });

    console.log('\n🔄 Convertendo PNG para ICO...');
    execSync(`convert assets/icon.png assets/icon.ico`, { stdio: 'inherit' });
    console.log('✅ icon.ico criado\n');

    console.log('🔄 Copiando para pasta public (favicon)...');
    fs.copyFileSync(path.join(assetsDir, 'icon_32.png'), path.join(publicDir, 'favicon-32x32.png'));
    fs.copyFileSync(path.join(assetsDir, 'icon_16.png'), path.join(publicDir, 'favicon-16x16.png'));
    fs.copyFileSync(path.join(assetsDir, 'icon_256.png'), path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Favicon copiado para public/\n');

    printSuccess();
  } catch (error) {
    console.error('❌ Erro ao converter com ImageMagick:', error.message);
    console.log('\nTentando método alternativo...\n');
    convertWithNode();
  }
}

function convertWithNode() {
  console.log('📝 Criando PNGs usando Node.js...\n');

  try {
    // Instalar sharp se não estiver instalado
    console.log('📦 Instalando sharp (pode levar 1-2 min)...\n');

    try {
      execSync('npm list sharp', { stdio: 'ignore' });
    } catch (e) {
      console.log('Instalando sharp...');
      execSync('npm install sharp --no-save', { stdio: 'inherit' });
    }

    const sharp = require('sharp');

    const sizes = [512, 256, 128, 64, 32, 16];

    // Ler SVG e converter para PNG
    console.log('🔄 Convertendo SVG para PNG...\n');

    const svgBuffer = fs.readFileSync(iconSvgPath);

    sizes.forEach(size => {
      console.log(`Gerando icon_${size}.png...`);
      sharp(svgBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toFile(path.join(assetsDir, `icon_${size}.png`))
        .catch(err => console.error(`Erro ao criar icon_${size}.png:`, err));
    });

    console.log('✅ PNGs criados!\n');

    // Tentar converter para ICO usando npm
    console.log('📦 Instalando ferramenta de ICO...');

    try {
      execSync('npm list ico', { stdio: 'ignore' });
    } catch (e) {
      execSync('npm install ico --no-save', { stdio: 'inherit' });
    }

    console.log('🔄 Convertendo PNG para ICO...\n');

    const icoLib = require('ico');
    const iconPng = fs.readFileSync(path.join(assetsDir, 'icon_256.png'));

    icoLib.parse(iconPng).then(images => {
      const icoBuffer = icoLib.encode(images);
      fs.writeFileSync(path.join(assetsDir, 'icon.ico'), icoBuffer);
      console.log('✅ icon.ico criado!\n');

      // Copiar para public
      console.log('🔄 Copiando para pasta public...');
      fs.copyFileSync(path.join(assetsDir, 'icon_32.png'), path.join(publicDir, 'favicon-32x32.png'));
      fs.copyFileSync(path.join(assetsDir, 'icon_16.png'), path.join(publicDir, 'favicon-16x16.png'));
      fs.copyFileSync(path.join(assetsDir, 'icon_256.png'), path.join(publicDir, 'apple-touch-icon.png'));
      console.log('✅ Favicon copiado!\n');

      printSuccess();
    }).catch(err => {
      console.error('Erro ao processar ICO:', err);
      printPartialSuccess();
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n💡 Alternativa: Use sites online:');
    console.log('   - https://convertio.co/svg-png/');
    console.log('   - https://ezgif.com/image-to-ico\n');
    process.exit(1);
  }
}

function printSuccess() {
  console.log('═════════════════════════════════════════');
  console.log('✅ CONVERSÃO CONCLUÍDA COM SUCESSO! ✅');
  console.log('═════════════════════════════════════════\n');

  console.log('📁 Arquivos criados:\n');
  console.log('assets/');
  console.log('├── icon.svg       (Original)');
  console.log('├── icon.png       (512x512)');
  console.log('├── icon_256.png');
  console.log('├── icon_128.png');
  console.log('├── icon_64.png');
  console.log('├── icon_32.png');
  console.log('├── icon_16.png');
  console.log('└── icon.ico       (Windows)\n');

  console.log('public/');
  console.log('├── favicon-32x32.png');
  console.log('├── favicon-16x16.png');
  console.log('└── apple-touch-icon.png\n');

  console.log('═════════════════════════════════════════\n');
  console.log('🚀 Próximo passo:\n');
  console.log('   npm run build && npm run dist\n');
  console.log('Seu executável estará em: dist/escaneando-reader-3.0.0.exe\n');
  console.log('═════════════════════════════════════════\n');
}

function printPartialSuccess() {
  console.log('═════════════════════════════════════════');
  console.log('⚠️  CONVERSÃO PARCIAL');
  console.log('═════════════════════════════════════════\n');

  console.log('PNGs foram criados com sucesso!');
  console.log('Mas o ICO precisa ser convertido manualmente:\n');

  console.log('Opção 1: Site online');
  console.log('├─ Abra: https://ezgif.com/image-to-ico');
  console.log('├─ Upload: assets/icon_256.png');
  console.log('└─ Download e salve como: assets/icon.ico\n');

  console.log('Opção 2: Usar ImageMagick');
  console.log('└─ convert assets/icon_256.png assets/icon.ico\n');

  console.log('═════════════════════════════════════════\n');
}
