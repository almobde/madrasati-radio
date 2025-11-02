import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Trash2, Radio, Home, Edit, Filter, Image as ImageIcon, ExternalLink, ToggleLeft, ToggleRight, ChevronUp, ChevronDown, AlertCircle, CheckCircle, Eye, UserPlus, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface Topic {
  id: string;
  title: string;
  category: string;
  gender: string;
  education_level: string;
  content: any;
  created_at: string;
  display_order: number;
}

interface Banner {
  id: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  created_at: string;
}

interface TopicReport {
  id: string;
  topic_id: string;
  user_id: string | null;
  report_type: 'delete' | 'edit' | 'add';
  note_text: string;
  created_at: string;
  is_resolved: boolean;
  custom_topics?: {
    title: string;
  };
}

interface Admin {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  user_email?: string;
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [bannerLink, setBannerLink] = useState('');
  const [isBannerActive, setIsBannerActive] = useState(true);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [reports, setReports] = useState<TopicReport[]>([]);
  const [reportFilter, setReportFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('all');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // Setup realtime subscription for reports
    const channel = supabase
      .channel('topic_reports_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'topic_reports'
        },
        (payload) => {
          console.log('New report received:', payload);
          toast({
            title: '🔔 ملاحظة جديدة',
            description: 'تم إضافة ملاحظة جديدة على موضوع',
          });
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

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
        fetchTopics();
        fetchBanner();
        fetchReports();
        fetchAdmins();
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

  const fetchTopics = async () => {
    const { data } = await supabase
      .from('custom_topics')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data) setTopics(data);
  };

  const fetchBanner = async () => {
    const { data } = await supabase
      .from('advertisement_banner')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (data) {
      setBanner(data);
      setBannerLink(data.link_url);
      setIsBannerActive(data.is_active);
      setBannerPreview(data.image_url);
    }
  };

  const fetchReports = async () => {
    const { data } = await supabase
      .from('topic_reports')
      .select(`
        *,
        custom_topics (
          title
        )
      `)
      .order('created_at', { ascending: false });
    
    if (data) setReports(data as TopicReport[]);
  };

  const fetchAdmins = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });
    
    if (data) {
      setAdmins(data as Admin[]);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال بريد إلكتروني صحيح',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingAdmin(true);

    try {
      // البحث عن المستخدم بالبريد الإلكتروني
      const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers();
      
      if (searchError) throw searchError;

      const user = users?.find((u: any) => u.email === newAdminEmail);

      if (!user) {
        toast({
          title: 'خطأ',
          description: 'لم يتم العثور على مستخدم بهذا البريد الإلكتروني',
          variant: 'destructive',
        });
        setIsAddingAdmin(false);
        return;
      }

      // التحقق من أنه ليس مسؤولاً بالفعل
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (existingRole) {
        toast({
          title: 'تنبيه',
          description: 'هذا المستخدم مسؤول بالفعل',
        });
        setIsAddingAdmin(false);
        return;
      }

      // إضافة دور المسؤول مع البريد الإلكتروني
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin',
          user_email: user.email
        });

      if (insertError) throw insertError;

      toast({
        title: 'تم بنجاح',
        description: 'تم إضافة المسؤول الجديد',
      });

      setNewAdminEmail('');
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة المسؤول',
        variant: 'destructive',
      });
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string, userId: string) => {
    // التحقق من عدم حذف آخر مسؤول
    if (admins.length <= 1) {
      toast({
        title: 'تحذير',
        description: 'لا يمكن حذف آخر مسؤول في النظام',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm('هل أنت متأكد من إزالة صلاحيات المسؤول لهذا المستخدم؟')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: 'تم بنجاح',
        description: 'تم إزالة صلاحيات المسؤول',
      });

      fetchAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إزالة المسؤول',
        variant: 'destructive',
      });
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP',
        variant: 'destructive',
      });
      return;
    }

    // التحقق من حجم الملف (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'خطأ',
        description: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت',
        variant: 'destructive',
      });
      return;
    }

    setBannerImage(file);
    
    // معاينة الصورة
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBanner = async () => {
    if (!bannerLink) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال رابط البنر',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingBanner(true);

    try {
      let imageUrl = banner?.image_url || '';

      // رفع صورة جديدة إذا تم اختيارها
      if (bannerImage) {
        const fileExt = bannerImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('advertisements')
          .upload(filePath, bannerImage);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('advertisements')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;

        // حذف الصورة القديمة إذا كانت موجودة
        if (banner?.image_url) {
          const oldFileName = banner.image_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage
              .from('advertisements')
              .remove([oldFileName]);
          }
        }
      }

      // حفظ أو تحديث البنر في قاعدة البيانات
      if (banner) {
        const { error } = await supabase
          .from('advertisement_banner')
          .update({
            image_url: imageUrl,
            link_url: bannerLink,
            is_active: isBannerActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', banner.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('advertisement_banner')
          .insert({
            image_url: imageUrl,
            link_url: bannerLink,
            is_active: isBannerActive
          });

        if (error) throw error;
      }

      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ البنر الإعلاني بنجاح',
      });

      setBannerImage(null);
      fetchBanner();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ البنر',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!banner) return;
    if (!confirm('هل أنت متأكد من حذف البنر الإعلاني؟')) return;

    try {
      // حذف الصورة من التخزين
      const fileName = banner.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('advertisements')
          .remove([fileName]);
      }

      // حذف السجل من قاعدة البيانات
      const { error } = await supabase
        .from('advertisement_banner')
        .delete()
        .eq('id', banner.id);

      if (error) throw error;

      toast({
        title: 'تم الحذف',
        description: 'تم حذف البنر الإعلاني بنجاح',
      });

      setBanner(null);
      setBannerPreview('');
      setBannerLink('');
      setBannerImage(null);
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف البنر',
        variant: 'destructive',
      });
    }
  };

  const handleEditTopic = (topic: Topic) => {
    console.log('✏️ فتح نافذة التعديل للموضوع:', topic.title);
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
    console.log('🗑️ محاولة حذف الموضوع:', id);
    
    if (!confirm('هل أنت متأكد من حذف هذا الموضوع؟')) {
      console.log('❌ تم إلغاء الحذف من قبل المستخدم');
      return;
    }

    try {
      console.log('⏳ جاري حذف الموضوع من قاعدة البيانات...');
      
      const { error } = await supabase
        .from('custom_topics')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ خطأ في حذف الموضوع:', error);
        toast({
          title: 'خطأ',
          description: `حدث خطأ أثناء حذف الموضوع: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        console.log('✅ تم حذف الموضوع بنجاح');
        toast({
          title: 'تم الحذف',
          description: 'تم حذف الموضوع بنجاح',
        });
        fetchTopics();
      }
    } catch (err) {
      console.error('❌ خطأ غير متوقع:', err);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    }
  };

  const handleMoveUp = async (topic: Topic, currentIndex: number) => {
    if (currentIndex === 0) return;

    const previousTopic = filteredTopics[currentIndex - 1];

    const { error: error1 } = await supabase
      .from('custom_topics')
      .update({ display_order: previousTopic.display_order })
      .eq('id', topic.id);

    const { error: error2 } = await supabase
      .from('custom_topics')
      .update({ display_order: topic.display_order })
      .eq('id', previousTopic.id);

    if (error1 || error2) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إعادة الترتيب',
        variant: 'destructive',
      });
    } else {
      fetchTopics();
    }
  };

  const handleMoveDown = async (topic: Topic, currentIndex: number) => {
    if (currentIndex === filteredTopics.length - 1) return;

    const nextTopic = filteredTopics[currentIndex + 1];

    const { error: error1 } = await supabase
      .from('custom_topics')
      .update({ display_order: nextTopic.display_order })
      .eq('id', topic.id);

    const { error: error2 } = await supabase
      .from('custom_topics')
      .update({ display_order: topic.display_order })
      .eq('id', nextTopic.id);

    if (error1 || error2) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إعادة الترتيب',
        variant: 'destructive',
      });
    } else {
      fetchTopics();
    }
  };

  const handleResolveReport = async (reportId: string) => {
    const { error } = await supabase
      .from('topic_reports')
      .update({ is_resolved: true })
      .eq('id', reportId);

    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الملاحظة',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم التحديث',
        description: 'تم وضع علامة "تم الحل" على الملاحظة',
      });
      fetchReports();
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) return;

    const { error } = await supabase
      .from('topic_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف الملاحظة',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الملاحظة بنجاح',
      });
      fetchReports();
    }
  };

  const handleViewTopic = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      window.open(`/?topic=${topicId}`, '_blank');
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

  // تصفية المواضيع
  const filteredTopics = topics.filter(topic => {
    if (selectedGender !== 'all' && topic.gender !== selectedGender) return false;
    if (selectedLevel !== 'all' && topic.education_level !== selectedLevel) return false;
    return true;
  });

  // تصفية التقارير
  const filteredReports = reports.filter(report => {
    if (reportFilter === 'unresolved' && report.is_resolved) return false;
    if (reportFilter === 'resolved' && !report.is_resolved) return false;
    if (reportTypeFilter !== 'all' && report.report_type !== reportTypeFilter) return false;
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

        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="topics" className="font-body">
              <Radio className="w-4 h-4 ml-2" />
              المواضيع ({topics.length})
            </TabsTrigger>
            <TabsTrigger value="reports" className="font-body">
              <AlertCircle className="w-4 h-4 ml-2" />
              الملاحظات ({reports.filter(r => !r.is_resolved).length})
            </TabsTrigger>
            <TabsTrigger value="banner" className="font-body">
              <ImageIcon className="w-4 h-4 ml-2" />
              البنر
            </TabsTrigger>
            <TabsTrigger value="admins" className="font-body">
              <Users className="w-4 h-4 ml-2" />
              المسؤولين ({admins.length})
            </TabsTrigger>
          </TabsList>

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
            {filteredTopics.map((topic, index) => (
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
                  
                  <div className="flex gap-2 flex-wrap">
                    <ModernButton
                      size="sm"
                      variant="glass"
                      onClick={() => handleMoveUp(topic, index)}
                      disabled={index === 0}
                      title="رفع للأعلى"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </ModernButton>
                    <ModernButton
                      size="sm"
                      variant="glass"
                      onClick={() => handleMoveDown(topic, index)}
                      disabled={index === filteredTopics.length - 1}
                      title="خفض للأسفل"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </ModernButton>
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

          <TabsContent value="reports" className="space-y-4">
            {/* فلاتر التقارير */}
            <ModernCard className="p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">تصفية الملاحظات</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-body mb-2 block">الحالة</Label>
                  <Select value={reportFilter} onValueChange={(v: any) => setReportFilter(v)}>
                    <SelectTrigger className="font-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="unresolved">غير محلولة</SelectItem>
                      <SelectItem value="resolved">محلولة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body mb-2 block">نوع الطلب</Label>
                  <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                    <SelectTrigger className="font-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="delete">طلب حذف</SelectItem>
                      <SelectItem value="edit">اقتراح تعديل</SelectItem>
                      <SelectItem value="add">اقتراح إضافة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-body mt-3">
                عرض {filteredReports.length} من {reports.length} ملاحظة
              </p>
            </ModernCard>

            {/* قائمة التقارير */}
            {filteredReports.map((report) => (
              <ModernCard key={report.id} className="p-4">
                <div className="space-y-3">
                  {/* رأس التقرير */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-bold text-foreground">
                          {report.custom_topics?.title || 'موضوع محذوف'}
                        </h3>
                        {report.is_resolved && (
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 ml-1" />
                            تم الحل
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center text-sm mb-2">
                        <Badge variant="outline" className={
                          report.report_type === 'delete' ? 'border-red-500 text-red-500' :
                          report.report_type === 'edit' ? 'border-blue-500 text-blue-500' :
                          'border-green-500 text-green-500'
                        }>
                          {report.report_type === 'delete' ? '🗑️ طلب حذف' :
                           report.report_type === 'edit' ? '✏️ اقتراح تعديل' :
                           '➕ اقتراح إضافة'}
                        </Badge>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString('ar-SA')} - {new Date(report.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* نص الملاحظة */}
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-body whitespace-pre-wrap">
                          {report.note_text}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* أزرار التحكم */}
                  <div className="flex gap-2 flex-wrap pt-2 border-t">
                    <ModernButton
                      size="sm"
                      variant="glass"
                      onClick={() => handleViewTopic(report.topic_id)}
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      عرض الموضوع
                    </ModernButton>

                    {/* زر حذف الموضوع المبلغ عنه */}
                    {report.report_type === 'delete' && (
                      <ModernButton
                        size="sm"
                        variant="neon"
                        onClick={() => handleDeleteTopic(report.topic_id)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Trash2 className="w-4 h-4 ml-1" />
                        حذف الموضوع
                      </ModernButton>
                    )}
                    
                    {!report.is_resolved && (
                      <ModernButton
                        size="sm"
                        variant="glass"
                        onClick={() => handleResolveReport(report.id)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4 ml-1" />
                        تم الحل
                      </ModernButton>
                    )}
                    
                    <ModernButton
                      size="sm"
                      variant="neon"
                      onClick={() => handleDeleteReport(report.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 ml-1" />
                      حذف الملاحظة
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            ))}
            
            {filteredReports.length === 0 && (
              <ModernCard className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground font-body">
                  {reports.length === 0 ? 'لا توجد ملاحظات بعد' : 'لا توجد ملاحظات تطابق الفلاتر المحددة'}
                </p>
              </ModernCard>
            )}
          </TabsContent>

          <TabsContent value="banner" className="space-y-4">
            <ModernCard className="p-6">
              <h3 className="font-heading font-bold text-foreground text-xl mb-4">
                إدارة البنر الإعلاني
              </h3>
              
              {/* معاينة الصورة الحالية */}
              {bannerPreview && (
                <div className="mb-6">
                  <Label className="font-body mb-2 block">معاينة البنر</Label>
                  <div className="relative rounded-lg overflow-hidden border-2 border-border">
                    <img
                      src={bannerPreview}
                      alt="معاينة البنر"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {/* رفع صورة جديدة */}
              <div className="mb-6">
                <Label htmlFor="banner-image" className="font-body mb-2 block">
                  صورة البنر (JPG, PNG, WEBP - حد أقصى 5MB)
                </Label>
                <Input
                  id="banner-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleBannerImageChange}
                  className="font-body"
                />
                <p className="text-xs text-muted-foreground font-body mt-1">
                  اختر صورة جديدة لتحديث البنر الإعلاني
                </p>
              </div>

              {/* رابط البنر */}
              <div className="mb-6">
                <Label htmlFor="banner-link" className="font-body mb-2 block">
                  رابط البنر (يفتح عند النقر على الصورة)
                </Label>
                <div className="flex gap-2">
                  <ExternalLink className="w-5 h-5 text-muted-foreground mt-2" />
                  <Input
                    id="banner-link"
                    type="url"
                    value={bannerLink}
                    onChange={(e) => setBannerLink(e.target.value)}
                    className="font-body flex-1"
                    placeholder="https://example.com"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* تفعيل/تعطيل البنر */}
              <div className="mb-6 flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {isBannerActive ? (
                    <ToggleRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                  )}
                  <Label htmlFor="banner-active" className="font-body cursor-pointer">
                    عرض البنر في الموقع
                  </Label>
                </div>
                <Switch
                  id="banner-active"
                  checked={isBannerActive}
                  onCheckedChange={setIsBannerActive}
                />
              </div>

              {/* أزرار التحكم */}
              <div className="flex gap-2">
                <ModernButton
                  onClick={handleSaveBanner}
                  disabled={isUploadingBanner}
                  className="flex-1"
                >
                  {isUploadingBanner ? 'جاري الحفظ...' : 'حفظ البنر'}
                </ModernButton>
                {banner && (
                  <ModernButton
                    variant="neon"
                    onClick={handleDeleteBanner}
                    disabled={isUploadingBanner}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف البنر
                  </ModernButton>
                )}
              </div>

              {banner && (
                <p className="text-xs text-muted-foreground font-body mt-3">
                  آخر تحديث: {new Date(banner.created_at).toLocaleDateString('ar-SA')}
                </p>
              )}
            </ModernCard>
          </TabsContent>

          <TabsContent value="admins" className="space-y-4">
            {/* إضافة مسؤول جديد */}
            <ModernCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">إضافة مسؤول جديد</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-email" className="font-body mb-2 block">
                    البريد الإلكتروني للمستخدم
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="admin-email"
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="font-body flex-1"
                      disabled={isAddingAdmin}
                    />
                    <ModernButton
                      onClick={handleAddAdmin}
                      disabled={isAddingAdmin || !newAdminEmail}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <UserPlus className="w-4 h-4 ml-1" />
                      {isAddingAdmin ? 'جاري الإضافة...' : 'إضافة'}
                    </ModernButton>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-2">
                    يجب أن يكون المستخدم مسجلاً في النظام مسبقاً
                  </p>
                </div>
              </div>
            </ModernCard>

            {/* قائمة المسؤولين */}
            <ModernCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">المسؤولون الحاليون ({admins.length})</h3>
              </div>
              
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-body font-semibold text-foreground">
                        {admin.user_email}
                      </p>
                      <p className="text-xs text-muted-foreground font-body mt-1">
                        منذ: {new Date(admin.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    
                    <ModernButton
                      size="sm"
                      variant="neon"
                      onClick={() => handleRemoveAdmin(admin.id, admin.user_id)}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={admins.length <= 1}
                      title={admins.length <= 1 ? 'لا يمكن حذف آخر مسؤول' : 'إزالة المسؤول'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </ModernButton>
                  </div>
                ))}
                
                {admins.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground font-body">
                      لا يوجد مسؤولون حالياً
                    </p>
                  </div>
                )}
              </div>
            </ModernCard>
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
