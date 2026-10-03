# Óticas Mosaico — site institucional

Site da **Óticas Mosaico**, ótica premium em Águas Claras, Brasília/DF.
Direção visual editorial, de moda e luxo: muito espaço negativo, tipografia serifada, fotografia em grande escala e uma paleta de preto, off-white, bege e um toque metálico.

- **Front-end:** HTML5, CSS3 e JavaScript puro (sem frameworks e sem bibliotecas)
- **Back-end (opcional):** Java 17 + Spring Boot 3 + Maven — serve o site e recebe os agendamentos

---

## Estrutura

```
oticas-mosaico/
├── pom.xml
├── README.md
└── src/main/
    ├── java/br/com/oticasmosaico/
    │   ├── OticasMosaicoApplication.java      # inicia o Spring Boot
    │   ├── controller/
    │   │   ├── AgendamentoController.java     # POST /api/agendamentos
    │   │   └── ApiExceptionHandler.java       # erros de validação em JSON
    │   ├── service/
    │   │   └── AgendamentoService.java        # regra de negócio (em memória)
    │   └── model/
    │       ├── Agendamento.java
    │       ├── AgendamentoRequest.java        # dados do formulário + validação
    │       └── AgendamentoResponse.java
    └── resources/
        ├── application.properties
        ├── templates/                          # reservado para páginas futuras
        └── static/                             # o site
            ├── index.html
            ├── css/style.css
            ├── js/script.js
            └── images/
                ├── brand/favicon.svg
                ├── hero/  colecao/  exame/  experiencia/
                ├── estilos/  marcas/  instagram/  loja/
```

---

## Como executar

### Opção 1 — Somente o site (sem Java)

O site funciona sozinho. Sirva a pasta `static` com qualquer servidor estático, por exemplo:

```bash
python -m http.server 5500 --directory src/main/resources/static
```

Acesse `http://localhost:5500`. Nesse modo o formulário de agendamento não encontra a API e encaminha a pessoa automaticamente para o WhatsApp.

> Abrir o `index.html` com duplo clique também funciona, mas um servidor local é o recomendado.

### Opção 2 — Com Spring Boot (site + API)

Pré-requisitos: **JDK 17 ou superior** e **Maven 3.9+**.

```bash
mvn spring-boot:run
```

Acesse `http://localhost:8080`. O Spring Boot serve o site e a API de agendamento.

Para gerar o `.jar` de produção:

```bash
mvn clean package
```

```bash
java -jar target/oticas-mosaico-1.0.0.jar
```

---

## Configuração antes de publicar

Tudo o que precisa ser preenchido está marcado como `INSERIR_…` ou `[INSERIR …]`. Nenhum dado da loja foi inventado.

| O quê | Onde |
|---|---|
| Número do WhatsApp | `js/script.js` → `const WHATSAPP_NUMBER = "INSERIR_NUMERO_AQUI";` (só dígitos, com 55 + DDD) |
| Link do Google Maps ("Como chegar") | `js/script.js` → `MAPS_URL` |
| Endereço, horário, telefone e WhatsApp exibidos | `index.html`, seção `#contato` (campos `[INSERIR …]`) |
| Nomes das marcas | `index.html`, seção `#marcas` (`Marca 01` … `Marca 04`) |
| Domínio do site | `index.html` → `<link rel="canonical">` e `og:url` |
| Telefone/endereço no SEO local | `index.html` → bloco `application/ld+json` (adicione `telephone`, `streetAddress`, `openingHours`) |

### Mensagens do WhatsApp

As mensagens pré-preenchidas ficam em `WHATSAPP_MESSAGES` (`js/script.js`). Os botões usam o atributo `data-whatsapp="consultor"` ou `data-whatsapp="exame"`.

### Categorias e estilos

Os cliques em **Coleção** e em **Qual é o seu estilo?** já estão preparados para levar a páginas próprias:

