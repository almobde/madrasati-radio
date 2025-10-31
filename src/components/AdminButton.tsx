import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminButton = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
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

  const handleClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/auth');
    }
  };

  // إخفاء الزر للمستخدمين العاديين إذا لم يكونوا مسؤولين
  if (isAdmin === false) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
      title={isAdmin ? "لوحة التحكم" : "دخول الإدارة"}
    >
      <Shield className="w-4 h-4 text-primary group-hover:text-primary-dark transition-colors" />
    </button>
  );
};

export default AdminButton;
