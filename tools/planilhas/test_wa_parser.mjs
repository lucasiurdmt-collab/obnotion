const sampleMessages = `
[09/08, 17:45] Minha Princesa: 📍Relatorio Unidade: Dom Bosco 
🔷Data: 06/07/2026   
20 horas         
🔷Quant de Voluntarios: 2         
🔷 Quem fez a reunião:  João e Sr celson 
🔷Quant de Adolescentes:44
🔷 Quant de agentes: 9
🔷Atividade Realizada: oração e palavra 
🔷 Folha Universal: 0
🔷 Bíblia e Revista: 1 biblia
🔷Quant alimento doado:  0
[09/08, 17:45] Minha Princesa: 📍Relatorio Unidade: Horto 
🔷Data: 05/07/2026 
      15 horas           
🔷Quant de Voluntarios: 5         
🔷 Quem fez a reunião:  João 
🔷Quant de Adolescentes:11
🔷 Quant de agentes: 18
🔷Atividade Realizada: oração e palavra 
🔷 Folha Universal: 20
🔷 Bíblia e Revista: 7 livros
🔷Quant alimento doado:  1 bolo,2 pacotes de pão de forma,1 requeijão,1 rosca,1 iorgte,1 refrigerante,2 sucos
[09/08, 17:45] Minha Princesa: 📍Relatório  Unidade: 
SÃO JERÔNIMO 
🔷Data: 05/07/2026            
🔷Quant de Voluntarios:    02      
🔷 Quem fez a reunião: Obr Jéssica Custódio e Graziele
🔷Quant de Adolescentes: 01
🔷 Quant de agentes: 0
🔷Atividade Realizada: oração e palavra 
🔷 Folha Universal: 00
🔷 Bíblia e Revista: 00
🔷Quant alimento doado:00
[09/08, 17:45] Minha Princesa: 📍Relatório  Unidade: 
🔷Data: 05/07/2026            
🔷Quant de Voluntarios:    02      
🔷 Quem fez a reunião: Simone
🔷Quant de Adolescentes: 04
🔷 Quant de agentes: 01
🔷Atividade Realizada: oração e palavra 
🔷 Folha Universal: 00
🔷 Bíblia e Revista: 00
🔷Quant alimento doado:00
`;

function parseWhatsAppMessages(rawText) {
  // Split rawText into individual report blocks (either by [dd/dd, hh:mm] or 📍)
  const reportRegex = /(?:\[\d{2}\/\d{2}[^\]]*\]\s*[^:]+:\s*)?(?:📍|\bRelat[oó]rio\b)/gi;
  
  // Clean text and split by 📍
  const rawReports = rawText.split(/(?=📍|Relat[oó]rio\s+Unidade)/gi).filter(t => t.trim().length > 10);
  
  const parsedResults = [];

  for (let raw of rawReports) {
    const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let unidade = "";
    let data = "";
    let horario = "";
    let voluntarios = "";
    let quemFez = "";
    let adolescentes = "";
    let agentes = "";
    let atividade = "";
    let folhaUniversal = "";
    let bibliaRevista = "";
    let alimento = "";

    // Extract unidade
    const unidadeMatch = raw.match(/Unidade:\s*([^\n\r🔷]+)/i);
    if (unidadeMatch && unidadeMatch[1].trim()) {
      unidade = unidadeMatch[1].trim();
    } else {
      // Check if unit is on next line
      const lines = raw.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes('unidade:') && i + 1 < lines.length && !lines[i+1].includes('🔷')) {
          unidade = lines[i+1].trim();
          break;
        }
      }
    }

    // Extract Data
    const dataMatch = raw.match(/Data:\s*([^\n\r🔷]+)/i);
    if (dataMatch) {
      data = dataMatch[1].trim();
    }

    // Extract Horario (either with Data or separate line)
    const horaMatch = raw.match(/(\d{1,2}(?::\d{2})?\s*(?:horas|h|H|\b))\b/);
    const rawHora = raw.match(/Data:[^\n\r]+\n\s*([0-9]{1,2}(?::[0-9]{2})?\s*(?:horas|h)?)/i);
    if (rawHora) {
      horario = rawHora[1].trim();
    }

    // Extract Voluntarios
    const volMatch = raw.match(/Volunt[aá]rios:\s*([^\n\r🔷]+)/i);
    if (volMatch) voluntarios = volMatch[1].trim();

    // Extract Quem fez
    const quemMatch = raw.match(/Quem fez a reuni[aã]o:\s*([^\n\r🔷]+)/i);
    if (quemMatch) quemFez = quemMatch[1].trim();

    // Extract Adolescentes
    const adolMatch = raw.match(/Adolescentes:\s*([^\n\r🔷]+)/i);
    if (adolMatch) adolescentes = adolMatch[1].trim();

    // Extract Agentes
    const agentMatch = raw.match(/agentes:\s*([^\n\r🔷]+)/i);
    if (agentMatch) agentes = agentMatch[1].trim();

    // Extract Atividade
    const ativMatch = raw.match(/Atividade Realizada:\s*([^\n\r🔷]+)/i);
    if (ativMatch) atividade = ativMatch[1].trim();

    // Extract Folha Universal
    const folhaMatch = raw.match(/Folha Universal:\s*([^\n\r🔷]+)/i);
    if (folhaMatch) folhaUniversal = folhaMatch[1].trim();

    // Extract Biblia e Revista
    const bibMatch = raw.match(/B[íi]blia e Revista:\s*([^\n\r🔷]+)/i);
    if (bibMatch) bibliaRevista = bibMatch[1].trim();

    // Extract Alimento
    const alimMatch = raw.match(/alimento doado:\s*([^\n\r🔷]+)/i);
    if (alimMatch) alimento = alimMatch[1].trim();

    parsedResults.push({
      unidade,
      data,
      horario,
      dataCompleta: [data, horario].filter(Boolean).join(' '),
      voluntarios,
      quemFez,
      adolescentes,
      agentes,
      atividade,
      folhaUniversal,
      bibliaRevista,
      alimento,
      raw
    });
  }

  return parsedResults;
}

console.log(JSON.stringify(parseWhatsAppMessages(sampleMessages), null, 2));
