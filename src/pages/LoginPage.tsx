import { useState } from 'react';
import { Building2, Lock, Mail, Eye, EyeOff, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { APP_NAME, APP_FULL_NAME, APP_REGION } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

export default function LoginPage({ onSwitchToSignup }: LoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error === 'Invalid login credentials'
        ? 'Barua pepe au nenosiri si sahihi'
        : error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-ccm-green-800 via-ccm-green-700 to-ccm-green-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-ccm-gold-400 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Building2 size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold">{APP_NAME}</p>
              <p className="text-sm text-ccm-green-100">{APP_FULL_NAME}</p>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-balance">
              Mfumo wa Usimamizi wa Wanachama wa CCM
            </h1>
            <p className="mt-4 text-lg text-ccm-green-100">
              {APP_REGION} — Jukwaa la kisasa la usimamizi wa vyuo, wanachama, matukio na riporti.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Usimamizi wa vyuo na wanachama',
                'Majukumu ya kipekee na ruhusa madhubuti',
                'Riporti na kumbukumbu za ukaguzi',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-ccm-gold-400/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={14} className="text-ccm-gold-300" />
                  </div>
                  <span className="text-sm text-ccm-green-50">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-ccm-green-200">
            © 2026 CCM Mkoa wa Iringa. Haki zote zimehifadhiwa.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="ccm-logo w-12 h-12 text-xl">
              <Building2 size={26} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{APP_NAME}</p>
              <p className="text-xs text-gray-500">{APP_FULL_NAME}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Karibu Tena</h2>
          <p className="text-sm text-gray-500 mt-1.5 mb-8">
            Ingia taarifa zako kufikia mfumo wa usimamizi
          </p>

          {error && (
            <div className="mb-4 p-3 bg-error-50 border border-error-100 rounded-lg flex items-start gap-2.5">
              <AlertCircle size={18} className="text-error-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Barua Pepe</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jina@ccmiringa.go.tz"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label mb-0">Nenosiri</label>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingiza nenosiri"
                  className="input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Ingia Mfumoni'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Huna akaunti?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-ccm-green-600 hover:text-ccm-green-700 font-medium"
            >
              Jisajili hapa
            </button>
          </p>

          <div className="mt-8 p-4 bg-ccm-green-50 rounded-lg border border-ccm-green-100">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-ccm-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ccm-green-700 leading-relaxed">
                Taarifa zako binafsi zinahifadhiwa kwa usalama na zinatumiwa kwa madhumuni ya
                kiutawala tu, kwa kufuata sheria za ulinzi wa data Tanzania.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
