# 🎨 Escaneando Reader - Design & Branding Guide

## Identidade Visual Implementada

O **Escaneando Reader** agora possui uma identidade visual completa e profissional, baseada na marca Escaneando com cores, tipografia e componentes modernos.

---

## 🎯 Palheta de Cores

### Cores Primárias
```css
--color-primary: #0066cc        /* Azul principal Escaneando */
--color-primary-dark: #003366   /* Azul escuro */
--color-primary-light: #e6f0ff  /* Azul claro */
```

### Cores de Fundo
**Light Mode:**
- `--color-bg-primary: #ffffff`
- `--color-bg-secondary: #f8f9fa`
- `--color-bg-tertiary: #f0f2f5`

**Dark Mode:**
- `--color-bg-primary-dark: #0f172a`
- `--color-bg-secondary-dark: #1e293b`
- `--color-bg-tertiary-dark: #334155`

### Cores de Texto
**Light Mode:**
- Primary: `#1a1a2e` (Cinza escuro)
- Secondary: `#6b7280` (Cinza médio)

**Dark Mode:**
- Primary: `#f1f5f9` (Branco)
- Secondary: `#cbd5e1` (Cinza claro)

### Cores de Ação
- Success: `#10b981` (Verde)
- Warning: `#f59e0b` (Âmbar)
- Danger: `#ef4444` (Vermelho)

---

## 🏗️ Componentes de Design

### 1. Toolbar (Barra de Ferramentas)

**Mudanças Principais:**
- ✅ Logo Escaneando no topo esquerdo
- ✅ Título do documento centralizado e truncado
- ✅ Controles agrupados de forma lógica (esquerda, centro, direita)
- ✅ Melhor espaçamento e hierarquia visual

**Layout:**
```
[☰] [Logo] [Título do PDF]    [🔍 ◀ Página ▶] [Zoom] [🌙]    [✏️ 🔖 🖨️ 🔒]
```

**Estilos:**
- Altura: 52px
- Background: #ffffff (light) / #1e293b (dark)
- Sombra: `0 1px 3px rgba(0, 0, 0, 0.08)`
- Padding: 12px 20px

### 2. Sidebar (Painel Lateral)

**Mudanças Principais:**
- ✅ Navegação estruturada em seções (Biblioteca, Ecossistema)
- ✅ Ícones com labels para melhor UX
- ✅ Efeito hover com cor primária
- ✅ Estado ativo com highlight de cor

**Estrutura de Navegação:**

```
BIBLIOTECA
📚 Biblioteca (ativo)
⏱️  Recentes
⭐ Favoritos
📁 Coleções

ECOSSISTEMA
🔖 Marcadores
📝 Notas
🔍 Busca
🎨 Modo Foco
```

**Estilos de Item:**
```css
.sidebar-nav-item {
  padding: 12px 16px;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.sidebar-nav-item:hover {
  background-color: #f0f2f5; /* Light */
  color: #0066cc;
}

.sidebar-nav-item.active {
  background-color: #e6f0ff;
  color: #0066cc;
  border-left-color: #0066cc;
  font-weight: 500;
}
```

### 3. Empty State (Tela Vazia)

**Mudanças Principais:**
- ✅ Logo Escaneando no topo
- ✅ Título e descrição do app
- ✅ Features cards com hover effects
- ✅ Gradiente de fundo premium

**Conteúdo:**
```
      [Logo Escaneando]
      
      Escaneando Reader
      Leitor de PDF com biblioteca, leitura, estudo e privacidade local
      
      [📚 Biblioteca] [📖 Leitura]
      [✏️ Estudo]     [🔒 Privacidade]
```

**Efeitos:**
- Cards com border azul ao hover
- Sombra suave ao hover
- Background gradiente profissional

### 4. Botões

**Estilos:**
```css
/* Padrão */
padding: 8px 14px;
font-size: 13px;
font-weight: 500;
border-radius: 6px;
border: 1px solid #d4d8dd;

/* Hover */
background-color: #f8f9fa;
border-color: #0066cc;
color: #0066cc;

/* Active */
background-color: #0066cc;
color: white;
```

---

## 📱 Layout Responsivo

### Desktop (1024px+)
- Sidebar visível: 280px
- Toolbar completo com todos os controles
- Features grid: 2 colunas

### Tablet (768px - 1023px)
- Sidebar pode ser recolhido
- Toolbar reagrupa componentes
- Features grid: 1 coluna

### Mobile (< 768px)
- Sidebar colapsável
- Toolbar em múltiplas linhas
- Features grid: 1 coluna
- Font sizes reduzidas 10-20%

---

## 🎨 Ícones Utilizados

| Ícone | Significado | Local |
|-------|------------|-------|
| 📚 | Biblioteca | Sidebar |
| ⏱️ | Recentes | Sidebar |
| ⭐ | Favoritos | Sidebar |
| 📁 | Coleções | Sidebar |
| 🔖 | Marcadores | Toolbar, Sidebar |
| 📝 | Notas | Toolbar |
| 🔍 | Busca | Toolbar |
| 🎨 | Modo Foco | Sidebar |
| 🖨️ | Imprimir | Toolbar |
| 🔒 | Proteger | Toolbar |
| ☀️ | Tema claro | Toolbar |
| 🌙 | Tema escuro | Toolbar |
| ☰ | Menu | Toolbar |

