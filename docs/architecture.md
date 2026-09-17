# Arquitetura — MyDeltabuddies

> Documento para o "eu do futuro". Se você esqueceu como isso funciona, leia isto
> antes de tocar no código. Última revisão: 2026-09-17 (v0.4.0).

MyDeltabuddies é uma extensão do VS Code que renderiza personagens animados
("aquário") numa webview na barra lateral. O host (Node/TypeScript) só monta a
tela; **toda a lógica de jogo roda no navegador (webview)**.

---

## 1. Mapa dos arquivos

| Arquivo | Papel |
| --- | --- |
| `src/extension.ts` | Ativa a extensão e registra a webview. |
| `src/features/providers/DeltaBuddiesProvider.ts` | Monta o HTML, resolve as URIs dos sprites e injeta no `<canvas>`. |
| `src/features/helpers/helpers.ts` | `getNonce` (CSP) e `escapeJsonCharacters`. |
| `media/main.js` | Bootstrap da webview: lê os sprites, cria personagens, inicia o loop. |
| `media/animation.js` | O game loop (`requestAnimationFrame`). |
| `media/characterManager.js` | Lista de personagens, update/draw em lote e resize. |
| `media/character.js` | **Coração do projeto**: máquina de estados, movimento, animação e desenho. |
| `media/movement.js` | Movimento e bounce (funções puras). |
| `media/collision.js` | Colisão círculo-círculo (ainda **não usada** em produção). |
| `media/charactersConfig.js` | Dados de cada personagem (layout, animações, comportamento). |
| `media/main.css` | Canvas ocupando 100% da webview. |
| `tests/*.test.js` | Testes unitários com `node:test` (`npm run test:unit`). |

### Fluxo de execução

```
extension.ts
  └─ DeltaBuddiesProvider.resolveWebviewView()
       ├─ resolve URIs dos PNG (asWebviewUri)
       └─ injeta JSON no atributo data-characters do <canvas>
            │
            ▼  (webview)
media/main.js
  ├─ lê data-characters
  ├─ cria Character por sprite (assíncrono, no img.onload)
  └─ startAnimation(canvas, ctx, manager, dimensions)
            │
            ▼  a cada frame
animation.js
  ├─ manager.handleResize()   (aplica resize pendente + clamp)
  ├─ ctx.clearRect()
  ├─ manager.updateAll()      (Character.update)
  └─ manager.drawAll()        (Character.draw, ordenado por Y)
```

> ⚠️ **A lista de personagens está em 3 lugares**: nomes dos PNG no provider,
> array `characterData` em `main.js` e chaves em `charactersConfig.js`. Adicionar
> um personagem exige editar os três.

---

## 2. Sistema de coordenadas

- A origem `(0, 0)` é o **canto superior esquerdo** do canvas. X cresce para a
  direita, Y cresce para **baixo** (padrão de canvas).
- `posX` / `posY` do personagem representam o **centro** do sprite, não o canto.
- Por isso o desenho subtrai o centro:
  `destX = posX - spriteCenterX`, `destY = posY - spriteCenterY`.
- `spriteWidthUpscale = spriteWidth * scale` e
  `spriteCenterX = spriteWidthUpscale / 2` (idem para altura). O "centro" já
  inclui o scale.
- Limites da tela (via clamp): `posX ∈ [centerX, canvas.width - centerX]`,
  `posY ∈ [centerY, canvas.height - centerY]`.
  Ou seja, o **sprite inteiro** fica visível, encostando na borda pelo seu centro.

---

## 3. Sprite sheets: a grade

Cada PNG é uma **grade**: cada **linha** é uma animação (ou uma direção dela) e
cada **coluna** é um frame.

```
        coluna 0   coluna 1   coluna 2   coluna 3
linha 0 [down 0]  [down 1]   [down 2]   [down 3]     <- walk, directionMode: 4way
linha 1 [left 0]  [left 1]   [left 2]   [left 3]        directionOrder: [down,left,right,up]
linha 2 [right 0] [right 1]  [right 2]  [right 3]
linha 3 [up 0]    [up 1]     [up 2]     [up 3]
linha 4 [v_sign 0][v_sign 1] ... [v_sign 5]           <- action, directionMode: fixed
```

O desenho (`Character.draw`) calcula o retângulo de origem assim:

```
srcX = currentSprite      * layout.spriteWidth
srcY = #animationRow      * layout.spriteHeight
srcW = layout.spriteWidth
srcH = layout.spriteHeight
```

- `currentSprite` = coluna (frame atual), sempre em `[0, spritesPerRow - 1]`.
- `#animationRow` = linha, calculada por:
  - `directionMode: '4way'` → `startRow + directionOrder.indexOf(currentDirection)`
  - `directionMode: 'fixed'` → `startRow`
