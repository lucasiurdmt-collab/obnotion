const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PptxGenJS = require('pptxgenjs');
const JSZip = require('jszip');

function ensureCurlyQuotes(runs) {
  if (!runs || !Array.isArray(runs) || runs.length === 0) return runs;
  const firstText = runs[0].text || '';
  if (!/^[“"']/.test(firstText.trim())) {
    runs[0].text = '“' + runs[0].text;
  } else if (firstText.startsWith('"')) {
    runs[0].text = '“' + runs[0].text.slice(1);
  }
  const lastIdx = runs.length - 1;
  const lastText = runs[lastIdx].text || '';
  if (!/[”"']$/.test(lastText.trim())) {
    runs[lastIdx].text = runs[lastIdx].text + '”';
  } else if (lastText.endsWith('"')) {
    runs[lastIdx].text = runs[lastIdx].text.slice(0, -1) + '”';
  }
  return runs;
}

function propagateBibleReferences(slides) {
  if (!Array.isArray(slides) || slides.length === 0) return slides;

  const isHeading = (s) => {
    if (!s) return false;
    if (s.type === 'topic' || s.type === 'cinzel_cover' || s.type === 'cinzel_question' || s.type === 'cover' || s.type === 'title') return true;
    const txt = (s.text || (s.runs ? s.runs.map(r => r.text).join('') : '')).trim();
    if (typeof isHeadingOrTopic === 'function' && isHeadingOrTopic(txt)) return true;
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
      if (next.reference && next.reference.trim()) break; // Já tem sua própria referência
      if (isHeading(next)) break; // Tópico ou título é barreira

      const nextText = getSlideText(next);
      const isQuoted = /^[“"']/.test(nextText) || /[”"']$/.test(nextText);
      const isVerseType = next.type === 'verse' || next.type === 'versículo';

      if (isVerseType || isQuoted) {
        next.reference = ref;
        next.type = 'verse';
        if (next.runs) {
          ensureCurlyQuotes(next.runs);
        }
        j++;
      } else {
        break;
      }
    }
  }

  return slides;
}

/**
 * Builds a 16:9 Full HD presentation adhering strictly to the church's sermon style.
 * Supports multiple official themes:
 * - Tema Bíblia (Padrão Oficial Igreja): Bahnschrift SemiBold Condensed, Branco & Dourado (#E8B859), Alinhado à Esquerda
 * - Tema TS: Fundo TS Malha Fina 4K, Bahnschrift SemiBold Condensed, Branco & Dourado
 * - Tema Nobre Cinzel: Fundo Nobre 4K, Tipografia Cinzel (Bold/Black), Marfim (#E1D3C1) & Ouro Nobre (#E6C486), Alinhamento Centralizado
 * 
 * @param {Array} slidesData - Array of slide definitions
 * @param {string} bgImagePath - Path to the background image.
 * @param {string} outputFilePath - Output path for the .pptx file.
 */
async function buildSermonPptx(slidesData, bgImagePath, outputFilePath) {
  let options = {};
  if (typeof bgImagePath === 'object' && bgImagePath !== null) {
    options = bgImagePath;
    bgImagePath = options.bgImagePath || options.bgImage || null;
    outputFilePath = options.outputFilePath || outputFilePath;
  }
  bgImagePath = typeof bgImagePath === 'string' ? bgImagePath : null;
  outputFilePath = outputFilePath || path.join(__dirname, 'downloads', `sermon_${Date.now()}.pptx`);

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'CHURCH_FULL_HD', width: 13.333, height: 7.5 });
  pptx.layout = 'CHURCH_FULL_HD';

  // Blindagem Universal: Propagar referência bíblica em todas as telas de uma passagem (ex: 1 Samuel 11:20-26)
  slidesData = propagateBibleReferences(slidesData);

  const isCinzelPresentation = (bgImagePath && (bgImagePath.includes('cinzel') || bgImagePath.includes('nobre'))) ||
    options.theme === 'cinzel' || options.theme === 'theme_cinzel' || options.theme === 'nobre' ||
    slidesData.some(s => s && (
      (s.bgImage && typeof s.bgImage === 'string' && (s.bgImage.includes('cinzel') || s.bgImage.includes('nobre'))) ||
      s.theme === 'cinzel' || s.theme === 'theme_cinzel' || s.theme === 'nobre' ||
      s.fontFace === 'Cinzel'
    ));

  for (let slideIndex = 0; slideIndex < slidesData.length; slideIndex++) {
    const item = slidesData[slideIndex];
    if (!item) continue;

    // Normalizar e blindar runs para evitar TypeError
    if (!item.runs || !Array.isArray(item.runs)) {
      item.runs = [{ text: item.text || '', highlight: false }];
    } else {
      item.runs = item.runs.map(r => (typeof r === 'string' ? { text: r, highlight: false } : { text: r?.text || '', highlight: !!r?.highlight }));
    }

    const slide = pptx.addSlide();

    // 1. Imagem de fundo (16:9 Full HD)
    const itemBg = item.bgImage || item.backgroundImage;
    if (itemBg) {
      if (itemBg.startsWith('data:')) {
        slide.background = { data: itemBg };
      } else if (fs.existsSync(itemBg)) {
        slide.background = { path: itemBg };
      } else if (itemBg.startsWith('/downloads/')) {
        const potentialPath = path.join(__dirname, 'downloads', path.basename(itemBg));
        if (fs.existsSync(potentialPath)) {
          slide.background = { path: potentialPath };
        } else if (bgImagePath && fs.existsSync(bgImagePath)) {
          slide.background = { path: bgImagePath };
        } else {
          slide.background = { color: '000000' };
        }
      } else if (itemBg.startsWith('/assets/') || itemBg.startsWith('assets/')) {
        const rel = itemBg.startsWith('/') ? itemBg.slice(1) : itemBg;
        const potentialPath = path.join(__dirname, 'public', rel);
        if (fs.existsSync(potentialPath)) {
          slide.background = { path: potentialPath };
        } else if (bgImagePath && fs.existsSync(bgImagePath)) {
          slide.background = { path: bgImagePath };
        } else {
          slide.background = { color: '000000' };
        }
      } else if (bgImagePath && fs.existsSync(bgImagePath)) {
        slide.background = { path: bgImagePath };
      } else {
        slide.background = { color: '000000' };
      }
    } else if (bgImagePath && fs.existsSync(bgImagePath)) {
      slide.background = { path: bgImagePath };
    } else {
      slide.background = { color: '000000' };
    }

    const type = item.type || 'verse';
    const isCinzel = isCinzelPresentation ||
      (itemBg && (itemBg.includes('cinzel') || itemBg.includes('nobre'))) ||
      item.theme === 'cinzel' || item.theme === 'theme_cinzel' || item.theme === 'nobre' ||
      item.fontFace === 'Cinzel';

    const defaultAlign = isCinzel ? 'center' : 'left';
    const isLeftAlign = item.align ? item.align === 'left' : defaultAlign === 'left';
    const startX = isCinzel ? 0.25 : 0.9;
    const textWidth = isCinzel ? 12.83 : 11.533; // Margens ideais no Cinzel para 16:9 widescreen

    const defaultFontFace = isCinzel ? 'Cinzel Bold' : 'Bahnschrift SemiBold Condensed';
    const pptxFontFace = item.fontFace || defaultFontFace;

    const baseTextColor = isCinzel ? 'E1D3C1' : 'FFFFFF';
    const highlightColor = isCinzel ? 'E6C486' : 'E8B859';
    const refColor = isCinzel ? 'E1D3C1' : 'E8B859';
    const shadowConfig = isCinzel
      ? { type: 'outer', angle: 90, blur: 4, offset: 2, opacity: 0.65, color: '000000' }
      : { type: 'outer', angle: 90, blur: 5, offset: 3, opacity: 0.75, color: '000000' };

    // --- SLIDE DE CAPA / TÍTULO NO CINZEL (SLIDE 1) ---
    if (type === 'cinzel_cover' || (isCinzel && slideIndex === 0 && (type === 'topic' || type === 'cover' || type === 'title'))) {
      let l1 = item.line1;
      let l2 = item.line2;
      if (!l1 || !l2) {
        const fullTitle = item.runs ? item.runs.map(r => r.text).join('') : (item.text || '');
        const upper = fullTitle.toUpperCase();
        const splitWords = ['TÊM PARTE', 'TEM PARTE', 'PARTE NA', 'PARTE DA'];
        let found = false;
        for (const sw of splitWords) {
          const idx = upper.indexOf(sw);
          if (idx !== -1) {
            l1 = upper.substring(0, idx).trim();
            l2 = upper.substring(idx).trim();
            found = true;
            break;
          }
        }
        if (!found) {
          const words = upper.split(' ');
          if (words.length >= 3) {
            const mid = Math.ceil(words.length / 2);
            l1 = words.slice(0, mid).join(' ');
            l2 = words.slice(mid).join(' ');
          } else {
            l1 = upper;
            l2 = '';
          }
        }
      }

      const l1Words = l1.split(' ');
      let r1 = [];
      if (l1Words.length >= 3) {
        const prefix = l1Words.slice(0, 2).join(' ') + ' ';
        const suffix = l1Words.slice(2).join(' ');
        r1 = [
          { text: prefix, options: { fontFace: 'Cinzel Bold', fontSize: 60, color: 'E1D3C1', bold: true, shadow: shadowConfig } },
          { text: suffix, options: { fontFace: 'Cinzel Black', fontSize: 60, color: 'E1D3C1', bold: true, shadow: shadowConfig } }
        ];
      } else {
        r1 = [{ text: l1, options: { fontFace: 'Cinzel Bold', fontSize: 60, color: 'E1D3C1', bold: true, shadow: shadowConfig } }];
      }

      slide.addText(r1, {
        x: l2 ? 0.57 : startX,
        y: l2 ? 2.69 : 2.70,
        w: l2 ? 12.19 : textWidth,
        h: l2 ? 1.11 : 2.20,
        align: l2 ? 'left' : 'center',
        valign: 'middle',
        margin: 0,
        wrap: true
      });

      if (l2) {
        slide.addText([
          { text: l2, options: { fontFace: 'Cinzel Black', fontSize: 66, color: 'E1D3C1', bold: true, shadow: shadowConfig } }
        ], {
          x: 0.29,
          y: 3.50,
          w: 12.76,
          h: 1.21,
          align: 'left',
          valign: 'middle',
          margin: 0,
          wrap: true
        });
      }

    // --- SLIDE DE PERGUNTA / TÓPICO NO CINZEL ---
    } else if (type === 'cinzel_question' || (isCinzel && (type === 'question_short' || type === 'question'))) {
      let q1 = item.line1;
      let q2 = item.line2;
      if (!q1 || !q2) {
        const fullQ = item.runs ? item.runs.map(r => r.text).join('') : (item.text || '');
        const words = fullQ.split(' ');
        if (words.length >= 4) {
          const mid = Math.max(3, Math.floor(words.length / 2));
          q1 = words.slice(0, mid).join(' ');
          q2 = words.slice(mid).join(' ').toUpperCase();
        } else {
          q1 = fullQ;
          q2 = '';
        }
      }

      slide.addText([
        { text: q1, options: { fontFace: 'Cinzel Bold', fontSize: 54, color: 'E1D3C1', bold: true, shadow: shadowConfig } }
      ], {
        x: q2 ? 1.33 : startX,
        y: q2 ? 2.93 : 2.50,
        w: q2 ? 10.33 : textWidth,
        h: q2 ? 1.01 : 2.50,
        align: q2 ? 'left' : 'center',
        valign: 'middle',
        margin: 0,
        wrap: true
      });

      if (q2) {
        slide.addText([
          { text: q2, options: { fontFace: 'Cinzel Black', fontSize: 54, color: 'E1D3C1', bold: true, shadow: shadowConfig } }
        ], {
          x: 0.13,
          y: 3.56,
          w: 13.07,
          h: 1.21,
          align: 'center',
          valign: 'middle',
          margin: 0,
          wrap: true
        });
      }

    // --- VERSÍCULOS BÍBLICOS ---
    } else if (type === 'verse' || type === 'versículo') {
      if (isCinzel) {
        ensureCurlyQuotes(item.runs);
      }
      const textLength = item.runs.reduce((acc, r) => acc + (r.text || '').length, 0);
      let fontSize = 54;
      if (isCinzel) {
        if (textLength <= 45) {
          fontSize = 68;
        } else if (textLength <= 90) {
          fontSize = 54;
        } else if (textLength <= 150) {
          fontSize = 48;
        } else if (textLength <= 210) {
          fontSize = 42;
        } else {
          fontSize = 38;
        }
      } else {
        if (textLength <= 50) {
          fontSize = 74;
        } else if (textLength <= 90) {
          fontSize = 64;
        } else if (textLength <= 150) {
          fontSize = 56;
        } else if (textLength <= 210) {
          fontSize = 48;
        } else {
          fontSize = 42;
        }
      }

      const hasRef = !!(item.reference && item.reference.trim());
      // Centralização vertical matemática (valign: middle):
      // Com referência, ocupa área útil superior (y=1.00 a 5.85, centro 3.425) e ref ancorada no rodapé (y=6.00)
      // Sem referência, ocupa o centro absoluto do slide 16:9 (y=0.90 a 6.60, centro 3.75)
      const refY = isCinzel ? 6.00 : 6.05;
      const refH = isCinzel ? 0.55 : 0.65;
      const verseY = hasRef ? 1.00 : 0.90;
      const verseH = hasRef ? 4.85 : 5.70;

      const runs = item.runs.map(r => ({
        text: (r.text || '').replace(/\[\/?HL\]/g, ''),
        options: {
          fontFace: isCinzel ? (r.highlight ? 'Cinzel Black' : (item.fontFace || 'Cinzel Bold')) : pptxFontFace,
          fontSize: fontSize,
          color: r.highlight ? highlightColor : baseTextColor,
          bold: true,
          shadow: shadowConfig
        }
      }));

      // Caixa 1: Texto do Versículo
      slide.addText(runs, {
        x: startX,
        y: verseY,
        w: textWidth,
        h: verseH,
        valign: 'middle',
        align: isCinzel ? 'center' : (isLeftAlign ? 'left' : 'center'),
        margin: 0,
        wrap: true
      });

      // Caixa 2: Referência Bíblica SEPARADA no rodapé
      if (hasRef) {
        slide.addText(item.reference.toUpperCase(), {
          x: startX,
          y: refY,
          w: textWidth,
          h: refH,
          valign: 'middle',
          align: isCinzel ? 'center' : (isLeftAlign ? 'left' : 'center'),
          fontFace: isCinzel ? 'Cinzel' : pptxFontFace,
          fontSize: isCinzel ? 28 : 34,
          color: refColor,
          bold: true,
          margin: 0,
          wrap: false,
          shadow: shadowConfig
        });
      }

    // --- REFLEXÕES / COMENTÁRIOS PASTORAIS ---
    } else if (type === 'reflection') {
      const textLength = item.runs.reduce((acc, r) => acc + (r.text || '').length, 0);
      let fontSize = 48;
      if (isCinzel) {
        if (textLength <= 90) fontSize = 50;
        else if (textLength <= 160) fontSize = 48;
        else fontSize = 42;
      } else {
        if (textLength <= 80) fontSize = 58;
        else if (textLength <= 150) fontSize = 50;
        else fontSize = 44;
      }

      const hasRef = !!(item.reference && item.reference.trim());
      const refY = isCinzel ? 6.00 : 6.05;
      const refH = isCinzel ? 0.55 : 0.65;
      const reflY = hasRef ? 1.00 : 0.90;
      const reflH = hasRef ? 4.85 : 5.70;

      const runs = item.runs.map(r => ({
        text: (r.text || '').replace(/\[\/?HL\]/g, ''),
        options: {
          fontFace: isCinzel ? (r.highlight ? 'Cinzel Black' : (item.fontFace || 'Cinzel Bold')) : pptxFontFace,
          fontSize: fontSize,
          color: r.highlight ? highlightColor : baseTextColor,
          bold: true,
          shadow: shadowConfig
        }
      }));

      slide.addText(runs, {
        x: startX,
        y: reflY,
        w: textWidth,
        h: reflH,
        valign: 'middle',
        align: isCinzel ? 'center' : (isLeftAlign ? 'left' : 'center'),
        margin: 0,
        wrap: true
      });

      if (hasRef) {
        slide.addText(item.reference.toUpperCase(), {
          x: startX,
          y: refY,
          w: textWidth,
          h: refH,
          valign: 'middle',
          align: isCinzel ? 'center' : (isLeftAlign ? 'left' : 'center'),
          fontFace: isCinzel ? 'Cinzel' : pptxFontFace,
          fontSize: isCinzel ? 28 : 34,
          color: refColor,
          bold: true,
          margin: 0,
          wrap: false,
          shadow: shadowConfig
        });
      }

    // --- OUTROS TÓPICOS / CABEÇALHOS GERAIS ---
    } else {
      const textLength = item.runs.reduce((acc, r) => acc + (r.text || '').length, 0);
      let fontSize = 54;
      if (isCinzel) {
        if (textLength < 35) {
          fontSize = 66;
        } else if (textLength < 70) {
          fontSize = 56;
        } else if (textLength > 120) {
          fontSize = 44;
        } else {
          fontSize = 50;
        }
      } else {
        if (textLength < 40) fontSize = 78;
        else if (textLength > 90) fontSize = 54;
      }

      const hasRef = !!(item.reference && item.reference.trim());
      const refY = isCinzel ? 6.00 : 6.05;
      const refH = isCinzel ? 0.55 : 0.65;
      const topicY = hasRef ? 1.00 : 0.90;
      const topicH = hasRef ? 4.85 : 5.70;

      const runs = item.runs.map(r => ({
        text: (r.text || '').replace(/\[\/?HL\]/g, ''),
        options: {
          fontFace: isCinzel ? (r.highlight ? 'Cinzel Black' : (item.fontFace || 'Cinzel Bold')) : pptxFontFace,
          fontSize: fontSize,
          color: r.highlight ? highlightColor : (isCinzel ? highlightColor : baseTextColor),
          bold: true,
          shadow: shadowConfig
        }
      }));

      slide.addText(runs, {
        x: startX,
        y: topicY,
        w: textWidth,
        h: topicH,
        valign: 'middle',
        align: isCinzel ? 'center' : (isLeftAlign ? 'left' : 'center'),
        margin: 0,
        wrap: true
      });

      if (hasRef) {
        slide.addText(item.reference.toUpperCase(), {
          x: startX,
          y: refY,
          w: textWidth,
          h: refH,
          valign: 'middle',
          align: isCinzel ? 'center' : (isLeftAlign ? 'left' : 'center'),
          fontFace: isCinzel ? 'Cinzel' : pptxFontFace,
          fontSize: isCinzel ? 28 : 34,
          color: refColor,
          bold: true,
          margin: 0,
          wrap: false,
          shadow: shadowConfig
        });
      }
    }
  }

  const rawBuffer = await pptx.write({ outputType: 'nodebuffer' });
  try {
    const zip = await JSZip.loadAsync(rawBuffer);
    const themeFile = zip.file('ppt/theme/theme1.xml');
    if (themeFile && typeof themeFile.async === 'function') {
      let themeXml = await themeFile.async('text');
      const targetTypeface = isCinzelPresentation ? 'Cinzel' : 'Bahnschrift SemiBold Condensed';
      themeXml = themeXml.replace(/<a:latin typeface="[^"]*"/g, `<a:latin typeface="${targetTypeface}"`);
      zip.file('ppt/theme/theme1.xml', themeXml);
    }

    let fontToUse = null;
    let fontName = 'Bahnschrift';
    let relId = 'rIdFontBahnschrift';

    if (isCinzelPresentation) {
      const cinzelBold = path.join(__dirname, 'public', 'assets', 'fonts', 'Cinzel-Bold.otf');
      const rootCinzel = path.join(__dirname, 'assets', 'fonts', 'Cinzel-Bold.otf');
      fontToUse = fs.existsSync(cinzelBold) ? cinzelBold : (fs.existsSync(rootCinzel) ? rootCinzel : null);
      fontName = 'Cinzel';
      relId = 'rIdFontCinzel';
    } else {
      const localFontPath = path.join(__dirname, 'public', 'assets', 'bahnschrift.ttf');
      const winFontPath = 'C:/Windows/Fonts/bahnschrift.ttf';
      fontToUse = fs.existsSync(localFontPath) ? localFontPath : (fs.existsSync(winFontPath) ? winFontPath : null);
      fontName = 'Bahnschrift SemiBold Condensed';
      relId = 'rIdFontBahnschrift';
    }

    if (fontToUse) {
      const fontBuf = fs.readFileSync(fontToUse);
      zip.file('ppt/fonts/font1.fntdata', fontBuf);
      const ctFile = zip.file('[Content_Types].xml');
      if (ctFile && typeof ctFile.async === 'function') {
        let ct = await ctFile.async('text');
        if (!ct.includes('Extension="fntdata"')) {
          ct = ct.replace('</Types>', '<Default Extension="fntdata" ContentType="application/x-fontdata"/></Types>');
          zip.file('[Content_Types].xml', ct);
        }
      }
      const relsFile = zip.file('ppt/_rels/presentation.xml.rels');
      if (relsFile && typeof relsFile.async === 'function') {
        let rels = await relsFile.async('text');
        if (!rels.includes(relId)) {
          const rel = `<Relationship Id="${relId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font1.fntdata"/>`;
          rels = rels.replace('</Relationships>', rel + '</Relationships>');
          zip.file('ppt/_rels/presentation.xml.rels', rels);
        }
      }
      const presFile = zip.file('ppt/presentation.xml');
      if (presFile && typeof presFile.async === 'function') {
        let pres = await presFile.async('text');
        if (!pres.includes('embeddedFontLst')) {
          const embedded = '<p:embeddedFontLst>' +
            '<p:embeddedFont>' +
              `<p:font typeface="${fontName}"/>` +
              `<p:regular r:id="${relId}"/>` +
              `<p:bold r:id="${relId}"/>` +
            '</p:embeddedFont>' +
          '</p:embeddedFontLst>';
          pres = pres.replace('</p:presentation>', embedded + '</p:presentation>');
          zip.file('ppt/presentation.xml', pres);
        }
      }
    }
    // Deduplicação inteligente de mídias repetidas (otimiza PPTX 4K de ~40MB para ~2.8MB mantendo resolução máxima)
    try {
      const mediaHashes = {};
      const targetMap = {};
      const mediaFiles = Object.keys(zip.files).filter(k => k.startsWith('ppt/media/') && !k.endsWith('/'));
      for (const mName of mediaFiles) {
        const data = await zip.file(mName).async('nodebuffer');
        const hashKey = crypto.createHash('md5').update(data).digest('hex');
        if (mediaHashes[hashKey]) {
          targetMap[mName] = mediaHashes[hashKey];
          zip.remove(mName);
        } else {
          mediaHashes[hashKey] = mName;
        }
      }

      if (Object.keys(targetMap).length > 0) {
        const relsFiles = Object.keys(zip.files).filter(k => k.startsWith('ppt/slides/_rels/slide') && k.endsWith('.xml.rels'));
        for (const rName of relsFiles) {
          let relText = await zip.file(rName).async('text');
          for (const [dup, master] of Object.entries(targetMap)) {
            const dupTarget = '../media/' + path.basename(dup);
            const masterTarget = '../media/' + path.basename(master);
            relText = relText.split(dupTarget).join(masterTarget);
          }
          zip.file(rName, relText);
        }
      }
    } catch (dedupErr) {
      console.warn('Aviso: falha na deduplicação de mídia do PPTX:', dedupErr.message);
    }

    const finalBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    fs.writeFileSync(outputFilePath, finalBuffer);
  } catch(e) {
    fs.writeFileSync(outputFilePath, rawBuffer);
  }
  return {
    slideCount: slidesData.length,
    outputFilePath
  };
}

module.exports = { buildSermonPptx };
