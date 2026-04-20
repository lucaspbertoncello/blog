# Article Editor — Explicação da Lógica

## Visão geral

Editor de artigos em markdown. Suporta criação (`/writer/articles/new`) e edição (`/writer/articles/$articleId/edit`) — o mesmo componente serve os dois casos, diferenciado pelo `articleId` opcional.

---

## Arquitetura (MVVM)

```
ArticleEditorViewModel
  ├── useParams({ strict: false })        ← lê articleId da URL
  └── useArticleEditorModel(articleId?)   ← orquestra tudo
        ├── useArticleEditorForm(existing)
        ├── useEditorContent(setContent)
        ├── useImageUpload({ content, textareaRef, handleInsert })
        └── useArticleActions({ title, content })
            ↓
  ArticleEditorView                        ← só renderiza, zero lógica
```

## ViewModel — `useParams({ strict: false })`

O mesmo componente (`ArticleEditorViewModel`) serve duas rotas:
- `/writer/articles/new` — sem parâmetro `$articleId`
- `/writer/articles/$articleId/edit` — com parâmetro `$articleId`

`useParams` normalmente exige que você declare `from: "<rota exata>"` e lança erro se o parâmetro não existir na rota atual (`strict: true` por padrão). Com `strict: false`, o TanStack Router relaxa isso — retorna `articleId` como `string | undefined` sem lançar erro quando a rota é `/new` (onde o param não existe).

Esse `articleId` é então injetado no model. O model:
- Se `articleId` for `undefined` → `existing = null` → formulário vazio → modo criação
- Se `articleId` tiver valor → busca o artigo pelo id → inicializa o formulário com os dados dele → modo edição

O `isEditing: !!articleId` no retorno do model é derivado disso, usado na view para mostrar "Novo artigo" ou "Editando artigo" no header.

---

## Hooks

### `useArticleEditorForm(existing)`

Estado do formulário. Recebe o artigo existente (ou `null` para criação nova) e inicializa os campos com os valores dele via `useState`.

- `title`, `content`, `tags`, `visibility` — campos do artigo
- `previewOpen` — controla abertura do modal de preview
- `canSubmit` — derivado: `true` só se title e content não estiverem vazios

**Por que recebe `existing` e não faz o fetch?** O model resolve qual artigo é o "existing" antes de chamar o hook. Hooks que recebem dados já resolvidos são mais simples de testar e reutilizar.

---

### `useEditorContent(setContent)`

Gerencia o `textareaRef` e a inserção de texto no cursor.

- `textareaRef` — ref do `<textarea>` do editor. Precisa existir aqui porque `handleInsert` lê e escreve o cursor diretamente no DOM.
- `handleInsert(result: InsertResult)` — atualiza o conteúdo via `setContent` e depois usa `requestAnimationFrame` para restaurar a posição do cursor.

**Por que `requestAnimationFrame`?** `setContent` agenda um re-render do React. O novo valor do textarea só existe no DOM depois do render. `requestAnimationFrame` garante que `setSelectionRange` roda depois que o React atualizou o DOM, senão o cursor seria resetado pro início.

**Por que `useCallback`?** `handleInsert` é passado para `useImageUpload` como dependência. Sem `useCallback`, seria uma nova função a cada render, causando re-renders desnecessários em quem a consome.

---

### `useImageUpload({ content, textareaRef, handleInsert })`

Gerencia o upload de imagem e inserção no markdown.

- `fileInputRef` — ref de um `<input type="file" hidden>`. O clique nele é disparado programaticamente por `handleImageUpload` para abrir o seletor de arquivos do SO sem precisar de um botão de input visível.
- `handleImageUpload` — apenas chama `.click()` no fileInputRef.
- `handleFileSelected` — roda quando o usuário escolhe um arquivo:
  1. Valida tipo (só PNG/JPEG) e tamanho (máx 3MB)
  2. Gera uma URL mock (`mock-cdn.dev/...`)
  3. Monta o texto markdown `![nome](url)`
  4. Usa `textarea.selectionStart` para inserir na posição exata do cursor
  5. Chama `handleInsert` com o novo conteúdo e posição do cursor após a imagem
  6. Reseta o valor do input (`e.target.value = ""`) para que o `onChange` dispare novamente se o mesmo arquivo for selecionado duas vezes

