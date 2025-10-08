import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let error = null;

    if (isLogin) {
      const result = await signIn(email, password);
      error = result.error;
    } else {
      const result = await signUp(email, password);
      error = result.error;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isLogin ? 'تم تسجيل الدخول بنجاح!' : 'تم إنشاء الحساب بنجاح!');
      navigate('/dashboard'); // Redirect to dashboard after successful auth
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول.' : 'أدخل بريدك الإلكتروني وكلمة المرور لإنشاء حساب جديد.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="p-0 h-auto">
              {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;