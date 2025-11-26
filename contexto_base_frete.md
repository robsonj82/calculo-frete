# 🧠 CONTEXTO BASE — SISTEMA DE CÁLCULO DE FRETE COM MÚLTIPLAS TRANSPORTADORAS

## 🎯 VISÃO GERAL
O projeto **FreteMaster** é uma aplicação web independente que calcula, compara e registra cotações de frete de **múltiplas transportadoras com contrato direto**.  
O sistema serve tanto para pedidos vindos do WooCommerce quanto para cotações manuais (WhatsApp, vendas diretas, etc).

O foco é um **MVP funcional (80/20)** — priorizando velocidade, simplicidade e clareza no código.  
Recursos secundários (sandbox, etiquetas, ERP, coleta) ficam para versões futuras.

---

## 🧑‍💼 PÚBLICO-ALVO
- Operadores de e-commerce  
- Equipes de atendimento com vendas manuais  
- Setores de logística e expedição  
- Lojas com contratos diretos com transportadoras  

---

## 🧩 OBJETIVOS PRINCIPAIS
1. Centralizar cálculos de frete em um painel único  
2. Calcular fretes para diversos canais (WooCommerce, WhatsApp, vendas diretas)  
3. Usar contratos diretos com APIs de transportadoras  
4. Integrar com WooCommerce via REST API  
5. Salvar histórico de cotações e permitir comparação  
6. Oferecer autenticação simples com perfis de usuário  

---

## ⚙️ FUNCIONALIDADES MVP

### 1. Cálculo de Frete
Campos:
- CEP de origem e destino  
- Peso, dimensões (A/L/C)  
- Valor declarado  
- Tipo de serviço  

Resultado:
- Lista de transportadoras  
- Valor, prazo e tipo de serviço  
- Destaque: mais barato e mais rápido  

---

### 2. Integração WooCommerce (simplificada)
- Conexão via chave/segredo REST API  
- Importação manual de pedido por ID  
- Preenchimento automático no formulário de cotação  

---

### 3. Cotação Manual
- Cálculo independente de pedido  
- Botão “Copiar cotação”  
- Registro automático no histórico  

---

### 4. Histórico de Cotações
- Filtros: data, transportadora, usuário  
- Dados exibidos: origem/destino, peso, transportadora escolhida  
- Ações: exportar CSV, recalcular  

---

### 5. Usuários
- Login com JWT  
- Perfis: Administrador e Operador  
- Logs de ação  

---

## 🚚 TRANSPORTADORAS OBRIGATÓRIAS (MVP)

O sistema deve obrigatoriamente oferecer cotações automáticas das seguintes transportadoras:
1. **Correios**  
2. **Jadlog**  
3. **Braspress**  
4. **Expresso São Miguel**  

Cada integração deve retornar:
- Valor do frete  
- Prazo de entrega  
- Tipo de serviço (PAC, SEDEX, Expresso, Econômico)  
- Nome da transportadora  

Formato padronizado de resposta:
```json
{
  "carrier": "Jadlog",
  "service": "Expresso",
  "price": 42.75,
  "deadline": 3,
  "currency": "BRL"
}

Erro padronizado:

{
  "carrier": "Braspress",
  "error": "API não disponível no momento"
}


Cada integração deve ter um módulo próprio:

/services/correiosService.js

/services/jadlogService.js

/services/braspressService.js

/services/saomiguelService.js

Cada serviço deve conter:

Função getQuote(params) que retorna o formato padronizado

Configuração via .env (token, URL base, fator de cubagem)

🔐 SEGURANÇA

Autenticação via JWT

Criptografia AES-256 para tokens e credenciais

Rate limiting por IP/token

Logs de auditoria

🧱 STACK TÉCNICA
Backend

Node.js + Express

Banco: PostgreSQL (SQLite no protótipo)

ORM: Sequelize

Documentação: Swagger (OpenAPI)

Testes: Jest

Frontend

React + Vite + TailwindCSS

Axios / React Query para consumo de API

UI responsiva (tabela comparativa e histórico)

Infraestrutura

Docker + Docker Compose

Deploy: Render, Vercel ou Firebase

Logs centralizados (Winston / Sentry)

🧠 MODELAGEM DE DADOS (MVP)
Usuário (id, nome, email, senha_hash, perfil)
Transportadora (id, nome, api_url, token, ativo)
Cotação (id, origem, destino, peso, dimensões, valor, transportadora_id, data)
Histórico (id, cotacao_id, usuario_id, data, observacoes)
Pedido (id, woo_id, origem, destino, valor_total, status)

🔄 FLUXO PRINCIPAL

Usuário loga (JWT)

Informa origem, destino, peso e dimensões

Sistema consulta APIs das 4 transportadoras

Exibe tabela comparativa (valor, prazo, serviço)

Usuário escolhe opção

Cotação é salva no histórico

(Opcional) Importar dados de pedido WooCommerce

✅ REQUISITOS DE QUALIDADE

Código limpo, modular, documentado

Testes unitários e integração

API REST validada via Swagger

Interface responsiva e rápida

Logs e erros centralizados

🧙‍♂️ INSTRUÇÕES AO MODELO (Gravity)

Sempre basear o raciocínio neste contexto antes de gerar código.

Dividir o projeto em módulos (auth, frete, transportadoras, histórico, UI).

Documentar rotas e schemas antes de implementar.

Aplicar boas práticas RESTful e princípios SOLID.

Validar cada etapa com logs e checkpoints.

Focar no MVP funcional (não incluir recursos extras ainda).