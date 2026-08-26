# Separador de Relatórios de Usuários Ativos por Bloco

Este script processa o PDF `Relatorio_usuarios_ativos_por_bloco_regiao.pdf` e gera automaticamente um PDF individual e formatado para cada bloco identificado (com cabeçalhos estilizados, faixas azuis escuras, contagem de regiões, congregações e usuários ativos).

## Como Executar

Para processar o arquivo padrão da pasta Downloads:
```bash
npm start
```

Ou especificando o caminho de outro arquivo PDF:
```bash
node split_blocos.mjs "C:\caminho\para\seu\arquivo.pdf"
```

## Pasta de Saída
Os arquivos gerados são salvos automaticamente na pasta:
`C:\Users\wmsli\OneDrive\Desktop\Relatorios_Por_Bloco`
