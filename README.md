# PDF Reader Pro - Clone do Adobe Acrobat Reader

[![Codecov](https://codecov.io/gh/OWNER/REPO/branch/main/graph/badge.svg?token=CODECOV_TOKEN)](https://codecov.io/gh/OWNER/REPO)

Um leitor de PDF profissional e completo criado com Electron e React, com todas as funcionalidades essenciais do Adobe Acrobat Reader.

## Funcionalidades ✨

### Renderização e Navegação
- ✅ Renderização de PDFs em alta qualidade com PDF.js
- ✅ Navegação entre páginas (anterior, próxima, ir para página)
- ✅ Zoom in/out (50% - 400%)
- ✅ Múltiplos modos de visualização (página, largura, altura)
- ✅ Rotação de páginas (0°, 90°, 180°, 270°)

### Anotações Avançadas
- ✅ **Highlight** - Destacar texto
- ✅ **Underline** - Sublinhar
- ✅ **Strikethrough** - Riscado
- ✅ **Text Box** - Caixas de texto com formatação
- ✅ **Drawing** - Desenho livre com pincéis customizáveis
- ✅ **Comments** - Comentários com threads de resposta
- ✅ **Signature** - Assinatura digital certificada

### Busca e Organização
- ✅ Busca de texto avançada (com case-sensitive)
- ✅ Bookmark/Marcadores customizáveis
- ✅ Navegação rápida entre marcadores
- ✅ Histórico de anotações

### Segurança
- ✅ Proteção de documentos com senha (AES-256)
- ✅ Controle de permissões (impressão, cópia, modificação)
- ✅ Descriptografia de PDFs protegidos
- ✅ Assinatura digital com certificado

### Impressão e Exportação
- ✅ Impressão completa ou seleção de páginas
- ✅ Preview de impressão
- ✅ Exportação de anotações em JSON
- ✅ Impressão com opções avançadas

### Interface e Usabilidade
- ✅ Tema claro/escuro
- ✅ Interface responsiva
- ✅ Atalhos de teclado (Ctrl+O, Ctrl+P, Ctrl+F, etc)
- ✅ Drag & Drop para abrir arquivos
- ✅ Barra lateral recolhível

## Instalação 🚀

### Pré-requisitos
- Node.js 16.0.0 ou superior
- npm ou yarn

### Setup

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/acrobat-clone.git
cd acrobat-clone

# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Criar distribuível
npm run dist
```

## Uso 📖

### Comandos Disponíveis

```bash
npm run dev          # Inicia Electron + React em desenvolvimento
npm run react-dev    # Inicia apenas o servidor React
npm run electron-dev # Inicia apenas Electron (requer React rodando)
npm run build        # Build da aplicação React
npm run dist         # Cria distribuível executável
```

### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+O` | Abrir PDF |
| `Ctrl+P` | Imprimir |
| `Ctrl+F` | Pesquisar |
| `Ctrl+Z` | Desfazer |
| `Ctrl+Y` | Refazer |
| `+` | Zoom In |
| `-` | Zoom Out |
| `0` | Reset Zoom |
| `←` | Página Anterior |
| `→` | Próxima Página |

## Estrutura do Projeto 📁

```
acrobat-clone/
├── electron/
│   ├── main.ts                 # Main process
│   ├── preload.ts              # Preload script (IPC bridge)
│   └── handlers/
│       ├── pdfHandler.ts       # Manipulação de PDFs
│       ├── annotationHandler.ts # Gerenciamento de anotações
│       ├── securityHandler.ts  # Encriptação e segurança
│       └── printHandler.ts     # Impressão
├── src/
│   ├── components/             # Componentes React
│   │   ├── PDFViewer.tsx
│   │   ├── Toolbar.tsx
│   │   ├── AnnotationPanel.tsx
│   │   ├── SearchPanel.tsx
│   │   ├── BookmarksPanel.tsx
│   │   ├── AnnotationLayer.tsx
│   │   ├── PasswordDialog.tsx
│   │   └── Sidebar.tsx
│   ├── store/                  # Zustand stores
│   │   ├── pdfStore.ts
│   │   └── annotationStore.ts
│   ├── types/                  # TypeScript types
│   │   ├── pdf.ts
│   │   └── annotations.ts
│   ├── utils/                  # Utilitários
│   │   ├── pdfUtils.ts
│   │   └── annotationUtils.ts
│   ├── App.tsx                 # Componente principal
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── public/
│   ├── index.html
│   └── assets/
├── package.json
├── tsconfig.json
├── tsconfig.electron.json
└── webpack.config.js
```

## Tecnologias Utilizadas 🛠️

- **Electron** - Framework para aplicações desktop
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Zustand** - State management
- **PDF.js** - Renderização de PDFs
- **Crypto-js** - Encriptação
- **Webpack** - Bundler

## Configuração Avançada ⚙️

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NODE_ENV=development
REACT_APP_DEBUG=true
```

### Customizando Cores

Edite `src/App.css` para mudar as cores padrão:

```css
:root {
  --color-accent: #0066cc;      /* Cor primária */
  --color-danger: #cc0000;       /* Cor de perigo */
  --color-success: #00aa00;      /* Cor de sucesso */
}
```

## Funcionalidades Futuras 🔮

- [ ] OCR (Optical Character Recognition)
- [ ] Edição de PDF (adicionar/remover páginas)
- [ ] Formulários interativos
- [ ] Redação de conteúdo sensível
- [ ] Integração com nuvem (Google Drive, OneDrive)
- [ ] Suporte para XFA forms
- [ ] Modo de apresentação
- [ ] Comparação de documentos

## Contribuindo 🤝

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença 📄

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## Suporte 💬

Para reportar bugs ou sugerir features, abra uma issue no repositório.

## Créditos

Desenvolvido como um clone educacional do Adobe Acrobat Reader com funcionalidades profissionais.

---

**Desenvolvido por**: Claude
**Data**: 2024
**Versão**: 1.0.0
