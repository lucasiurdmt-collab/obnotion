const pdf = require('pdf-parse');

/**
 * Extracts raw text from a PDF Buffer
 */
async function extractTextFromPdf(pdfBuffer) {
  const data = await pdf(pdfBuffer);
  return data.text;
}

const FALLBACK_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

/**
 * Parses sermon text into structured slide items using Gemini AI with resilient multi-model fallback
 */
async function parseSermonWithGemini(sermonText, apiKey, preferredModel = null) {
  const prompt = `Você é um especialista em design de slides de pregação e culto para projeção em igreja e telões de LED.
Sua missão é transformar o texto/esboço de um sermão enviado pelo pastor em uma sequência de SLIDES INDIVIDUAIS estruturados em JSON, seguindo rigorosamente as seguintes REGRAS:

### REGRAS CRÍTICAS E OBRIGATÓRIAS:
1. **VERSÍCULOS BÍBLICOS (type: 'verse')**:
   - Todo versículo ou passagem bíblica deve virar slide com o campo "reference" preenchido com precisão (ex: "Lucas 24:30-31", "Josué 24:15 ARC", "2Coríntios 9:6 NTLH", "1 Samuel 11:20-26", "1 Samuel 2:34-36").
   - REGRA OBRIGATÓRIA DE TELAS MÚLTIPLAS: Se uma passagem bíblica abranger vários slides (por exemplo: 1 Samuel 11:20-26, Marcos 7:24-30 ou um versículo longo dividido em 2 ou mais telas), A REFERÊNCIA BÍBLICA DEVE OBRIGATORIAMENTE ESTAR PREENCHIDA NO CAMPO "reference" DE TODOS OS SLIDES DESSA PASSAGEM, E NUNCA APENAS NO ÚLTIMO OU NO PRIMEIRO! Cada tela do versículo precisa exibir a referência bíblica no rodapé para a congregação no telão!
   - NUNCA omita nenhum versículo bíblico citado no texto!
   - Se os versículos vierem antes da referência bíblica no texto, TODOS eles pertencem a essa referência e devem receber esse mesmo campo "reference".
   - Todo versículo DEVE começar e terminar com aspas tipográficas “ ... ”.
   - Se uma passagem for longa (> 210 caracteres), DIVIDA-A em slides distintos nas quebras de frase (. ou ;), REPETINDO OBRIGATORIAMENTE o campo "reference" em cada slide gerado!
   - Limite estrito de 210 caracteres por slide para não poluir o telão.

2. **TÍTULOS, CABEÇALHOS, SEÇÕES E AVISOS (type: 'topic')**:
   - Títulos de seções (ex: "INÍCIO + ÁGUA", "FAMÍLIA", "DIZIMO E OFERTA", "CHAMAR PARA SEGUNDA-FEIRA", "TESTEMUNHO MÁRCIO JUSTINO", "PALAVRA", "RECADOS").
   - Avisos/orientações de altar e propósito (ex: "LEMBRAR DE ORAR PELOS FAMILIARES...", "palavra + migalha do pão").
   - Frases fortes e declarações centrais de fé.

3. **ANOTAÇÕES PESSOAIS DO PREGADOR**:
   - NÃO crie slides para anotações/tópicos de estudo pessoal do pregador (linhas com marcadores como • ou ◦ que contenham detalhes de sermão como "Carro velho que acabava a gasolina", "Emprestava de uma conta...", etc.). O telão deve conter apenas o que a congregação precisa ler: Títulos/Tópicos, Avisos do Culto e Versículos Bíblicos!

4. **DESTAQUES EM PALAVRAS-CHAVE (highlight: true/false)**:
   - Divida o texto de cada slide em 'runs' (fragmentos), marcando palavras de ênfase (ou onde houver [HL]...[/HL]) com highlight: true.

### FORMATO DA RESPOSTA:
Responda APENAS com um array JSON válido, com a seguinte estrutura:
[
  {
    "type": "topic",
    "runs": [
      { "text": "8. O Servo no Reino de Deus", "highlight": false }
    ]
  },
  {
    "type": "verse",
    "reference": "Mateus 6:24",
    "runs": [
      { "text": "“Ninguém pode servir a dois senhores; porque ou há de odiar um e amar o outro... ", "highlight": false },
      { "text": "Não podeis servir a Deus e a Mamom.”", "highlight": true }
    ]
  },
  {
    "type": "reflection",
    "runs": [
      { "text": "Quem pertence ao Reino de Deus não pode dividir o coração entre dois senhores.", "highlight": false }
    ]
  }
]

### TEXTO COMPLETO DO SERMÃO DO PASTOR:
${sermonText}
`;

  const models = preferredModel
    ? [preferredModel, ...FALLBACK_MODELS.filter(m => m !== preferredModel)]
    : FALLBACK_MODELS;

  let lastError = null;

  for (const model of models) {
    let timeoutId = null;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 20000);

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json'
          }
        })
      });

      clearTimeout(timeoutId);
      timeoutId = null;

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const errMsg = errBody?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        console.warn(`[Gemini AI] Modelo ${model} retornou erro:`, errMsg);
        lastError = errMsg;
        continue;
      }

      const data = await res.json();
      if (data.error) {
        console.warn(`[Gemini AI] Modelo ${model} retornou erro:`, data.error.message);
        lastError = data.error.message;
        continue;
      }

      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) {
        lastError = `Modelo ${model} retornou resposta vazia.`;
        continue;
      }

      const cleanJson = rawJson.replace(/```(?:json)?\s*/gi, '').replace(/```\s*$/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      const list = Array.isArray(parsed) ? parsed : (parsed.slides || []);
      if (list.length > 0) {
        list.forEach(s => {
          if (s.runs && Array.isArray(s.runs)) {
            s.runs.forEach(r => {
              if (r.text) {
                if (r.text.includes('[HL]')) r.highlight = true;
                r.text = r.text.replace(/\[\/?HL\]/g, '');
              }
            });
          }
        });
        console.log(`[Gemini AI] Sucesso com o modelo ${model}: ${list.length} slides estruturados.`);
        return propagateBibleReferences(list);
      }
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      console.warn(`[Gemini AI] Falha na tentativa com modelo ${model}:`, err.message);
      lastError = err.message;
    }
  }

  throw new Error(lastError || 'Não foi possível validar os slides com a IA Gemini em nenhum dos modelos disponíveis.');
}

