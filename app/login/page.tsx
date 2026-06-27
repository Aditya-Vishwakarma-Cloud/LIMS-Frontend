"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, AlertCircle, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Microscope } from 'lucide-react';
import { authService } from '@/services/auth.service';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').nonempty('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
      await authService.login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
      setServerError(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-[100px] pointer-events-none"></div>

      {/* Optional watermark - using Lucide Microscope scaled up */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Microscope className="w-96 h-96 text-blue-900" />
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center animate-fade-in-up">

        {/* Branding Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-14 mb-2 flex items-center justify-center">
            {/* Logo image focusing on WM monogram */}
            <img src="/wemore-logo-official.png" alt="WeMurz Logo" className="h-20 object-cover object-left max-w-none transform -translate-y-1" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">WeMurz</h1>

          <div className="flex items-center gap-4 w-full mt-3 mb-2">
            <div className="h-px bg-blue-200 flex-1"></div>
            <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">LIMS</span>
            <div className="h-px bg-blue-200 flex-1"></div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Laboratory Information Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full p-8 md:p-10 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Sign in to your account</h2>
            <p className="text-sm text-slate-500">Enter your credentials to access WeMurz LIMS</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700 text-sm mb-6 shadow-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
              <span className="font-medium">{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 bg-white border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-600 hover:border-slate-300'
                    } rounded-xl focus:outline-none focus:ring-2 focus:border-transparent placeholder-slate-400 text-sm text-slate-900 transition-all duration-200`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={`w-full pl-10 pr-12 py-3 bg-white border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-600 hover:border-slate-300'
                    } rounded-xl focus:outline-none focus:ring-2 focus:border-transparent placeholder-slate-400 text-sm text-slate-900 transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => alert("Please contact your administrator to reset or update your password.")}
                className="text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1b5df1] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Signing in...</span>
                </>
              ) : (
                <>
                  <span className="text-sm tracking-wide">Login to LIMS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div> */}

          {/* <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure. Reliable. Results you can trust.</span>
          </div> */}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 w-full text-center z-10 pointer-events-none">
        <p className="text-[11px] md:text-xs text-slate-400 font-medium">
          ©2025 WeMurz Services LLP. All rights reserved.
        </p>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
