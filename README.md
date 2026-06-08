# 📱 Biblioteca App — React Native com Expo

Aplicativo mobile para gerenciamento de livros (CRUD completo), desenvolvido com **React Native** e **Expo**, consumindo uma API REST.

## 🛠️ Tecnologias

- **React Native** — Framework mobile multiplataforma
- **Expo** — Plataforma de desenvolvimento
- **React Navigation** — Navegação entre telas
- **Axios** — Cliente HTTP para consumo da API
- **@expo/vector-icons** — Ícones (Ionicons)

## 📁 Estrutura do Projeto

```
mobile/
├── src/
│   ├── constants/
│   │   └── theme.js         # Cores, fontes, espaçamentos
│   ├── screens/
│   │   ├── HomeScreen.js     # Lista de livros
│   │   ├── FormScreen.js     # Cadastro / Edição
│   │   └── DetailScreen.js   # Detalhes do livro
│   └── services/
│       └── api.js            # Configuração do Axios
├── App.js                    # Ponto de entrada + Navegação
├── package.json
└── README.md
```

## 📲 Funcionalidades

- ✅ **Listar** todos os livros cadastrados
- ✅ **Cadastrar** novo livro com validação
- ✅ **Editar** livro existente
- ✅ **Excluir** livro com confirmação
- ✅ **Visualizar** detalhes completos
- ✅ **Pull-to-refresh** para atualizar a lista
- ✅ **Indicador de leitura** (lido / não lido)
- ✅ **Interface dark mode** com design premium

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npx expo`)
- Expo Go no celular (Android/iOS)

### Passos

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd mobile
```

2. Instale as dependências:

```bash
npm install
```

3. Configure a URL da API em `src/services/api.js`:

```javascript
// Para desenvolvimento local (substitua pelo IP da sua máquina):
const API_URL = 'http://192.168.X.X:3000/api';

// Para produção (Render):
const API_URL = 'https://livros-api.onrender.com/api';
```

4. Inicie o projeto:

```bash
npx expo start
```

5. Escaneie o QR Code com o **Expo Go** no celular.

## 🔗 Backend

A API utilizada por este app está disponível em:
- Repositório: `../backend`
- Documentação das rotas: consulte o README do backend

## 📄 Licença

MIT
