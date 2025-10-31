// هيدر الموقع الأنيق - Elegant Site Header
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppContext } from '@/context/AppContext';
import logo from '@/assets/logo.png';

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { setPreferences, preferences } = useAppContext();

  useEffect(() => {
    checkAdminStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setIsAdmin(false);
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    setIsAdmin(roleData?.role === 'admin');
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* الشعار والاسم في الزاوية اليسرى */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              setPreferences(null);
              navigate('/');
            }}
          >
            <img 
              src={logo} 
              alt="شعار الإذاعة المدرسية" 
              className="w-10 h-10 object-contain"
            />
            <span className={`font-arabic text-xl font-semibold ${
              !preferences 
                ? 'text-primary' 
                : preferences.gender === 'girls' 
                  ? 'text-[hsl(330,70%,40%)]' 
                  : 'text-[hsl(220,70%,35%)]'
            }`}>
              إذاعتنا
            </span>
          </div>
          
          {/* زر الإدارة في الزاوية اليمنى */}
          <button
            onClick={handleAdminClick}
            className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
            title={isAdmin ? "لوحة التحكم" : "تسجيل الدخول"}
          >
            <Shield className="w-4 h-4 text-primary group-hover:text-primary-dark transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;