- `layout.scale` multiplica largura/altura no destino (pixel art, sem suavização:
  `imageSmoothingEnabled = false`).

> ⚠️ **Acoplamento silencioso**: a ordem de `directionOrder` precisa casar
> **exatamente** com a ordem das linhas do PNG. Se não casar,
> `indexOf` retorna `-1` e o personagem desenha a linha `startRow - 1`. Nada valida isso.

### Schema de uma animação (`charactersConfig.js`)

| Campo | Significado |
| --- | --- |
| `type` | `'movement'` ou `'action'`. Define se aparece em `this.movements` ou `this.actions`. |
| `frameDelay` | Frames de jogo entre um sprite e o próximo (aceita fracionário). |
| `startRow` | Linha inicial no sheet. |
| `rowCount` | Quantas linhas a animação usa (informativo hoje). |
| `spritesPerRow` | Quantos frames tem na linha. |
| `directionMode` | `'4way'` (uma linha por direção) ou `'fixed'` (linha única). |
| `directionOrder` | Ordem das direções nas linhas (obrigatório se `4way`). |
| `sustainSeconds` | Só em ações. Tempo segurando o último frame antes de terminar. |
| `chance` | Só em ações. Probabilidade (0–100) de tocar. |
| `allowedDirections` | Só em ações. Direções em que a ação pode tocar. |

### `behavior` (por personagem)

| Campo | Significado |
| --- | --- |
| `speeds` | Velocidade por nome de animação de movimento (px **por frame**). |
| `startX` / `startY` | Número **ou** função de `canvas.width/height` → posição inicial. |
| `idleDurationRange` | Quantos frames dura o idle. |
| `idleTriggerRange` | A cada quantos frames de movimento pode começar um idle. |
| `directionChangeRange` | A cada quantos frames sorteia nova direção. |
| `actionDelayRange` | Atraso (em frames) entre entrar no idle e tentar a ação. |

---

## 4. Game loop e tempo

`animation.js` roda via `requestAnimationFrame`, então o `update` é chamado
~60x/s num monitor comum.

> ⚠️ **Não há delta time.** Tudo assume 60 FPS:
> `frameDelay` é contado em frames, `speed` é px/frame e `sustainSeconds` é
> convertido com `* 60` (`Character` setter `currentAnimation`). Em monitor de
> 120/144 Hz a animação e o movimento ficam ~2x mais rápidos. Este é o débito
> técnico mais relevante.

---

## 5. Máquina de estados

Não existe um `enum`. O estado é representado por flags e a **precedência está
implícita** em `Character.update`:

```js
update(canvas) {
    if (#isActing) { #handleAction(); return; }   // prioridade máxima
    if (isIdle)    { #handleIdle();   return; }
    #handleMovement(canvas);                       // caso base: andando
}
```

### Flags e contadores

| Campo | Papel |
| --- | --- |
| `#isActing` | Está tocando uma ação. |
| `isIdle` | Está parado (idle). |
| `#pendingAction` | Nome da ação sorteada, aguardando `actionDelay`. |
| `#savedState` | Snapshot do estado antes da ação (pra restaurar depois). |
| `#sustainCounter` / `#sustainLimit` | Controle do "segurar último frame" da ação. |
| `idleCounter` / `idleDuration` | Tempo atual / limite do idle. |
| `idleTrigger` | Intervalo (em frames de movimento) pra tentar entrar em idle. |
| `directionChange` | Intervalo (em frames) pra trocar de direção. |
| `actionDelay` | Atraso até tocar a ação pendente. |
| `frameCounter` | Contador global de frames **de movimento**. |

### Transições

```
MOVENDO
  │  a cada `idleTrigger` frames:
  │    sorteia ação (dentre as permitidas na direção atual)
  │    ├─ passou no teste de `chance` → #pendingAction = ação
  │    └─ não passou                → #pendingAction = null
  ▼
IDLE (parado no frame 0)
  │  quando idleCounter >= actionDelay e há #pendingAction:
  │      playAction()  ───────────────────────────┐
  │  quando idleCounter >= idleDuration:          │
  │      volta a MOVENDO                          │
  ▼                                               │
AÇÃO ◄────────────────────────────────────────────┘
  │  toca frames até o último, segura `sustainLimit` frames
  ▼
RESTAURA #savedState (animação, idleCounter, idleDuration, isIdle)
  → volta pro estado anterior (IDLE ou MOVENDO)
```

### Save / restore

