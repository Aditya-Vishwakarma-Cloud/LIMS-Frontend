"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Microscope, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').nonempty('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      console.log('Attempting login with:', data.email);
      await authService.login(data.email, data.password);
      console.log('Login successful, redirecting to dashboard');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error full object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      console.error('Login error response data:', err.response?.data);
      console.error('Login error response status:', err.response?.status);
      console.error('Login error response headers:', err.response?.headers);
      console.error('Login error request:', err.request);
      
      const errMsg = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
      setServerError(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/20 blur-3xl"></div>
      
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-2xl p-8 w-full max-w-md relative z-10 transition-all duration-300 rounded-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform duration-300">
            <Microscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">NBL ENGINEERING SERVICES</h1>
          <p className="text-xs text-indigo-600 font-bold tracking-widest mt-1 uppercase">Lims Quality Testing</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700 text-sm mb-6 animate-fade-in shadow-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
            <span className="font-medium">{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={`w-full px-4 py-3 bg-white border ${
                errors.email ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
              } rounded-xl focus:outline-none focus:ring-2 focus:border-transparent placeholder-slate-400 text-sm text-slate-900 transition-all duration-200 shadow-sm`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-4 py-3 bg-white border ${
                errors.password ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
              } rounded-xl focus:outline-none focus:ring-2 focus:border-transparent placeholder-slate-400 text-sm text-slate-900 transition-all duration-200 shadow-sm`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>LOGGING IN...</span>
              </>
            ) : (
              'LOGIN TO PORTAL'
            )}
          </button>
        </form>

        <div className="text-center mt-8 space-y-4">
          <div>
            <span className="text-slate-500 text-sm font-medium">Registration is managed by administrators.</span>
          </div>
          <div>
            <button
              type="button"
              onClick={() => alert("Please contact your administrator to reset or update your password.")}
              className="text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
