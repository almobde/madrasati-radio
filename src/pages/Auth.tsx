import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Home } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // إذا كان المستخدم مسجل دخول، انتقل للصفحة الرئيسية
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });

    // الاستماع لتغيرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = authSchema.parse({ email, password });
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'خطأ في تسجيل الدخول',
            description: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'خطأ',
            description: error.message,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'خطأ في البيانات',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ModernButton 
          variant="glass" 
          size="sm" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <Home className="w-4 h-4 ml-2" />
          العودة للصفحة الرئيسية
        </ModernButton>
        
        <ModernCard className="w-full p-8">
        <div className="text-center mb-6">
          <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            لوحة التحكم - الإدارة
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-body font-semibold text-foreground mb-2">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              className="font-body"
            />
          </div>

          <div>
            <label className="block text-sm font-body font-semibold text-foreground mb-2">
              كلمة المرور
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="font-body"
            />
          </div>

          <ModernButton
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </ModernButton>
        </form>
      </ModernCard>
      </div>
    </div>
  );
};

export default Auth;
