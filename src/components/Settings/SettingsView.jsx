import React, { useRef, useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  GitBranch,
  Globe,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Shield,
  Copy,
  Check,
  Cloud,
  User,
  Sparkles
} from 'lucide-react';

export default function SettingsView({
  data,
  updateSection,
  onResetData,
  onClearData,
  onImportData,
  user,
  isLoggedIn,
  isSyncing,
  onOpenAuth,
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
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Configurações & Workspace</h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Gerencie backups, comece do zero com um workspace limpo ou sincronize na nuvem.
        </p>
      </div>

      {/* Cloud & Account Card */}
      <div
        className={`p-6 md:p-8 rounded-3xl border shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-4">
          {isLoggedIn && user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border border-purple-500 shadow" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
              <Cloud className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-sm sm:text-base">
              {isLoggedIn ? (user.displayName || user.email) : 'Sincronização em Nuvem (Firebase)'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {isLoggedIn
                ? 'Seus dados estão salvos e sincronizados automaticamente na nuvem.'
                : 'Faça login com Google ou E-mail para acessar de qualquer computador ou celular.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
        >
          {isLoggedIn ? 'Gerenciar Conta' : 'Conectar Conta / Entrar'}
        </button>
      </div>

      {/* Workspace Management & Backup */}
      <div className={'p-6 md:p-8 rounded-3xl border shadow-md space-y-6 ' + (
        darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center gap-2 pb-3 border-b border-inherit">
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base">Gerenciamento do Workspace & Backup</h3>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Você tem controle total sobre suas notas e dados. Pode exportar backups a qualquer momento ou limpar tudo para começar do zero.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* Começar do Zero */}
          <button
            onClick={() => {
              if (window.confirm('⚠️ Tem certeza que deseja apagar todos os dados de exemplo e começar com o workspace 100% LIMPO e do zero?')) {
                onClearData();
                alert('✨ Workspace limpo com sucesso! Agora você pode criar suas próprias notas e registros.');
              }
            }}
            className="p-5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-semibold text-xs flex flex-col items-center text-center gap-2.5 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm text-red-300">Começar do Zero (Limpar Tudo)</span>
              <span className="text-[11px] text-gray-400 font-normal mt-1 block">
                Apaga os dados de exemplo para você criar suas próprias notas e finanças
              </span>
            </div>
          </button>

          {/* Restaurar Exemplo */}
          <button
            onClick={() => {
              if (window.confirm('Deseja recarregar os dados de exemplo padrão (modelos)?')) {
                onResetData();
                alert('Dados de exemplo restaurados com sucesso!');
              }
            }}
            className="p-5 rounded-2xl bg-gray-800/40 hover:bg-gray-800 border border-gray-700 text-gray-300 font-semibold text-xs flex flex-col items-center text-center gap-2.5 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-gray-700/50 text-gray-300 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm">Restaurar Exemplos</span>
              <span className="text-[11px] text-gray-400 font-normal mt-1 block">
                Carrega modelos e notas prontas para demonstração
              </span>
            </div>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="p-5 rounded-2xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 font-semibold text-xs flex flex-col items-center text-center gap-2.5 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm">Exportar Backup (JSON)</span>
              <span className="text-[11px] text-gray-400 font-normal mt-1 block">
                Salva todas as suas notas e finanças em um arquivo no seu PC
              </span>
            </div>
          </button>

          {/* Export Markdown */}
          <button
            onClick={handleExportMarkdownNotes}
            className="p-5 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex flex-col items-center text-center gap-2.5 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm">Exportar Notas (.md)</span>
              <span className="text-[11px] text-gray-400 font-normal mt-1 block">
                Exporta todas as suas anotações em formato Markdown do Obsidian
              </span>
            </div>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-5 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex flex-col items-center text-center gap-2.5 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm">Importar Backup (JSON)</span>
              <span className="text-[11px] text-gray-400 font-normal mt-1 block">
                Restaura um backup JSON salvo anteriormente
              </span>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
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

            <div className="pt-4 border-t border-inherit">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Inteligência Artificial (JARVIS)
              </h4>
              <div className="space-y-4">
                {data.settings?.isAdminUnlocked ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-gray-500">
                        Groq API Key (100% Grátis & Ultra-Rápido)
                      </label>
                      <a 
                        href="https://console.groq.com/keys" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
                      >
                        Pegar chave grátis ↗
                      </a>
                    </div>
                    <input
                      type="password"
                      placeholder="gsk_..."
                      value={data.settings?.groqApiKey || ''}
                      onChange={(e) => {
                        const newSettings = { ...(data.settings || {}), groqApiKey: e.target.value };
                        updateSection('settings', newSettings);
                      }}
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700 focus:border-purple-500' : 'bg-gray-50 border-gray-300 focus:border-purple-500'} outline-none font-mono`}
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                      O Groq é 100% gratuito, não pede cartão e é o mais rápido do mundo (Llama 3.3 70B).
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex flex-col gap-2">
                    <p className="text-xs text-gray-400 mb-1">Acesso Restrito. Insira as credenciais para ver a chave da API.</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        id="adminUser"
                        placeholder="Usuário" 
                        className="flex-1 px-2 py-1.5 text-xs rounded bg-black/50 border border-gray-700 outline-none focus:border-purple-500 text-gray-200"
                      />
                      <input 
                        type="password" 
                        id="adminPass"
                        placeholder="Senha" 
                        className="flex-1 px-2 py-1.5 text-xs rounded bg-black/50 border border-gray-700 outline-none focus:border-purple-500 text-gray-200"
                      />
                      <button 
                        onClick={() => {
                          const u = document.getElementById('adminUser').value;
                          const p = document.getElementById('adminPass').value;
                          if (u === 'admin' && p === 'admin') {
                             updateSection('settings', { ...(data.settings || {}), isAdminUnlocked: true });
                          } else {
                             alert('Credenciais incorretas!');
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        Desbloquear
                      </button>
                    </div>
                  </div>
                )}
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
