# Scriptura — Estudo de Idiomas & Repetição Espaçada (SRS)

> **Aprenda Russo e Inglês conversacional do dia a dia através de versões contemporâneas da Bíblia (NLT e НРП) e o algoritmo inteligente do Anki (SM-2).**

---

## 🌟 Estrutura do Aplicativo

### 1. Os 5 Versículos do Dia (5 Quadrados Minimalistas)
* **Fundo Preto OLED (`#000000`)** com 5 cartões translúcidos.
* **🇷🇺 Russo — НРП (Новый Русский Перевод - Biblica)**: Novo Testamento contemporâneo com **marcação de acento tônico (*ударения*)** em todas as palavras.
* **🇺🇸 Inglês — NLT (New Living Translation)**: Tradução moderna em equivalência dinâmica natural (sem arcaísmos).
* **Ao Clicar no Quadrado**: Abre a **Aula do Versículo**, explicando as expressões (*chunks*), o porquê de não traduzir ao pé da letra, exemplos reais do cotidiano e botões para salvar no seu Anki.

### 2. Seu Anki Pessoal (SM-2 Oficial)
* **Inicia 100% Vazio (Zero Cards Falsos)**: Apenas os cartões que você ou sua namorada adicionarem (pelas aulas ou pelo botão `+ Criar Card do Zero`) aparecerão no baralho.
* **Algoritmo SM-2 oficial**: Com cálculo real de repetições, *Ease Factor* (padrão 2.5, mín. 1.3), intervalos de retenção e prévia do tempo nos 4 botões (`Errei`, `Difícil`, `Bom`, `Fácil`).
* **Atalhos no teclado**: Barra de Espaço para revelar a resposta, números `1`, `2`, `3`, `4` para classificar.

### 3. Motor de Áudio & Google Cloud TTS
* No arquivo [`audio-engine.js`](file:///C:/Users/wmsli/.gemini/antigravity/scratch/scriptura-srs/audio-engine.js), você pode colar sua chave da API do Google Cloud diretamente na linha 9:
  ```javascript
  const GOOGLE_CLOUD_TTS_CONFIG = {
    API_KEY: "SUA_CHAVE_AQUI", // Cole aqui sua chave do Google Cloud
    ...
  };
  ```
  *(Assim sua namorada não precisa digitar nenhuma chave nem entender nada de configurações!)*

---

## 🚀 Como Executar

1. Abra a pasta:
   ```
   C:\Users\wmsli\.gemini\antigravity\scratch\scriptura-srs
   ```
2. Dê dois cliques em **`index.html`** para abrir no seu navegador.
