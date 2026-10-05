import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { Logo } from '../../components/layout/Logo';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Campo obrigatório', 'Por favor, digite seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
      success('Instruções enviadas', 'Verifique sua caixa de entrada para redefinir sua senha.');
    } catch {
      error('Erro ao enviar', 'Não foi possível processar a recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white sm:bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white sm:border sm:border-slate-200/80 sm:shadow-xl sm:rounded-3xl p-6 sm:p-10 animate-in fade-in duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="lg" variant="vertical" showTagline={true} />
          <h1 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
            Recupere sua senha
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Informe seu e-mail cadastrado para receber as instruções de recuperação
          </p>
        </div>

        {sent ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-emerald-900">E-mail enviado!</h3>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              Enviamos um link de redefinição para <strong>{email}</strong>. Siga as instruções para criar uma nova senha.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#0B5FFF] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar para o login
            </Link>
          </div>
        ) : (
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
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#0B5FFF] text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B5FFF] hover:bg-[#094ecc] text-white text-sm font-semibold shadow-xs transition-all active:scale-98 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Enviar instruções</span>
              )}
            </button>

            <div className="pt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
