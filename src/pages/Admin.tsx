import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Trash2, Check, X, MessageCircle, Radio, Home, Edit, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  gender: string;
  education_level: string;
  content: any;
  created_at: string;
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
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
      .select('*')
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

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setEditTitle(topic.title);
    setEditCategory(topic.category);
  };

  const handleSaveEdit = async () => {
    if (!editingTopic) return;

    const { error } = await supabase
      .from('custom_topics')
      .update({ 
        title: editTitle,
        category: editCategory
      })
      .eq('id', editingTopic.id);

    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الموضوع',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الموضوع بنجاح',
      });
      setEditingTopic(null);
      fetchTopics();
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

  const approvedTestimonials = testimonials.filter(t => t.approved).length;
  const pendingTestimonials = testimonials.filter(t => !t.approved).length;

  // تصفية المواضيع
  const filteredTopics = topics.filter(topic => {
    if (selectedGender !== 'all' && topic.gender !== selectedGender) return false;
    if (selectedLevel !== 'all' && topic.education_level !== selectedLevel) return false;
    return true;
  });

  const genderText = (gender: string) => gender === 'boys' ? 'بنين' : 'بنات';
  const levelText = (level: string) => 
    level === 'primary' ? 'ابتدائي' : 
    level === 'middle' ? 'متوسط' : 'ثانوي';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-heading font-bold text-white">لوحة التحكم</h1>
          <div className="flex gap-2">
            <ModernButton onClick={() => navigate('/')} variant="glass" size="sm">
              <Home className="w-4 h-4 ml-2" />
              الصفحة الرئيسية
            </ModernButton>
            <ModernButton onClick={handleLogout} variant="glass" size="sm">
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </ModernButton>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ModernCard className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{testimonials.length}</div>
            <div className="text-sm text-muted-foreground font-body">إجمالي الآراء</div>
          </ModernCard>
          <ModernCard className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{approvedTestimonials}</div>
            <div className="text-sm text-muted-foreground font-body">آراء معتمدة</div>
          </ModernCard>
          <ModernCard className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{pendingTestimonials}</div>
            <div className="text-sm text-muted-foreground font-body">قيد المراجعة</div>
          </ModernCard>
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
            {/* فلاتر التصفية */}
            <ModernCard className="p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">تصفية المواضيع</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-body mb-2 block">نوع المدرسة</Label>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger className="font-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="boys">بنين</SelectItem>
                      <SelectItem value="girls">بنات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body mb-2 block">المرحلة الدراسية</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="font-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="primary">ابتدائي</SelectItem>
                      <SelectItem value="middle">متوسط</SelectItem>
                      <SelectItem value="secondary">ثانوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-body mt-3">
                عرض {filteredTopics.length} من {topics.length} موضوع
              </p>
            </ModernCard>

            {/* قائمة المواضيع المفلترة */}
            {filteredTopics.map((topic) => (
              <ModernCard key={topic.id} className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-foreground mb-1">
                        {topic.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground font-body">
                        <span>{topic.category}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-primary/10 rounded">
                          {genderText(topic.gender)}
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-primary/10 rounded">
                          {levelText(topic.education_level)}
                        </span>
                        <span>•</span>
                        <span>{new Date(topic.created_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <ModernButton
                      size="sm"
                      variant="glass"
                      onClick={() => handleEditTopic(topic)}
                    >
                      <Edit className="w-4 h-4 ml-1" />
                      تعديل
                    </ModernButton>
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
                </div>
              </ModernCard>
            ))}
            
            {filteredTopics.length === 0 && (
              <p className="text-center text-white/70 font-body py-8">
                {topics.length === 0 ? 'لا توجد مواضيع بعد' : 'لا توجد مواضيع تطابق الفلاتر المحددة'}
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog للتعديل */}
        <Dialog open={!!editingTopic} onOpenChange={(open) => !open && setEditingTopic(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-heading">تعديل الموضوع</DialogTitle>
              <DialogDescription className="font-body">
                قم بتعديل عنوان أو تصنيف الموضوع
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title" className="font-body mb-2 block">
                  عنوان الموضوع
                </Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-body"
                  placeholder="أدخل عنوان الموضوع"
                />
              </div>
              <div>
                <Label htmlFor="edit-category" className="font-body mb-2 block">
                  التصنيف
                </Label>
                <Input
                  id="edit-category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="font-body"
                  placeholder="أدخل تصنيف الموضوع"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <ModernButton
                variant="glass"
                onClick={() => setEditingTopic(null)}
              >
                إلغاء
              </ModernButton>
              <ModernButton
                onClick={handleSaveEdit}
                disabled={!editTitle.trim() || !editCategory.trim()}
              >
                حفظ التعديلات
              </ModernButton>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