function propagateBibleReferences(slides) {
  if (!Array.isArray(slides) || slides.length === 0) return slides;

  const isHeading = (s) => {
    if (!s) return false;
    if (s.type === 'topic' || s.type === 'cinzel_cover' || s.type === 'cinzel_question' || s.type === 'cover' || s.type === 'title') return true;
    const txt = (s.text || (s.runs ? s.runs.map(r => r.text).join('') : '')).trim();
    if (txt.length < 90 && txt.length >= 4) {
      const letters = txt.replace(/[^a-zA-ZÀ-ÿ]/g, '');
      if (letters.length >= 4) {
        const uppercaseCount = (txt.match(/[A-ZÀ-Ý]/g) || []).length;
        if (uppercaseCount / letters.length >= 0.70) return true;
      }
    }
    return false;
  };

  const getSlideText = (s) => {
    return (s.text || (s.runs ? s.runs.map(r => r.text).join('') : '')).trim();
  };

  // Propagação segura APENAS para a frente (Forward propagation):
  // Se um versículo foi dividido em múltiplos slides (ex: chunk 1, chunk 2)
  // e o primeiro slide tem referência mas os seguintes ficaram sem referência
  for (let i = 0; i < slides.length - 1; i++) {
    const s = slides[i];
    if (!s || !s.reference) continue;
    const ref = s.reference.trim();

    let j = i + 1;
    while (j < slides.length) {
      const next = slides[j];
      if (!next) break;
      if (next.reference && next.reference.trim()) break;
      if (isHeading(next)) break;

      const nextText = getSlideText(next);
      const isQuoted = /^[“"']/.test(nextText) || /[”"']$/.test(nextText);
      const isVerseType = next.type === 'verse' || next.type === 'versículo';

      if (isVerseType || isQuoted) {
        next.reference = ref;
        next.type = 'verse';
        if (next.runs && Array.isArray(next.runs) && next.runs.length > 0) {
          const first = next.runs[0];
          const last = next.runs[next.runs.length - 1];
          if (first && first.text && !first.text.startsWith('“')) first.text = '“' + first.text.replace(/^[“"']/, '');
          if (last && last.text && !last.text.endsWith('”')) last.text = last.text.replace(/[”"']$/, '') + '”';
        }
        j++;
      } else {
        break;
      }
    }
  }

  return slides;
}

module.exports = { extractTextFromPdf, parseSermonWithGemini };
