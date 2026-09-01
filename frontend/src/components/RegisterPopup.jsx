import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiLock, FiMail, FiUser } from 'react-icons/fi';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';
import { getDeviceFingerprint } from '../utils/deviceFingerprint';

const RegisterPopup = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStage, setAuthStage] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deviceFingerprint, setDeviceFingerprint] = useState('');

  useEffect(() => {
    getDeviceFingerprint().then(fp => setDeviceFingerprint(fp));
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthStage('connecting');
    setError('');
    setSuccessMsg('');

    try {
      const abortCtrl = new AbortController();
      const isReady = await ensureBackendReady(setAuthStage, abortCtrl.signal);
      if (!isReady) {
        setError('HRCV server is taking longer than expected. Please try again.');
        return;
      }

      setAuthStage('signing-in');
      if (mode === 'register') {
        const response = await api.post(`/auth/register`, {
          email,
          name,
          password,
          device_fingerprint: 'web-fingerprint-' + email,
          phone: null,
          updates_enabled: true
        });

        const data = response.data;
        localStorage.setItem('hrcv_token', data.access_token);
        localStorage.setItem('hrcv_user', JSON.stringify(data.user));
        localStorage.setItem('tonycv_token', data.access_token);
        localStorage.setItem('tonycv_user', JSON.stringify(data.user));
        setSuccessMsg('Account registered successfully!');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(data.user);
          onClose();
        }, 1200);
      } else {
        const response = await api.post(`/auth/login`, {
          email,
          password,
          device_fingerprint: 'web-fingerprint-' + email
        });

        const data = response.data;
        localStorage.setItem('hrcv_token', data.access_token);
        localStorage.setItem('hrcv_user', JSON.stringify(data.user));
        localStorage.setItem('tonycv_token', data.access_token);
        localStorage.setItem('tonycv_user', JSON.stringify(data.user));
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(data.user);
          onClose();
        }, 1200);
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'CanceledError') return;
      setError(err.response?.data?.detail || classifyError(err));
    } finally {
      setLoading(false);
      setAuthStage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in flex items-center justify-center p-4">
      <div className="relative w-full max-w-md p-8 glass-card-glow my-auto border border-white/10 shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-sm font-bold"
        >
          <FiX size={16} />
        </button>

        <div className="text-center space-y-2 mb-6">
          <span className="badge-luxury">Security Portal</span>
          <h3 className="text-2xl font-black font-heading text-white tracking-tight">
            {mode === 'register' ? 'Create Executive Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'register' ? 'Sign up to track neural resume history & telemetry' : 'Access your candidate intelligence dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-pulse">
            <FiCheck size={14} /> {successMsg}
          </div>
        )}

        {/* Google sign-in confirm button */}
        <div className="mb-4 space-y-4">
          <button
            type="button"
            onClick={async () => {
              setError('');
              try {
                if (!window.google) {
                  throw new Error("Google API script not loaded. Please refresh the page.");
                }
                window.google.accounts.id.initialize({
                  client_id: '132721264540-a2794sbnqvens788p1tqe26asn0q1i9r.apps.googleusercontent.com',
                  callback: async (response) => {
                    setLoading(true);
                    setAuthStage('connecting');
                    setError('');
                    try {
                      if (!response.credential) {
                        throw new Error('Google verification cancelled.');
                      }
                      const base64Url = response.credential.split('.')[1];
                      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                      const payload = JSON.parse(window.atob(base64));

                      setEmail(payload.email || '');
                      setName(payload.name || '');

                      const abortCtrl = new AbortController();
                      const isReady = await ensureBackendReady(setAuthStage, abortCtrl.signal);
                      if (!isReady) {
                        throw new Error('HRCV server is taking longer than expected. Please try again.');
                      }

                      setAuthStage('signing-in');
                      const fpToUse = deviceFingerprint || ('fp-' + payload.email);
                      const authRes = await api.post(`/auth/google`, {
                        google_id_token: response.credential,
                        name: payload.name || payload.email.split('@')[0],
                        email: payload.email,
                        google_id: payload.sub,
                        device_fingerprint: fpToUse
                      });

                      const data = authRes.data;
                      localStorage.setItem('hrcv_token', data.access_token);
                      localStorage.setItem('hrcv_user', JSON.stringify(data.user));
                      localStorage.setItem('tonycv_token', data.access_token);
                      localStorage.setItem('tonycv_user', JSON.stringify(data.user));
                      setSuccessMsg('Verified with Google successfully!');
                      setTimeout(() => {
                        if (onAuthSuccess) onAuthSuccess(data.user);
                        onClose();
                      }, 1200);
                    } catch (innerErr) {
                      setError(innerErr.response?.data?.detail || classifyError(innerErr) || innerErr.message || 'Google verification failed.');
                      setLoading(false);
                      setAuthStage(null);
                    }
                  }
                });
                window.google.accounts.id.prompt();
              } catch (err) {
                setError(err.message || 'Google verification failed.');
              }
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 border border-white/10 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Or credentials</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Rivera" 
                className="input-luxury text-xs !py-2.5"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@domain.com" 
              className="input-luxury text-xs !py-2.5"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="input-luxury text-xs !py-2.5"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-luxury-primary w-full !py-3 !text-sm mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                {authStage === 'connecting' ? 'Connecting…' : 'Authenticating…'}
              </span>
            ) : mode === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {mode === 'register' ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-indigo-400 hover:text-indigo-300 font-bold underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-indigo-400 hover:text-indigo-300 font-bold underline">
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPopup;
