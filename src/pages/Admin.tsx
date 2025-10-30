import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Trash2, Check, X, MessageCircle, Radio } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string | null;
  content: string;
  approved: boolean;
  created_at: string;
}

interface Topic {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roleData?.role === 'admin') {
        setIsAdmin(true);
        fetchTestimonials();
        fetchTopics();
      } else {
        toast({
          title: 'غير مصرح',
          description: 'ليس لديك صلاحية الوصول',
          variant: 'destructive',
        });
        navigate('/');
      }
    } catch (error) {
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTestimonials(data);
  };

  const fetchTopics = async () => {
    const { data } = await supabase
      .from('custom_topics')
      .select('id, title, category, created_at')
      .order('created_at', { ascending: false });
    
    if (data) setTopics(data);
  };

  const handleApproveTestimonial = async (id: string, approved: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ approved })
      .eq('id', id);

    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الرأي',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم التحديث',
        description: approved ? 'تم اعتماد الرأي' : 'تم إلغاء اعتماد الرأي',
      });
      fetchTestimonials();
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرأي؟')) return;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف الرأي',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الرأي بنجاح',
      });
      fetchTestimonials();
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموضوع؟')) return;

    const { error } = await supabase
      .from('custom_topics')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف الموضوع',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الموضوع بنجاح',
      });
      fetchTopics();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center">
        <p className="text-white font-body">جاري التحميل...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-white">لوحة التحكم</h1>
          <ModernButton onClick={handleLogout} variant="glass">
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </ModernButton>
        </div>

        <Tabs defaultValue="testimonials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="testimonials" className="font-body">
              <MessageCircle className="w-4 h-4 ml-2" />
              الآراء ({testimonials.length})
            </TabsTrigger>
            <TabsTrigger value="topics" className="font-body">
              <Radio className="w-4 h-4 ml-2" />
              المواضيع ({topics.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="testimonials" className="space-y-4">
            {testimonials.map((testimonial) => (
              <ModernCard key={testimonial.id} className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-body font-semibold text-foreground">
                        {testimonial.name || 'زائر'}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        {new Date(testimonial.created_at).toLocaleString('ar-SA')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-body ${
                      testimonial.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {testimonial.approved ? 'معتمد' : 'قيد المراجعة'}
                    </span>
                  </div>
                  
                  <p className="font-body text-foreground">{testimonial.content}</p>
                  
                  <div className="flex gap-2">
                    {!testimonial.approved && (
                      <ModernButton
                        size="sm"
                        onClick={() => handleApproveTestimonial(testimonial.id, true)}
                      >
                        <Check className="w-4 h-4 ml-1" />
                        اعتماد
                      </ModernButton>
                    )}
                    {testimonial.approved && (
                      <ModernButton
                        size="sm"
                        variant="glass"
                        onClick={() => handleApproveTestimonial(testimonial.id, false)}
                      >
                        <X className="w-4 h-4 ml-1" />
                        إلغاء الاعتماد
                      </ModernButton>
                    )}
                    <ModernButton
                      size="sm"
                      variant="neon"
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 ml-1" />
                      حذف
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            ))}
            
            {testimonials.length === 0 && (
              <p className="text-center text-white/70 font-body py-8">
                لا توجد آراء بعد
              </p>
            )}
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            {topics.map((topic) => (
              <ModernCard key={topic.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-foreground mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      {topic.category} • {new Date(topic.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <ModernButton
                    size="sm"
                    variant="neon"
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف
                  </ModernButton>
                </div>
              </ModernCard>
            ))}
            
            {topics.length === 0 && (
              <p className="text-center text-white/70 font-body py-8">
                لا توجد مواضيع بعد
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
