import { useState } from 'react';
import {
  Building2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { APP_NAME, APP_FULL_NAME } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export default function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Nenosiri halilingani');
      return;
    }
    if (password.length < 6) {
      setError('Nenosiri lazima liwe na herufi 6 zaidi');
      return;
    }
    if (!consent) {
      setError('Lazima ukubali mkusanyiko wa taarifa zako');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      setError(
        error === 'User already registered'
          ? 'Mtumiaji tayari amesajiliwa na barua pepe hii'
          : error
      );
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-ccm-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-ccm-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Usajili Umekamilika!</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Akaunti yako imeundwa. Msimamizi atakupa jukumu na chuo chako. Baada ya hapo
              utaweza kuingia kwenye mfumo.
            </p>
            <button
              onClick={onSwitchToLogin}
              className="btn-primary w-full mt-6 py-3"
            >
              Endelea kuingia
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="ccm-logo w-12 h-12 text-xl">
            <Building2 size={26} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{APP_NAME}</p>
            <p className="text-xs text-gray-500">{APP_FULL_NAME}</p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <button
            onClick={onSwitchToLogin}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft size={16} /> Rudi kwenye kuingia
          </button>

          <h2 className="text-xl font-bold text-gray-900">Jisajili</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Unda akaunti yako kwa ajili ya mfumo wa usimamizi
          </p>

          {error && (
            <div className="mb-4 p-3 bg-error-50 border border-error-100 rounded-lg flex items-start gap-2.5">
              <AlertCircle size={18} className="text-error-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Jina Kamili</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Mfano: Juma Hamisi"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

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
              <label className="input-label">Nenosiri</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Angalau herufi 6"
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

            <div>
              <label className="input-label">Thibitisha Nenosiri</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ingiza tena nenosiri"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Consent */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-ccm-green-600 focus:ring-ccm-green-500"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Nakubali kukusanywa kwa taarifa zangu binafsi (jina, barua pepe) kwa
                  madhumuni ya usimamizi wa CCM Mkoa wa Iringa. Naelewa taarifa hizi
                  zitatumika kwa ajili ya kiutawala tu na zinazingatia sheria za ulinzi
                  wa data Tanzania.
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Jisajili Sasa'
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 p-4 bg-ccm-green-50 rounded-lg border border-ccm-green-100">
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-ccm-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-ccm-green-700 leading-relaxed">
              Baada ya usajili, msimamizi atakupa jukumu na chuo chako kabla ya kutumia
              mfumo. Hii inahakikisha usalama wa data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
