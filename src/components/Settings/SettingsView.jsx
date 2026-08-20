import React, { useRef, useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  GitBranch,
  Globe,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Shield,
  Copy,
  Check
} from 'lucide-react';

export default function SettingsView({
  data,
  onResetData,
  onImportData,
  darkMode,
  setDarkMode
}) {
  const fileInputRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'obnotion_backup_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
  };

  const handleExportMarkdownNotes = () => {
    (data.notes || []).forEach((note, idx) => {
      setTimeout(() => {
        const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.md';
        link.click();
      }, idx * 150);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const res = onImportData(json);
        if (res.success) {
          alert('Backup restaurado com sucesso!');
        } else {
          alert('Erro ao restaurar: ' + res.error);
        }
      } catch (err) {
        alert('Arquivo JSON inválido!');
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const deployCommands = [
    { label: '1. Inicializar repositório Git na pasta', cmd: `git init\ngit add .\ngit commit -m "Meu Obnotion inicial"` },
    { label: '2. Conectar com seu repositório no GitHub', cmd: `git remote add origin https://github.com/SEU_USUARIO/obnotion.git\ngit branch -M main\ngit push -u origin main` },
    { label: '3. Gerar os arquivos estáticos de produção', cmd: 'npm run build' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Configurações & GitHub Pages</h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Gerencie backups, exportações e aprenda a hospedar seu site gratuitamente no GitHub.
        </p>
      </div>

      {/* Backup & Data Management */}
      <div className={'p-6 md:p-8 rounded-3xl border shadow-md space-y-6 ' + (
        darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center gap-2 pb-3 border-b border-inherit">
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base">Backup & Privacidade de Dados</h3>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          O <strong>Obnotion</strong> roda 100% no seu navegador (LocalStorage). Nenhum dado é enviado para servidores externos. Você tem total posse dos seus arquivos e pode exportá-los quando desejar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="p-4 rounded-2xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 font-semibold text-xs flex flex-col items-center text-center gap-2 transition-all"
          >
            <Download className="w-5 h-5 text-purple-400" />
            <span>Exportar Backup Completo (JSON)</span>
          </button>

          {/* Export Markdown */}
          <button
            onClick={handleExportMarkdownNotes}
            className="p-4 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex flex-col items-center text-center gap-2 transition-all"
          >
            <FileCode className="w-5 h-5 text-indigo-400" />
            <span>Exportar Notas (.md)</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex flex-col items-center text-center gap-2 transition-all"
          >
            <Upload className="w-5 h-5 text-emerald-400" />
            <span>Importar Backup (JSON)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Reset Demo */}
          <button
            onClick={() => {
              if (confirm('Deseja restaurar os dados de exemplo padrão?')) onResetData();
            }}
            className="p-4 rounded-2xl bg-gray-800/40 hover:bg-gray-800 border border-gray-700 text-gray-400 font-semibold text-xs flex flex-col items-center text-center gap-2 transition-all"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
            <span>Restaurar Dados Exemplo</span>
          </button>
        </div>
      </div>

      {/* GitHub Pages Hosting Guide */}
      <div className={'p-6 md:p-8 rounded-3xl border shadow-md space-y-6 ' + (
        darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center gap-2 pb-3 border-b border-inherit">
          <GitBranch className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base">Como Hospedar no GitHub Pages (Gratuito)</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-xs text-purple-300">
            <Globe className="w-5 h-5 flex-shrink-0 text-purple-400 mt-0.5" />
            <div>
              <p className="font-bold">Seu Obnotion já está pronto para o GitHub Pages!</p>
              <p className="mt-1 text-gray-300">
                O arquivo <code className="bg-black/40 px-1 py-0.5 rounded">vite.config.js</code> já foi configurado com caminhos relativos (<code className="bg-black/40 px-1 py-0.5 rounded">base: './'</code>), garantindo funcionamento perfeito em qualquer subdomínio do GitHub.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {deployCommands.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">{item.label}</span>
                  <button
                    onClick={() => copyToClipboard(item.cmd, idx)}
                    className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === idx ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/40 text-[11px] font-mono text-purple-300 overflow-x-auto whitespace-pre-wrap">
                  {item.cmd}
                </pre>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-gray-900/40 border border-gray-800 space-y-2 text-xs text-gray-300">
            <h4 className="font-bold text-sm text-purple-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Ativação no GitHub (Último passo):
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-400 pl-1">
              <li>No seu repositório no GitHub, clique na aba <strong>Settings</strong>.</li>
              <li>No menu lateral esquerdo, clique em <strong>Pages</strong>.</li>
              <li>Em <strong>Build and deployment &gt; Source</strong>, selecione <strong>GitHub Actions</strong> (ou Branch <code className="bg-black/40 px-1 rounded">gh-pages</code>).</li>
              <li>Pronto! Seu link do Obnotion estará ativo em minutos (ex: <code className="bg-black/40 px-1 rounded text-purple-300">https://seu-usuario.github.io/obnotion/</code>).</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
