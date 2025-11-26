# Guia de Deploy - Hospedagem Compartilhada (cPanel)

Este guia descreve como publicar o FreteMaster em uma hospedagem cPanel padrão.
**Nota:** Hospedagens compartilhadas geralmente **não suportam Docker**. Faremos o deploy manual do Node.js (Backend) e dos arquivos estáticos (Frontend).

## Pré-requisitos no cPanel
1.  **Node.js**: Verifique se o seu cPanel possui a ferramenta "Setup Node.js App" ou similar.
2.  **Banco de Dados**: Recomenda-se usar **MySQL** (padrão do cPanel) ou **SQLite** (arquivo local, mais simples).
3.  **Subdomínios**:
    *   `calculadora.joaycordas.com.br` (para o Frontend)
    *   `api.joaycordas.com.br` (para o Backend)

---

## Passo 1: Preparar o Backend

1.  **Ajustar para Produção**:
    *   No arquivo `backend/.env`, mude `NODE_ENV` para `production`.
    *   Defina `CORS_ORIGIN=https://calculadora.joaycordas.com.br`.
    *   Se for usar MySQL, instale o driver: `npm install mysql2` (localmente) e atualize as variáveis de DB no `.env`.
    *   Se for usar SQLite, o arquivo do banco será criado na pasta do projeto.

2.  **Upload**:
    *   Compacte (ZIP) a pasta `backend` (excluindo `node_modules`).
    *   No cPanel (Gerenciador de Arquivos), crie uma pasta (ex: `fretemaster-api`) fora do `public_html` (na raiz do usuário) para maior segurança.
    *   Faça o upload e extraia o ZIP lá.

3.  **Configurar Node.js no cPanel**:
    *   Acesse "Setup Node.js App".
    *   **Create Application**:
        *   **Node.js Version**: 18.x ou superior.
        *   **Application Mode**: Production.
        *   **Application Root**: `fretemaster-api` (o caminho onde você extraiu).
        *   **Application URL**: `api.joaycordas.com.br`.
        *   **Application Startup File**: `src/app.js`.
    *   Clique em **Create**.

4.  **Instalar Dependências**:
    *   Ainda na tela do Node.js App, clique em **Run NPM Install**.
    *   Isso vai ler o `package.json` e instalar tudo.

5.  **Variáveis de Ambiente**:
    *   Muitos cPanels não leem o arquivo `.env` automaticamente. Você pode precisar definir as variáveis (DB_HOST, JWT_SECRET, etc.) na interface do "Setup Node.js App" (seção Environment Variables) ou garantir que o `dotenv` esteja carregando o arquivo corretamente (o código já faz isso).
    *   **Importante**: Defina `CORS_ORIGIN` como `https://calculadora.joaycordas.com.br`.

6.  **Iniciar**:
    *   Clique em **Restart**.
    *   Teste acessando `https://api.joaycordas.com.br/ping`. Deve retornar "pong".

---

## Passo 2: Preparar o Frontend

1.  **Configurar URL da API**:
    *   Abra o arquivo `frontend/.env` (ou crie um `.env.production`).
    *   Defina: `VITE_API_URL=https://api.joaycordas.com.br`.

2.  **Build**:
    *   No seu computador, rode:
        ```bash
        cd frontend
        npm run build
        ```
    *   Isso criará uma pasta `dist` com os arquivos otimizados (HTML, CSS, JS).

3.  **Upload**:
    *   Vá no cPanel > Gerenciador de Arquivos.
    *   Acesse a pasta do subdomínio do frontend (provavelmente `public_html/calculadora` ou similar).
    *   Faça o upload de **todo o conteúdo** de dentro da pasta `dist` para lá.

4.  **Configuração de Rotas (Importante)**:
    *   Como é uma aplicação React (SPA), você precisa redirecionar todas as requisições para o `index.html`.
    *   Crie um arquivo `.htaccess` na mesma pasta onde colocou os arquivos do frontend com o conteúdo:
        ```apache
        <IfModule mod_rewrite.c>
          RewriteEngine On
          RewriteBase /
          RewriteRule ^index\.html$ - [L]
          RewriteCond %{REQUEST_FILENAME} !-f
          RewriteCond %{REQUEST_FILENAME} !-d
          RewriteRule . /index.html [L]
        </IfModule>
        ```

---

## Passo 3: Integração

1.  Acesse `https://calculadora.joaycordas.com.br`.
2.  Tente fazer login.
3.  Se der erro de CORS, verifique no Backend se a variável `CORS_ORIGIN` está apontando para `https://calculadora.joaycordas.com.br`. Se mudou, atualize no cPanel e reinicie o Node app.

---

## Resumo de Arquivos para Upload

1.  **Backend**: ZIP da pasta `backend` (sem node_modules).
2.  **Frontend**: Conteúdo da pasta `frontend/dist` (após build).