```js
const CATEGORY_ROUTES = {
  "oculos-de-grau": { url: null, ... },   // ex.: "/colecao/oculos-de-grau.html"
};

const STYLE_ROUTES = {
  minimalista: { url: null, label: "Minimalista" },
};
```

Com `url: null`, o clique leva ao consultor (WhatsApp, ou o formulário enquanto o número não estiver configurado). Ao preencher `url`, o clique passa a navegar para a página.

---

## Imagens

As imagens atuais são fotografias editoriais do [Unsplash](https://unsplash.com) (licença gratuita), carregadas pela CDN deles com `auto=format` — que entrega **WebP/AVIF** automaticamente — e `srcset` responsivo. Servem como direção de arte até a produção de fotos próprias.

Cada imagem está marcada no `index.html` com um comentário `<!-- IMAGEM: … -->` indicando o arquivo sugerido. Para substituir:

1. Exporte a foto em **WebP** (ou AVIF), com a largura indicada abaixo.
2. Salve na pasta correspondente em `static/images/`.
3. Troque o `src` (e remova ou ajuste o `srcset`) da tag `<img>` e atualize o `alt`.

| Slot | Pasta sugerida | Largura | Proporção |
|---|---|---|---|
| Hero | `images/hero/` | 2200px | paisagem (o rosto à direita, espaço à esquerda para o texto) |
| Coleção — grau / sol | `images/colecao/` | 1600px | 4:5 e 3:4 |
| Coleção — marcas / novidades | `images/colecao/` | 1200px | 1:1 e 3:2 |
| Exame | `images/exame/` | 1400px | 4:3, fundo escuro |
| Experiência | `images/experiencia/` | 1100px | 4:5 |
| Estilos (5) | `images/estilos/` | 700px | 2:3 |
| Instagram (6) | `images/instagram/` | 700px | 1:1 e 2:3 |
| Loja | `images/loja/` | 1400px | 4:5 — use uma foto real da loja |

Enquanto uma imagem não carrega, o espaço aparece em bege (`--color-sand`), sem quebrar o layout.

Direção para novas fotos: modelos usando os óculos, close em armações, materiais (mármore, metal, vidro, concreto), luz natural e sombras. Evitar fotos de consultório, sorrisos posados e cenários genéricos.

---

## API de agendamento

`POST /api/agendamentos`

```json
{
  "nome": "Nome da pessoa",
  "telefone": "61900000000",
  "servico": "Exame de vista",
  "periodo": "Manhã",
  "dataPreferida": "2026-10-20",
  "mensagem": "Opcional"
}
```

Resposta `201 Created`:

```json
{ "protocolo": "MOS-261020-0001", "mensagem": "Solicitação recebida. ..." }
```

Erros de validação retornam `400` com `{ "erro": "...", "campos": { ... } }`.

Nesta versão os agendamentos ficam **em memória** e são registrados no log (sem dados pessoais). Próximos passos naturais:

- Persistência com **Spring Data JPA** (PostgreSQL ou MySQL)
- Aviso à equipe por e-mail (**spring-boot-starter-mail**)
- Painel interno para a loja consultar os agendamentos (com autenticação)

---

## Design system (resumo)

- **Tipografia:** Cormorant Garamond (títulos) + Jost (texto e navegação), via Google Fonts
- **Cores:** variáveis no topo do `style.css` (`--color-black`, `--color-off-white`, `--color-sand`, `--color-gold`, …)
- **Movimento:** 300–900ms, curvas suaves; respeita `prefers-reduced-motion`
- **Breakpoints:** 1200px (menu), 992px (tablet), 768px (mobile), 480px (telefones pequenos)

## Acessibilidade e SEO

- HTML semântico, um único `h1`, `h2` por seção, `alt` descritivo em todas as imagens
- Link "Pular para o conteúdo", foco visível, navegação por teclado, `aria-expanded` no menu
- Modal com `<dialog>` nativo (Esc fecha, foco gerenciado pelo navegador)
- `title`, `meta description`, Open Graph e dados estruturados `Optician` para SEO local

---

© 2026 Óticas Mosaico. Todos os direitos reservados.
