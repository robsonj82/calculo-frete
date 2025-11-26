# Guia de Deploy Detalhado - cPanel (Via Git UI + Node.js App)

Este guia utiliza as ferramentas visuais do cPanel (**Git Version Control** e **Setup Node.js App**), facilitando o processo sem necessidade de muitos comandos via terminal.

## 📋 Pré-requisitos
1.  **Acesso ao cPanel** da `joaycordas.com.br`.
2.  **Repositório GitHub**: `https://github.com/robsonj82/calculo-frete.git`.

---

## 🗄️ Passo 1: Configurar o Banco de Dados (MySQL)

1.  No cPanel, vá em **"Assistente de Banco de Dados MySQL"** (ou "MySQL Database Wizard").
2.  **Passo 1 (Criar Banco)**:
    *   Nome: `joaycordas_fretemaster`
    *   Clique em "Próxima Etapa".
3.  **Passo 2 (Criar Usuário)**:
    *   Usuário: `joaycordas_admin`
    *   Senha: `SuaSenhaForteAqui` (Anote a senha!)
    *   Clique em "Criar Usuário".
4.  **Passo 3 (Privilégios)**:
    *   Marque a opção **"TODOS OS PRIVILÉGIOS"** (All Privileges).
    *   Clique em "Próxima Etapa".

---

## 🚀 Passo 2: Baixar o Código (Via Git Version Control)

*Isso substitui o uso do terminal para baixar o código.*

1.  No cPanel, vá em **"Git Version Control"**.
2.  Clique em **"Create"**.
3.  Preencha os campos:
    *   **Clone URL**: `https://github.com/robsonj82/calculo-frete.git`
    *   **Repository Path**: `repositories/calculo-frete` (Importante: Não use public_html. Deixe este caminho sugerido ou similar).
    *   **Repository Name**: `calculo-frete` (Preenchido automaticamente).
4.  Clique em **"Create"**.
    *   O cPanel vai baixar o código do GitHub para o seu servidor.

---

## ⚙️ Passo 3: Configurar o Backend (Setup Node.js App)

1.  **Criar arquivo .env de Produção**:
    *   Vá no **"Gerenciador de Arquivos"**.
    *   Navegue até a pasta onde baixou o código: `repositories/calculo-frete/backend`.
    *   Crie um novo arquivo chamado `.env`.
    *   Edite e cole o conteúdo abaixo (ajuste a senha do banco):

```env
NODE_ENV=production
PORT=4000
# Dados do Banco MySQL (Passo 1)
DB_DIALECT=mysql
DB_HOST=localhost
DB_NAME=joaycordas_fretemaster
DB_USER=joaycordas_admin
DB_PASS=SuaSenhaAqui
# Segurança
JWT_SECRET=UmaSenhaSuperSecretaParaOJWT
JWT_EXPIRES_IN=24h
# URLs
CORS_ORIGIN=https://calculadora.joaycordas.com.br
WC_BASE_URL=https://joaycordas.com.br
# Credenciais WooCommerce
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
```

2.  **Configurar no "Setup Node.js App"**:
    *   Vá no painel principal e abra **"Setup Node.js App"**.
    *   Clique em **"CREATE APPLICATION"**.
    *   Preencha:
        *   **Node.js Version**: `18.x` (ou maior).
        *   **Application Mode**: `Production`.
        *   **Application Root**: `repositories/calculo-frete/backend`
        *   **Application URL**: Selecione `api.joaycordas.com.br`.
        *   **Application Startup File**: `src/app.js`.
    *   Clique em **CREATE**.

3.  **Instalar Dependências**:
    *   Após criar, clique no botão **"Run NPM Install"**.

4.  **Iniciar**:
    *   Clique em **RESTART**.
    *   **Teste**: Acesse `https://api.joaycordas.com.br/ping`. Deve retornar "pong".

---

## 🖥️ Passo 4: Configurar o Frontend (React)

**Opção A: Build Local + Upload (Recomendado)**

1.  **No seu computador**:
    *   Abra `frontend/.env` e garanta: `VITE_API_URL=https://api.joaycordas.com.br`
    *   Rode: `npm run build`

2.  **Enviar para o Servidor**:
    *   Compacte a pasta `dist` gerada (`dist.zip`).
    *   No cPanel (**Gerenciador de Arquivos**), vá para a pasta do subdomínio `calculadora.joaycordas.com.br`.
    *   Faça Upload e Extraia. Mova os arquivos para que fiquem na raiz do subdomínio.

3.  **Configurar Redirecionamento (.htaccess)**:
    *   Crie/Edite o arquivo `.htaccess` na pasta do subdomínio:

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

## 🔄 Como Atualizar?

1.  **Backend**:
    *   Vá em **"Git Version Control"** > **Manage** > Aba **Pull or Deploy** > Clique em **"Update from Remote"**.
    *   Vá em **"Setup Node.js App"** e clique em **Restart**.

2.  **Frontend**:
    *   Faça o build local e suba os arquivos novamente.
