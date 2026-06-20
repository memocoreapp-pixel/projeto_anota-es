---
inclusion: always
---

# Estrutura do Projeto

## Layout de pastas

Usar uma estrutura simples e organizada dentro de `src/`:

```
src/
  app/              # configuração da aplicação, providers e roteamento
  components/
    layout/         # estruturas de página (header, sidebar, containers)
    ui/             # componentes básicos reutilizáveis (botão, input, card base)
    cards/          # componentes relacionados a cards
    collaborators/  # componentes relacionados a colaboradores
  pages/            # telas do app
  data/             # dados mockados
  types/            # tipos e interfaces TypeScript
  utils/            # funções utilitárias
  styles/           # estilos globais e configuração de Tailwind
```

## Rotas / Telas iniciais sugeridas

- **Início**
- **Portfólios**
- **Projetos**
- **Cadernos**
- **Anotações**
- **Rascunhos**
- **Cards**

## Convenções

- Componentes em PascalCase (ex.: `NoteCard.tsx`).
- Um componente por arquivo, quando fizer sentido.
- Tipos compartilhados ficam em `src/types`.
- Dados de exemplo/mocados ficam em `src/data`.
- Manter a estrutura enxuta; não criar pastas vazias antecipadamente.

## Importante (fase atual)

- Ainda **não criar a aplicação visual**.
- Ainda **não implementar telas**.
- Ainda **não instalar nada** além do necessário para registrar os steering files.
- Esta estrutura é a referência a seguir **quando** o app for criado, após aprovação.
