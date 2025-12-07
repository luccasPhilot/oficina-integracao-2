# Portal ELLP - Módulo de Gestão de Escolas

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-blue)

Projeto desenvolvido para a disciplina de Oficina de Integração 2 (ES47C-ES71) do curso de Engenharia de Software da UTFPR, Campus Cornélio Procópio.

## Sobre o Projeto

Este projeto consiste no desenvolvimento de um módulo web para o controle e gerenciamento de escolas parceiras do projeto de extensão **ELLP (Ensino Lúdico de Lógica e Programação)** da UTFPR. A aplicação visa centralizar e automatizar o controle de escolas, turmas, alunos e a emissão de documentos, otimizando a administração do projeto.

### Contexto

O projeto de extensão ELLP oferece oficinas de informática, lógica e programação para crianças e adolescentes de escolas públicas. Atualmente, a gestão das escolas parceiras é realizada de forma manual, o que dificulta o controle e a organização das informações. Este sistema foi proposto para sanar essa necessidade, oferecendo uma ferramenta dedicada para a gestão.

### Documentação

Toda a documentação do projeto, incluindo o Documento de Projeto de Software, artefatos de planejamento e outros materiais relevantes, pode ser encontrada em nossa pasta compartilhada no Google Drive.

**[Acessar a Documentação do Projeto](https://drive.google.com/drive/folders/1OxzsOKuGwnTV3OsWc29DWiYwlBMwnyCQ?usp=sharing)**

## Objetivos do Sistema

O objetivo geral é desenvolver uma aplicação web para otimizar e centralizar o gerenciamento de escolas, turmas e alunos participantes do projeto.

**Objetivos Específicos:**
* Permitir o cadastro, edição, visualização e exclusão de escolas parceiras.
* Gerenciar as informações dos representantes de cada escola.
* Controlar as turmas e os alunos de cada instituição.
* Facilitar a emissão de documentos padronizados, como cartas convite e convênios.
* Disponibilizar filtros e relatórios para a consulta de alunos atendidos.
* Oferecer uma interface administrativa intuitiva para os coordenadores do projeto.

## Arquitetura e Tecnologias

O sistema é desenvolvido com uma arquitetura moderna, com separação entre Frontend e Backend, que se comunicam através de uma API RESTful.

* **Frontend**:
    * **Framework:** Angular
    * **Linguagem:** TypeScript
    * **Testes:** Karma e Jasmine

* **Backend**:
    * **Framework:** Express
    * **Linguagem:** TypeScript
    * **Testes:** Jest

* **Banco de Dados**:
    * PostgreSQL

* **Ambiente e Ferramentas de Apoio**:
    * **IDE:** Visual Studio Code
    * **Prototipação:** Figma
    * **Gerenciamento de Tarefas:** Trello (Kanban)
    * **Modelagem:** Astah UML

## Como Executar o Projeto

Para executar o software em um ambiente de desenvolvimento local, siga os passos abaixo.

### Pré-requisitos
* Node.js (v16+)
* npm
* Angular CLI
* PostgreSQL (Instância ativa)

### 1. Backend (Servidor)

1.  Acesse a pasta do backend:
    ```bash
    cd backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  **Configuração de Ambiente (.env):**
    Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis (ajuste conforme seu banco de dados):
    ```env
    PORT=3333
    SECRET=sua_chave_secreta
    DB_USER=seu_usuario
    DB_PASS=sua_senha
    DB_HOST=localhost
    DB_NAME=seu_banco_de_dados
    ```

4.  **Banco de Dados:**
    Certifique-se de que o banco de dados PostgreSQL está rodando e que as tabelas foram criadas (execute os scripts SQL localizados na pasta `database` ou as migrações).

5.  Inicie o servidor:
    ```bash
    npm run dev
    ```

### 2. Frontend (Interface)

1.  Em um novo terminal, acesse a pasta do frontend:
    ```bash
    cd frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie a aplicação:
    ```bash
    ng serve
    ```

4.  Acesse no navegador: `http://localhost:4200`

## Metodologia

O projeto utiliza o **Scrum** como metodologia ágil de desenvolvimento. O trabalho é organizado em Sprints, com cerimônias adaptadas para a dinâmica remota da equipe, incluindo comunicação contínua via WhatsApp e reuniões semanais de planejamento e revisão aos domingos.

## Equipe e Papéis

* **Álison Christian Rebouças Vidal de Carvalho** - *Product Owner/Scrum Master*
* **João Pedro Correia Leite Moreira** - *Desenvolvedor*
* **Luccas Philot Gonçalves** - *Desenvolvedor*
* **Yuri Garcia Yoshida** - *Desenvolvedor*
