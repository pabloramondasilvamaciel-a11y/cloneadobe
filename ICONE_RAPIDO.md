# 🎨 ÍCONE ESCANEANDO READER - GUIA RÁPIDO

## ⚡ 3 PASSOS SIMPLES (5 minutos)

### 1️⃣ Converter SVG para PNG Online

Abra este site: **https://convertio.co/svg-png/**

```
1. Clique em "Choose Files"
2. Selecione: C:\Users\Pablo Maciel\Desktop\acrobat-clone\assets\icon.svg
3. Clique em "Convert"
4. Baixe o arquivo como PNG
```

---

### 2️⃣ Gerar Múltiplas Resoluções

Use: **https://ezgif.com/image-to-ico**

```
1. Upload o PNG que você baixou
2. Download em formato .ico (para Windows)
3. Renomeie para: icon.ico
4. Salve em: assets/icon.ico
```

---

### 3️⃣ Salvar os Arquivos

```
assets/
├── icon.svg          ← Original (já existe)
├── icon.ico          ← Converter (passo 2)
└── icon.png          ← Converter (passo 1)
```

---

## ✅ PRONTO!

Agora execute:

```bash
npm run build && npm run dist
```

E você terá: `dist/escaneando-reader-3.0.0.exe` com ícone profissional! 🎉

---

## 🎯 O RESULTADO

Quando você duplo-clica no ícone:

```
🎨 Desktop
└── Escaneando Reader [ÍCONE] ← Clique aqui!
    ↓
    Programa abre em 2-3 segundos
    ↓
    Janela com logo + menu + PDF viewer
```

---

## 💡 ALTERNATIVA AINDA MAIS RÁPIDA

Se quiser um ícone pronto agora, use este site:

**https://www.favicon-generator.org/**

1. Cole este emoji: 📄
2. Escolha cor azul
3. Generate
4. Download como .ico e .png
5. Salve em `assets/`

Pronto! Seu programa terá um ícone! 🚀

---

## 🔗 RECURSOS ÚTEIS

| Site | Uso |
|------|-----|
| https://convertio.co | SVG → PNG |
| https://ezgif.com | PNG → ICO |
| https://favicon-generator.org | Gerar ícone do zero |
| https://icon-sets.iconify.design | Ícones prontos |

---

## ❓ PERGUNTAS FREQUENTES

### Posso usar outro ícone?
✅ Sim! Qualquer PNG 512x512 funciona. Coloque em `assets/icon.png`

### O ícone fica pixelado?
❌ Use SVG ou PNG de alta resolução (512x512+)

### Posso mudar a cor?
✅ Sim! Edite `assets/icon.svg` e mude `#0066cc` para sua cor

### O programa funciona sem ícone?
✅ Sim, mas fica com um ícone genérico

---

## 🚀 PRÓXIMO PASSO

Quando tiver os arquivos em `assets/`:

```bash
cd ~/Desktop/acrobat-clone
npm run build && npm run dist
```

Pronto! Seu executável está pronto em:
```
dist/escaneando-reader-3.0.0.exe
```

---

**Tempo total**: ~5 minutos
**Dificuldade**: ⭐ Muito fácil
**Resultado**: Programa profissional com ícone clicável