---

## 🌈 Tema Dark/Light

### Ativação
- Sistema detecta preferência do OS automaticamente
- Toggle manual via botão 🌙/☀️ na toolbar
- CSS variables se adaptam via classe `.dark`

### Transições
```css
/* Smooth transition entre temas */
transition: background-color 0.3s, color 0.3s;
```

---

## 📦 Logo e Favicon

### Arquivos Inclusos
```
public/
├── logo-header.png          /* Logo para header */
├── logo-dark.png            /* Logo versão escura */
├── logo-white.png           /* Logo versão branca */
├── favicon.ico              /* Favicon */
├── favicon-16x16.png        /* Favicon 16x16 */
├── favicon-32x32.png        /* Favicon 32x32 */
├── apple-touch-icon.png     /* Ícone iOS */
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── site.webmanifest         /* PWA manifest */

assets/
└── icon.png                 /* Ícone do aplicativo */
```

### Uso

**Em HTML:**
```html
<img src="logo-header.png" alt="Escaneando" />
```

**Em CSS Background:**
```css
background-image: url('logo-header.png');
```

---

## 🎬 Animações e Transições

### Efeitos Implementados

**Hover em Cards:**
```css
transform: translateY(-4px);
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
```

**Hover em Sidebar Items:**
```css
background-color: var(--color-bg-tertiary);
color: var(--color-primary);
```

**Zoom de Ícones:**
```css
.sidebar-nav-icon {
  transition: transform 0.3s ease;
}

.sidebar-nav-item:hover .sidebar-nav-icon {
  transform: scale(1.1);
}
```

---

## 📐 Tipografia

### Fontes
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Tamanhos
- **H1 (Empty State):** 32px, weight 600
- **H2 (Sidebar Header):** 14px, uppercase, weight 600
- **Body:** 15px, weight 400
- **Small:** 13px, weight 400

### Line Heights
- Headings: 1.2
- Body: 1.6
- Labels: 1.4

---

## 🔧 Customização

### Como Mudar Cores Globalmente

Edite `/src/App.css` na seção `:root`:

```css
:root {
  --color-primary: #0066cc;      /* Mude para sua cor */
  --color-primary-dark: #003366;
  --color-primary-light: #e6f0ff;
  /* ... resto das cores */
}
```

### Como Mudar Logo

1. Coloque sua logo em `/public/logo-header.png`
2. Atualize a referência em `src/App.tsx`:
```tsx
<img src="logo-header.png" alt="Seu App" />
```

### Como Adicionar Novo Item no Sidebar

```tsx
<div className="sidebar-nav-item">
  <span className="sidebar-nav-icon">🎯</span>
  <span>Novo Item</span>
</div>
```

---

## 🚀 Recursos de Design

### Acessibilidade
- ✅ Contrast ratio 4.5:1 para texto pequeno
- ✅ 7:1 para texto grande
- ✅ Sem dependência de cor única
- ✅ Suporte a dark mode obrigatório

### Performance
- ✅ CSS variables para temas (sem SASS necessário)
- ✅ Transições smooth (60fps)
- ✅ Box-shadows otimizadas
- ✅ Sem imagens desnecessárias

### Semantântica
- ✅ Estrutura HTML semântica
- ✅ ARIA labels onde necessário
- ✅ Focus states visíveis
- ✅ Keyboard navigation completo

---

## 📸 Exemplos Visuais

### Estado Vazio
```
┌─────────────────────────────────────┐
│  [Logo Escaneando]                  │
│                                     │
│  Escaneando Reader                  │
│  Leitor de PDF com privacidade      │
│                                     │
│  [📚 Biblioteca] [📖 Leitura]       │
│  [✏️ Estudo]     [🔒 Privacidade]   │
└─────────────────────────────────────┘
```

### Com PDF Aberto
```
┌────────────────────────────────────────────────────┐
│ [☰] [Logo] Reforma Tributária 2026.pdf  [🔍 🖨️ 🔒]│
├─────────────┬────────────────────────────┬─────────┤
│ BIBLIOTECA  │                            │ NOTAS   │
│             │                            │         │
│ 📚 Bibli... │    [PDF Renderizado]      │ • Nota1 │
│ ⏱️  Recentes │                            │ • Nota2 │
│ ⭐ Favorit.  │                            │         │
└─────────────┴────────────────────────────┴─────────┘
```

---

## 📋 Checklist de Design

- [x] Paleta de cores profissional
- [x] Logo integrada na toolbar
- [x] Sidebar estruturada
- [x] Theme dark/light completo
- [x] Responsividade garantida
- [x] Animações smooth
- [x] Acessibilidade
- [x] Favicon e ícones
- [x] Typography hierárquica
- [x] Estados hover/active/focus

---

## 🔗 Referências

- **Design System:** Escaneando Reader v2.0
- **Framework:** React 18 + Electron 27
- **CSS:** CSS Variables + Mobile-first
- **Tipografia:** System Fonts (SF, Segoe, Roboto)
- **Cores:** HSL + RGB compatible

---

**Última atualização:** Agosto 2026  
**Versão:** 2.0 Premium - Escaneando Edition  
**Status:** ✅ Completo e Implementado
