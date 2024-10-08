# Easy Room

Frontend do projeto EasyRoom - um sistema de gerenciamento de reservas de salas no Unisenac.

## Índice

- [Visão Geral do Projeto](#visão-geral-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Começar](#como-começar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Executando a Aplicação](#executando-a-aplicação)
- [Páginas Disponíveis](#páginas-disponíveis)
  - [Dashboard](#dashboard)
  - [Reserva de Salas](#reserva-de-salas)

## Visão Geral do Projeto

A aplicação web do EasyRoom permite aos usuários:

- Ver a disponibilidade das salas em tempo real.
- Realizar reservas de salas.
- Consultar o histórico de reservas.

## Tecnologias Utilizadas

- **Vue.js** (Framework de frontend)
- **PrimeVue** (Biblioteca de componentes de UI)
- **Axios** (Para requisições à API)

## Como Começar

### Pré-requisitos

Para rodar a aplicação web localmente, você precisará ter os seguintes itens instalados:

- [Node.js v18.18.2](https://nodejs.org/pt/blog/release/v18.18.2)

### Instalação

1. Clone o repositório:

    ```bash
    - git clone https://github.com/guilhermeklm/easy-room-web.git
    - cd easy-room-web
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

### Executando a Aplicação

1. Inicie o servidor em modo de desenvolvimento:

    ```bash
    npm run dev
    ```

2. A aplicação estará disponível em `http://localhost:5173`.

## Páginas Disponíveis

### Calendario

O Calendario oferece uma visão geral da das reservas das salas.

### Reserva de Salas

Na página de Reserva de Salas, os usuários podem selecionar uma sala, escolher um horário e confirmar a reserva. A página também oferece um formulário para adicionar uma descrição e outros detalhes.