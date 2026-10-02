# Glucontinuum

Ecossistema multiplataforma para acompanhar dados de glicose, tendências e tratamentos, com ferramentas para celular, relógio e web.

[![Quality](https://github.com/Glucontinuum/releases/actions/workflows/quality.yml/badge.svg?branch=main)](https://github.com/Glucontinuum/releases/actions/workflows/quality.yml)

**[Site oficial](https://glucontinuum.github.io/releases/)** · **[Baixar a release mais recente](https://glucontinuum.github.io/releases/?download=latest)** · **[Ver todas as releases](https://github.com/Glucontinuum/releases/releases)**

O link de download abre o arquivo da versão publicada mais recente, incluindo pré-releases. Se não houver arquivo disponível, ele abre a página da versão no GitHub. A página de releases reúne os arquivos e notas de cada versão.

## Produtos

| Produto | Plataforma e finalidade | Código e estado |
| --- | --- | --- |
| **Glucontinuum Native** | Aplicativo Android nativo para monitoramento, alertas, tratamentos e relatórios. | [Repositório](https://github.com/Glucontinuum/glucontinuum) · Em desenvolvimento beta. |
| **Glucontinuum Legacy** | Aplicativo React com PWA e versão Android baseada em Capacitor; segue recebendo manutenção durante a migração nativa. | [Repositório](https://github.com/Glucontinuum/glucontinuum-legacy) |
| **Glucontinuum Watch** | Miniapp Zepp OS e watch face para integração com o Amazfit Bip 6. | [Repositório](https://github.com/Glucontinuum/glucontinuum-watch) · Publicação condicionada à aprovação do relatório de soak do relógio. |
| **Site e releases** | Página pública do projeto, com apresentação e downloads das versões publicadas. | [Este repositório](https://github.com/Glucontinuum/releases) |

O [Design System](https://github.com/Glucontinuum/glucontinuum-design-system) compartilha tokens, componentes e assets entre os produtos.

## Esteira de qualidade

O badge **Quality** no topo mostra o resultado mais recente do workflow deste repositório. A esteira instala as dependências e executa `npm run check` — validação do Design System, lint e build — em alterações de código e pull requests.

[Ver execuções e detalhes da esteira](https://github.com/Glucontinuum/releases/actions/workflows/quality.yml)

## Desenvolvimento do site

Requer Node.js 20 ou superior.

```bash
npm ci
npm run dev
```

Para gerar o build de produção:

```bash
npm run check
```

O site é feito com React, TypeScript e Vite e publicado no GitHub Pages.