`playAction` chama `#stateBeforeAction`, que salva (só uma vez):
`{ idle: { counter, duration }, wasIdle, animation }`.
Ao terminar a ação, `#restoreStateBeforeAction` devolve tudo e limpa `#savedState`.

> ⚠️ **Gotchas conhecidos desta máquina** (ver seção 8):
> - `frameCounter` **congela** durante idle/ação (só incrementa no fim de `#handleMovement`).
> - Se `actionDelay >= idleDuration`, a ação é descartada (o idle termina antes).
> - `currentAnimation = name` é um **setter** que reseta `frameAccumulator`,
>   `currentSprite` e `sustainLimit`. Parece atribuição, mas tem efeito colateral.

---

## 6. Movimento e limites (bounce)

`media/movement.js`:

```js
updateMovement(character, speed)        // move 1 eixo conforme currentDirection
bounceMovement(pos, spriteCenter, speed, min, max, [towardMin, towardMax])
```

O bounce é chamado em `#handleMovement`, uma vez por eixo:

```js
collisionCorrectedDirectionX = bounceMovement(posX, centerX, speed, centerX, canvas.width,  ['left','right']);
collisionCorrectedDirectionY = bounceMovement(posY, centerY, speed, centerY, canvas.height, ['up','down']);
```

Se o personagem vai passar da borda, o bounce **devolve a direção oposta** (não
corrige a posição). O `updateMovement` do mesmo frame já usa a direção corrigida,
então ele vira e não escapa.

> ⚠️ `min` recebe o mesmo valor que `spriteCenter` (parâmetro redundante) e o
> `max` do bounce (`canvas.width`) é diferente do `max` do clamp
> (`canvas.width - centerX`). Duas convenções pro mesmo limite. Se X e Y
> estourarem no mesmo frame, só o X é aplicado (`else if`).

---

## 7. Profundidade (sortY)

`CharacterManager.drawAll`:

```js
[...this.#characters].sort((a, b) => a.posY - b.posY).forEach(c => c.draw(ctx));
```

É o "painter's algorithm": quem tem **maior Y** (mais embaixo) é desenhado por
último, ficando na frente. Ordenar por Y dá a sensação de profundidade quando
dois sprites se sobrepõem.

> ⚠️ Ordena por `posY` (centro), não pela base do pé. Como os sprites têm alturas
> diferentes (kris 48, susie 50), a sobreposição não é perfeitamente consistente.
> Também aloca um array novo **todo frame**.

---

## 8. Débitos técnicos e bugs conhecidos

1. **Sem delta time** — dependência de 60 FPS (seção 4).
2. **`frameCounter` congela no idle/ação** — `#handleMovement` retorna antes de
   incrementar; os gatilhos baseados nele ficam parados.
3. **`actionDelay` vs `idleDuration`** — ranges se sobrepõem; ações podem ser
   engolidas.
4. **Getter/setter `currentAnimation`** — efeito colateral escondido.
5. **`#animationRow` sem validação** — `indexOf` pode retornar `-1`.
6. **Bounce frágil** — parâmetros redundantes, só troca direção, `else if` por eixo.
7. **Código morto**: `#currentAnimData` (getter nunca lido), animação `run`
   (nunca selecionada — `#currentAnimation` só vira `walk` ou ação),
   `checkCollision` (testado, mas não usado).
8. **Config duplicada** — `walk`/`run` clonados nos 3 personagens, sem defaults.
9. **Posições iniciais iguais** — os 3 nascem no centro e se empilham; a ordem de
   criação depende de qual PNG carrega primeiro (`img.onload`).
10. **Unidades mistas** — segundos (`sustainSeconds`), frames (`frameDelay`,
    `idleDuration`, `actionDelay`) e px/frame (`speed`). Sem comentário no código.

---

## 9. Glossário

- **Sheet / sprite sheet**: PNG com a grade de frames.
- **Frame**: um desenho individual (coluna).
- **Row / linha**: uma animação ou direção (calculada por `#animationRow`).
- **4way**: animação com uma linha por direção.
- **fixed**: animação de linha única (não muda com a direção).
- **Action**: animação disparada por chance durante o idle.
- **Movement**: animação de locomoção (ex.: `walk`).
- **Idle**: período parado, no frame 0 da animação de movimento.
- **Sustain**: tempo segurando o último frame de uma ação antes de encerrar.
- **Bounce**: inverter a direção ao encostar na borda.
- **sortY**: ordenar o desenho por Y para dar profundidade.

---

## 10. Comandos úteis

```bash
npm run compile      # typecheck + lint + esbuild
npm run test:unit    # node --test tests/**/*.test.js
npm run watch        # build contínuo
# F5 no VS Code       -> abre a janela com a extensão carregada
```
