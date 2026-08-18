# 🎨 CONVERSOR AUTOMÁTICO DE ÍCONE

## ⚡ USO RÁPIDO

Execute este comando na pasta do projeto:

```bash
npm run convert-icon
```

É isso! O script vai:
1. ✅ Converter SVG → PNG (múltiplas resoluções)
2. ✅ Converter PNG → ICO (para Windows)
3. ✅ Copiar favicon para pasta `public/`
4. ✅ Criar todos os arquivos necessários

---

## 📊 O QUE O SCRIPT FAZ

### 1. Detecta ferramentas disponíveis
- Procura por ImageMagick (rápido)
- Se não encontrar, usa Node.js (sharp)

### 2. Cria PNGs em múltiplas resoluções
```
assets/icon.svg → assets/icon_512.png
              → assets/icon_256.png
              → assets/icon_128.png
              → assets/icon_64.png
              → assets/icon_32.png
              → assets/icon_16.png
```

### 3. Converte para ICO
```
assets/icon_256.png → assets/icon.ico
```

### 4. Copia favicon
```
assets/icon_32.png  → public/favicon-32x32.png
assets/icon_16.png  → public/favicon-16x16.png
assets/icon_256.png → public/apple-touch-icon.png
```

---

## 🚀 PASSO A PASSO

### Opção A: Automático (RECOMENDADO)

```bash
# 1. Abra terminal na pasta do projeto
cd C:\Users\Pablo Maciel\Desktop\acrobat-clone

# 2. Execute o conversor
npm run convert-icon

# 3. Aguarde (pode levar 1-2 minutos na primeira vez)

# 4. Pronto! Arquivos criados em assets/ e public/
```

### Opção B: Build completo (Conversor + Build + Dist)

```bash
npm run full-build
```

Isso vai:
1. Converter ícone
2. Compilar React
3. Compilar Electron
4. Criar executável

Resultado: `dist/escaneando-reader-3.0.0.exe` ✅

---

## 📋 REQUISITOS

O script tenta usar estas ferramentas (em ordem):

1. **ImageMagick** (mais rápido)
   - Windows: `choco install imagemagick`
   - macOS: `brew install imagemagick`
   - Linux: `sudo apt install imagemagick`

2. **Node.js + sharp** (fallback automático)
   - Instala automaticamente se necessário
   - Mais lento mas funciona sem dependências

---

## ⚠️ SOLUÇÃO DE PROBLEMAS

### Erro: "sharp not found"
```bash
npm install sharp --save-dev
npm run convert-icon
```

### Erro: "ico not found"
```bash
npm install ico --save-dev
npm run convert-icon
```

### Erro: ImageMagick não funciona
O script automaticamente usa Node.js/sharp como fallback

### Ícones em branco/transparente
Edite `convert-icon.js` linha 150 e mude:
```javascript
background: { r: 255, g: 255, b: 255, alpha: 1 }
```

---

## 🎨 CUSTOMIZAR

### Mudar cor do ícone

1. Edite `assets/icon.svg`
2. Procure por `#0066cc` (azul Escaneando)
3. Mude para sua cor (ex: `#27ae60` para verde)
4. Execute: `npm run convert-icon`

### Mudar tamanhos gerados

Edite `convert-icon.js` linha 120:
```javascript
const sizes = [512, 256, 128, 64, 32, 16];
// Mude para: [512, 256, 128, 64]
```

---

## 📊 RESULTADO ESPERADO

Após executar o script, você terá:

```
assets/
├── icon.svg          (Original)
├── icon.png          (512x512)
├── icon_256.png
├── icon_128.png
├── icon_64.png
├── icon_32.png
├── icon_16.png
└── icon.ico          (Windows - USE ISSO!)

public/
├── favicon-32x32.png
├── favicon-16x16.png
└── apple-touch-icon.png
```

---

## 🚀 PRÓXIMO PASSO

Após converter o ícone, execute:

```bash
npm run dist
```

Resultado: `dist/escaneando-reader-3.0.0.exe` com ícone profissional! 🎨

---

## 💡 DICAS

✅ Execute uma vez, está pronto
✅ Se editar o SVG, execute novamente
✅ ICO é usado apenas no Windows
✅ PNG é usado em macOS/Linux
✅ Favicon é usado no navegador (desenvolvimento)

---

## 📞 ERROS NÃO COBERTOS?

Se der erro inesperado, use estas alternativas:

### Site Online (Rápido)
```
https://convertio.co/svg-png/
Depois: https://ezgif.com/image-to-ico
```

### ImageMagick (Instalado)
```bash
# Converter SVG para PNG
convert assets/icon.svg -resize 512x512 assets/icon.png

# Converter PNG para ICO
convert assets/icon.png assets/icon.ico
```

### Canva (Visual)
```
1. Abra: https://www.canva.com
2. Crie design 512x512px
3. Download como PNG
4. Use: https://ezgif.com para ICO
```

---

**Tempo estimado**: 1-2 minutos
**Dificuldade**: ⭐ Muito fácil
**Resultado**: Ícone profissional ✨

Sucesso! 🎉