**Por que precisa de `content` e `textareaRef`?** Para inserir no cursor certo: lê `selectionStart` do textarea (posição atual do cursor no DOM), depois reconstrói o conteúdo com `content.substring(0, start) + insertText + content.substring(start)`.

---

### `useArticleActions({ title, content })`

Handlers de submit. Por ora só exibem toasts (lógica de API não implementada).

- `handleSaveDraft` — valida que tem título, salva rascunho
- `handleSubmitForReview` — valida título e conteúdo, envia para revisão

---

## `editorUtils.ts` — as 3 funções de inserção

Todas recebem o `HTMLTextAreaElement` diretamente (não o ref) e retornam `InsertResult` — nunca mutam o DOM, só calculam o novo valor e a nova posição do cursor. Quem aplica é o `handleInsert`.

### `insertAtCursor(textarea, before, after, defaultText)`

Insere formatação inline em volta do texto selecionado (ou do `defaultText` se nada estiver selecionado).

Exemplo — negrito: `before="**"`, `after="**"`, `defaultText="texto"`
- Sem seleção: insere `**texto**`, cursor fica selecionando "texto"
- Com seleção "foo": insere `**foo**`, cursor fica selecionando "foo"

### `prependLinePrefix(textarea, prefix)`

Adiciona um prefixo no início da linha onde está o cursor.

Exemplo — H2: `prefix="## "`
- Encontra o início da linha via `lastIndexOf("\n", start - 1) + 1`
- Insere o prefixo ali
- Avança o cursor `prefix.length` posições para compensar

### `insertBlock(textarea, block)`

Insere um bloco de texto (ex: ` ```js\n\n``` `) na posição do cursor.

- Se o cursor não estiver no início de uma linha, adiciona `\n` antes do bloco automaticamente (`needsNewlineBefore`)
- Sempre adiciona `\n` depois do bloco
- Posiciona o cursor no final do bloco inserido

---

## `EditorToolbar`

Barra de ferramentas acima do textarea. Cada botão chama `run(action)`:

```
run(action)
  → pega o textarea pelo ref
  → chama action(textarea) → retorna InsertResult
  → chama onContentChange(result)  ← que é handleInsert no model
  → foca o textarea (setTimeout 0 para não conflitar com o re-render)
```

As actions são funções das `editorUtils` parcialmente aplicadas (ex: `(t) => insertAtCursor(t, "**", "**", "texto")`).

---

## `MetadataRow`

Linha abaixo do título com `TagInput` e select de visibilidade. Puramente apresentação, sem estado próprio.

### `TagInput`

Input controlado localmente. Confirma a tag ao pressionar `Enter` ou `,`, ou ao perder o foco (`onBlur`). Remove a última tag com `Backspace` quando o input está vazio. Normaliza: trim + lowercase + substitui espaços/vírgulas por `-`.

---

## `PreviewModal`

Dialog que renderiza o markdown do artigo usando `MarkdownRenderer`. Abre quando `previewOpen` é `true`. Fecha ao clicar fora (`onOpenChange`) ou via `onClose`.

---

## Fluxo completo de inserção via toolbar

```
Usuário clica "Negrito"
  → EditorToolbar.run(insertAtCursor com "**")
  → insertAtCursor(textarea) calcula novo valor + posição
  → onContentChange(InsertResult) = handleInsert
  → setContent(result.value)           ← React agenda re-render
  → requestAnimationFrame(...)         ← espera DOM atualizar
  → textarea.setSelectionRange(...)    ← restaura cursor
  → textarea.focus()
```

## Fluxo de upload de imagem

```
Usuário clica ícone de imagem na toolbar
  → onImageUpload() = handleImageUpload
  → fileInputRef.current.click()       ← abre seletor do SO
Usuário escolhe arquivo
  → handleFileSelected(event)
  → valida tipo e tamanho
  → gera URL mock
  → monta "![nome](url)"
  → lê selectionStart do textarea
  → reconstrói content com texto inserido na posição certa
  → handleInsert(InsertResult)         ← mesmo fluxo do toolbar
  → e.target.value = ""               ← reset para reusar o mesmo arquivo
```
