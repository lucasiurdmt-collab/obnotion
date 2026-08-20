import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  LogIn,
  LogOut,
  Sparkles,
  Cloud,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  user,
  isLoggedIn,
  isSyncing,
  lastSynced,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  resetPassword,
  syncToCloudNow,
  darkMode
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (!res.success) {
      setErrorMsg(formatErrorMessage(res.error));
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (mode === 'login') {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(formatErrorMessage(res.error));
      }
    } else if (mode === 'register') {
      if (password.length < 6) {
        setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
        setLoading(false);
        return;
      }
      const res = await registerWithEmail(email, password, displayName);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(formatErrorMessage(res.error));
      }
    } else if (mode === 'forgot') {
      const res = await resetPassword(email);
      if (res.success) {
        setSuccessMsg('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      } else {
        setErrorMsg(formatErrorMessage(res.error));
      }
    }

    setLoading(false);
  };

  const formatErrorMessage = (msg = '') => {
    if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
      return 'E-mail ou senha incorretos.';
    }
    if (msg.includes('email-already-in-use')) {
      return 'Este e-mail já está cadastrado.';
    }
    if (msg.includes('invalid-email')) {
      return 'Formato de e-mail inválido.';
    }
    if (msg.includes('popup-closed-by-user')) {
      return 'Janela de autenticação foi fechada.';
    }
    return msg || 'Ocorreu um erro. Tente novamente.';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all transform duration-200 ${
          darkMode
            ? 'bg-[#181922] border-gray-800 text-gray-100'
            : 'bg-white border-gray-200 text-gray-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-none">
                {isLoggedIn ? 'Sua Conta Obnotion' : 'Entrar no Obnotion'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {isLoggedIn ? 'Sincronização em Nuvem Ativa' : 'Sincronize suas notas em qualquer dispositivo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoggedIn ? (
            /* Logged In Profile View */
            <div className="space-y-5">
              {/* User Info Card */}
              <div
                className={`p-4 rounded-xl border flex items-center space-x-4 ${
                  darkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    className="w-14 h-14 rounded-full border-2 border-purple-500 object-cover shadow"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-xl font-bold uppercase shadow">
                    {(user.displayName || user.email || 'U')[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">
                    {user.displayName || 'Usuário Obnotion'}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Conectado à Nuvem</span>
                  </div>
                </div>
              </div>

              {/* Sync Status Box */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  darkMode ? 'bg-purple-950/20 border-purple-900/30' : 'bg-purple-50/50 border-purple-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-purple-400" />
                    Status da Nuvem:
                  </span>
                  <span className="font-semibold text-purple-400">
                    {isSyncing ? 'Sincronizando...' : 'Tudo Atualizado'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Última sincronização:</span>
                  <span className="font-mono text-gray-300">
                    {lastSynced ? lastSynced.toLocaleTimeString('pt-BR') : 'Agora'}
                  </span>
                </div>

                <button
                  onClick={syncToCloudNow}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  Forçar Sincronização Agora
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
            </div>
          ) : (
            /* Logged Out - Auth Forms */
            <div className="space-y-4">
              {/* Google One-Click Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  darkMode
                    ? 'bg-white text-gray-900 hover:bg-gray-100 border-white'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {/* Google SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continuar com o Google</span>
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-gray-700/50"></div>
                <span className="px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  ou com e-mail
                </span>
                <div className="flex-1 border-t border-gray-700/50"></div>
              </div>

              {/* Mode Tabs */}
              <div
                className={`flex p-1 rounded-xl border text-xs font-semibold ${
                  darkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-100 border-gray-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetForm();
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    resetForm();
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'register'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Criar Conta
                </button>
              </div>

              {/* Error & Success Alerts */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {mode === 'register' && (
                  <div>
                    <label className="block text-gray-400 font-medium mb-1">Seu Nome</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Ex: Lucas Silva"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none transition-all ${
                          darkMode
                            ? 'bg-gray-900/60 border-gray-700 focus:border-purple-500 text-gray-100'
                            : 'bg-white border-gray-300 focus:border-purple-500 text-gray-800'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 font-medium mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none transition-all ${
                        darkMode
                          ? 'bg-gray-900/60 border-gray-700 focus:border-purple-500 text-gray-100'
                          : 'bg-white border-gray-300 focus:border-purple-500 text-gray-800'
                      }`}
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-gray-400 font-medium">Senha</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[11px] text-purple-400 hover:underline"
                        >
                          Esqueceu a senha?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`w-full pl-9 pr-10 py-2 rounded-xl border text-xs outline-none transition-all ${
                          darkMode
                            ? 'bg-gray-900/60 border-gray-700 focus:border-purple-500 text-gray-100'
                            : 'bg-white border-gray-300 focus:border-purple-500 text-gray-800'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'forgot' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[11px] text-purple-400 hover:underline"
                    >
                      Voltar para o login
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading
                    ? 'Processando...'
                    : mode === 'login'
                    ? 'Entrar no Obnotion'
                    : mode === 'register'
                    ? 'Criar Minha Conta'
                    : 'Enviar E-mail de Recuperação'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
