import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import { Logo } from '../../components/layout/Logo';
import { Mail, Lock, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('lucas.almeida@noteagents.dev');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Campo obrigatório', 'Por favor, informe seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password, rememberMe });
      success('Autenticado com sucesso', 'Bem-vindo de volta ao NoteAgents!');
      navigate('/dashboard');
    } catch (err) {
      error('Falha no login', 'Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'GitHub' | 'Google') => {
    setLoading(true);
    try {
      await login({
        email: provider === 'GitHub' ? 'lucasalmeida@github.com' : 'lucas.almeida@gmail.com',
        rememberMe: true,
      });
      success(`Login com ${provider} bem-sucedido`, 'Conectado via autenticação federada.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white sm:bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white sm:border sm:border-slate-200/80 sm:shadow-xl sm:rounded-3xl p-6 sm:p-10 animate-in fade-in duration-200">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="lg" variant="vertical" showTagline={true} />
          <h1 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
            Bem-vindo de volta
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Acesse o ecossistema de agentes e engenharia colaborativa
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#0B5FFF] transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Senha
              </label>
              <Link
                to="/recuperar-senha"
                className="text-xs font-semibold text-[#0B5FFF] hover:text-[#094ecc] transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#0B5FFF] transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#0B5FFF] border-slate-300 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="text-xs text-slate-600">Lembrar-me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B5FFF] hover:bg-[#094ecc] text-white text-sm font-semibold shadow-xs transition-all active:scale-98 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Social Authentication */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider shrink-0">
              ou continue com
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300"
            >
              <Github className="w-4 h-4 text-slate-900" />
              <span>GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300"
            >
              <Chrome className="w-4 h-4 text-[#EA4335]" />
              <span>Google</span>
            </button>
          </div>
        </div>

        {/* Footer Link to Register */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Ainda não tem conta?{' '}
          <Link
            to="/cadastro"
            className="font-bold text-[#0B5FFF] hover:text-[#094ecc] transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
};
