import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Trash2, Radio, Home, Edit, Filter, Image as ImageIcon, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Topic {
  id: string;
  title: string;
  category: string;
  gender: string;
  education_level: string;
  content: any;
  created_at: string;
}

interface Banner {
  id: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  created_at: string;
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
        fetchTopics();
        fetchBanner();
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
      .order('created_at', { ascending: false });
    
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

        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="topics" className="font-body">
              <Radio className="w-4 h-4 ml-2" />
              المواضيع ({topics.length})
            </TabsTrigger>
            <TabsTrigger value="banner" className="font-body">
              <ImageIcon className="w-4 h-4 ml-2" />
              البنر الإعلاني
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
