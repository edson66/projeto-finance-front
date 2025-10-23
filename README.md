# Projeto Finance (Front-end)

[![Deploy na Vercel](https://img.shields.io/website?url=https%3A%2F%2Fprojeto-finance-front.vercel.app&label=Deploy)](https://projeto-finance-front.vercel.app)

Interface web para o **Projeto Finance**, uma aplicação completa de controle financeiro pessoal. Esta aplicação permite que usuários cadastrados gerenciem suas receitas e despesas de forma intuitiva.

O front-end é construído com **React (Vite)** e **Material-UI (MUI)** para um design moderno e responsivo, consumindo uma [API Spring Boot](https://github.com/edson66/finance-api) (hospedada separadamente) para todas as operações de dados.

O site está no ar em: [projeto-finance-front.vercel.app](https://projeto-finance-front.vercel.app)
*(Lembre-se de atualizar este link para o seu domínio real da Vercel)*

## ✨ Funcionalidades Principais

A aplicação possui um sistema completo de autenticação e gerenciamento de transações.

* **Autenticação:**
    * Página de **Login** com autenticação via token JWT.
    * Página de **Cadastro** de novos usuários.
    * Validação de senha em tempo real no formulário de cadastro, seguindo as regras do back-end.
* **Rotas Protegidas:**
    * O Dashboard só é acessível para usuários autenticados.
* **Dashboard Financeiro:**
    * **Sumário (Cards):** Exibição de Receitas, Despesas e Saldo.
    * **Filtro de Sumário:** Permite filtrar os cards de sumário por um período de datas. O padrão é carregar os últimos 30 dias.
    * **Tabela de Transações:** Lista de todas as transações do usuário, ordenadas da mais recente para a mais antiga.
* **CRUD Completo de Transações:**
    * **Adicionar:** Formulário completo para adicionar novas receitas ou despesas.
    * **Editar:** Formulário em pop-up (Modal) para atualizar transações existentes.
    * **Deletar:** Opção para deletar transações (com confirmação).

## 🚀 Tecnologias Utilizadas

* **React 18** (UI Library)
* **Vite** (Build Tool)
* **Material-UI (MUI)** (Component Library)
* **MUI Icons** (Biblioteca de Ícones)
* **MUI X Date Pickers** (Componente de Calendário)
* **React Router DOM** (Gerenciamento de Rotas)
* **Axios** (Cliente HTTP para consumir a API)
* **Day.js** (Manipulação de Datas)
* **Vercel** (Hospedagem e Deploy)

## ⚙️ Como Executar Localmente

Para rodar este projeto no seu ambiente de desenvolvimento, siga os passos abaixo.

**Pré-requisitos:**
* Node.js (v18 ou superior)
* A [API Back-end](https://github.com/seu-usuario/projeto-finance-api) deve estar rodando localmente (ou aponte para a API na nuvem).

**Passos:**

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/seu-usuario/projeto-finance-front.git](https://github.com/seu-usuario/projeto-finance-front.git)
    cd projeto-finance-front
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie as variáveis de ambiente. Crie um arquivo chamado `.env.local` na raiz do projeto e adicione a URL da sua API:
    ```env
    # Se estiver rodando o back-end localmente
    VITE_API_BASE_URL=http://localhost:8080
    
    # Se estiver usando a API na AWS
    # VITE_API_BASE_URL=[http://ec2-3-145-53-92.us-east-2.compute.amazonaws.com:8080](http://ec2-3-145-53-92.us-east-2.compute.amazonaws.com:8080)
    ```

4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

## 🔗 API Back-end

Este front-end depende 100% da API Spring Boot para funcionar. O repositório do back-end, contendo toda a lógica de negócio, segurança e conexão com o banco de dados, pode ser encontrado aqui:

➡️ **[Repositório da API (Spring Boot)](https://github.com/edson66/finance-api)**
