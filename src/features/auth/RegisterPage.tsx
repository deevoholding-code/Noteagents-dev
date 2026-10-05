import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import { Logo } from '../../components/layout/Logo';
import { User, Mail, Lock, ArrowRight, Github, Chrome, Loader2, AtSign } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password) {
      error('Campos incompletos', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      error('Senhas não coincidem', 'Verifique a confirmação de senha.');
      return;
    }
    if (!termsAccepted) {
      error('Termos obrigatórios', 'Você deve aceitar os Termos de Uso para criar uma conta.');
      return;
    }

    setLoading(true);
    try {
      await register({ fullName, username, email, password });
      success('Conta criada com sucesso!', 'Bem-vindo à comunidade NoteAgents.');
      navigate('/dashboard');
    } catch {
      error('Erro ao cadastrar', 'Ocorreu uma falha no registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white sm:bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white sm:border sm:border-slate-200/80 sm:shadow-xl sm:rounded-3xl p-6 sm:p-10 animate-in fade-in duration-200 my-8">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="lg" variant="vertical" showTagline={true} />
          <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
            Crie sua conta
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Junte-se a milhares de desenvolvedores no ecossistema NoteAgents
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome completo
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Lucas Almeida"
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#0B5FFF] text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome de usuário
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <AtSign className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="lucasalmeida"
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#0B5FFF] text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                placeholder="lucas@exemplo.com"
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#0B5FFF] text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Senha
            </label>
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
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#0B5FFF] text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirmar senha
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#0B5FFF] text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#0B5FFF] border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-600 leading-tight">
                Aceito os{' '}
                <a href="#termos" onClick={(e) => e.preventDefault()} className="font-semibold text-[#0B5FFF] hover:underline">
                  Termos de Uso
                </a>{' '}
                e a{' '}
                <a href="#privacidade" onClick={(e) => e.preventDefault()} className="font-semibold text-[#0B5FFF] hover:underline">
                  Política de Privacidade
                </a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0B5FFF] hover:bg-[#094ecc] text-white text-sm font-semibold shadow-xs transition-all active:scale-98 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Criar conta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-bold text-[#0B5FFF] hover:text-[#094ecc] transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};
