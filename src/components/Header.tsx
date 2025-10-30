// هيدر الموقع الأنيق - Elegant Site Header
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Search, User, Shield } from 'lucide-react';
import { ModernButton } from './ui/modern-button';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

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

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* شريط علوي للمعلومات */}
        <div className="bg-radio-dark text-white text-center py-2 text-sm font-body">
          📻 الإذاعة المدرسية التفاعلية - منصة تعليمية شاملة للطلاب
        </div>
        
        {/* الهيدر الرئيسي */}
        <div className="flex items-center justify-between h-16">
          
          {/* الشعار والعنوان */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-radio-gold to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-radio-dark">الإذاعة المدرسية</h1>
              <p className="text-xs text-gray-500 font-body">منصة تعليمية متقدمة</p>
            </div>
          </div>
          
          {/* القائمة الوسطى */}
          <nav className="hidden md:flex items-center space-x-reverse space-x-8 font-body">
            <a href="#" className="text-gray-700 hover:text-radio-gold transition-colors duration-200 font-medium">
              جميع المواضيع
            </a>
            <a href="#" className="text-gray-700 hover:text-radio-gold transition-colors duration-200 font-medium">
              مواضيع راقية
            </a>
            <a href="#" className="text-gray-700 hover:text-radio-gold transition-colors duration-200 font-medium">
              فساتين طويلة
            </a>
            <a href="#" className="text-gray-700 hover:text-radio-gold transition-colors duration-200 font-medium">
              مجسمات
            </a>
            <a href="#" className="text-gray-700 hover:text-radio-gold transition-colors duration-200 font-medium">
              حقائب
            </a>
          </nav>
          
          {/* أدوات المستخدم */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-radio-gold transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
            {isAdmin && (
              <ModernButton 
                variant="premium" 
                size="sm" 
                onClick={() => navigate('/admin')}
                className="hidden sm:flex"
              >
                <Shield className="w-4 h-4 ml-2" />
                لوحة التحكم
              </ModernButton>
            )}
            <ModernButton 
              variant="glass" 
              size="sm" 
              className="hidden sm:flex"
              onClick={() => navigate('/auth')}
            >
              <User className="w-4 h-4 ml-2" />
              تسجيل الدخول
            </ModernButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;