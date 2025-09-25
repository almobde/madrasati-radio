// مكون عارض الموضوع الجديد - New Modern Topic Viewer
import { useAppContext } from '../context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '@/components/ui/modern-card';
import { ArrowRight, Home, BookOpen, Mic, Heart, Sparkles, Radio, Crown } from 'lucide-react';

const TopicViewer = () => {
  const { currentTopic, setCurrentTopic, preferences } = useAppContext();

  if (!currentTopic) return null;

  const handleBackToTopics = () => {
    setCurrentTopic(null);
  };

  // دالة للحصول على المحتوى حسب المرحلة التعليمية
  const getContentByLevel = (content: any) => {
    if (!preferences) return content.middle || content;
    
    switch (preferences.educationLevel) {
      case 'primary': return content.primary || content;
      case 'middle': return content.middle || content;
      case 'secondary': return content.secondary || content;
      default: return content.middle || content;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--secondary))]/30 to-[hsl(var(--accent))]/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة الفاخر */}
        <div className="mb-12 fade-in">
          <ModernCard variant="glass" padding="lg" className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-right flex-1">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <Radio className="w-12 h-12 text-[hsl(var(--primary))]" />
                  <h1 className="text-4xl md:text-6xl font-heading font-bold text-gradient leading-tight">
                    {currentTopic.title}
                  </h1>
                  <Crown className="w-12 h-12 text-[hsl(var(--primary))]" />
                </div>
                <p className="text-xl text-muted-foreground font-body">
                  محتوى إذاعي متخصص ومعد بعناية فائقة
                </p>
              </div>
              <ModernButton 
                variant="glass" 
                onClick={handleBackToTopics}
                className="font-body"
              >
                <Home className="w-5 h-5" />
                العودة للمواضيع
              </ModernButton>
            </div>
          </ModernCard>
        </div>

        {/* التبويبات الفاخرة */}
        <Tabs defaultValue="introduction" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 gap-4 bg-transparent p-2 h-auto mb-12">
            <TabsTrigger 
              value="introduction" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-lg font-bold transition-all duration-500 hover:scale-[1.02]"
            >
              <BookOpen className="w-6 h-6 ml-3" />
              المقدمة الشاملة
            </TabsTrigger>
            <TabsTrigger 
              value="verses" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-lg font-bold transition-all duration-500 hover:scale-[1.02]"
            >
              <Heart className="w-6 h-6 ml-3" />
              الآيات الكريمة
            </TabsTrigger>
            <TabsTrigger 
              value="hadith" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-lg font-bold transition-all duration-500 hover:scale-[1.02]"
            >
              <Mic className="w-6 h-6 ml-3" />
              الحديث الشريف
            </TabsTrigger>
            <TabsTrigger 
              value="morningWord" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-lg font-bold transition-all duration-500 hover:scale-[1.02]"
            >
              <Sparkles className="w-6 h-6 ml-3" />
              كلمة الصباح
            </TabsTrigger>
          </TabsList>

          {/* محتوى التبويبات الفاخر */}
          <div className="tabs-content-safe">
            <TabsContent value="introduction" className="fade-in">
              <ModernCard variant="luxury" padding="xl">
                <ModernCardHeader>
                  <ModernCardTitle className="text-4xl flex items-center gap-4">
                    <BookOpen className="w-10 h-10 text-[hsl(var(--primary))]" />
                    مقدمة شاملة عن {currentTopic.title}
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="bg-gradient-to-br from-[hsl(var(--primary))]/5 to-[hsl(var(--accent))]/10 rounded-3xl p-8 border-2 border-[hsl(var(--primary))]/20">
                    <p className="text-xl font-body leading-relaxed text-foreground">
                      {getContentByLevel(currentTopic.content.introduction)}
                    </p>
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            <TabsContent value="verses" className="fade-in">
              <ModernCard variant="luxury" padding="xl">
                <ModernCardHeader>
                  <ModernCardTitle className="text-4xl flex items-center gap-4">
                    <Heart className="w-10 h-10 text-[hsl(var(--primary))]" />
                    آيات قرآنية كريمة
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="bg-gradient-to-r from-[hsl(var(--accent))]/20 to-[hsl(var(--secondary))]/30 rounded-3xl p-10 border-r-8 border-[hsl(var(--primary))] shadow-inner">
                    <p className="text-3xl font-heading leading-loose text-foreground text-center">
                      {currentTopic.content.quranVerse?.text || 'لا توجد آيات متاحة حالياً'}
                    </p>
                    {currentTopic.content.quranVerse?.reference && (
                      <p className="text-lg text-[hsl(var(--primary))] font-semibold text-center mt-6">
                        {currentTopic.content.quranVerse.reference}
                      </p>
                    )}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            <TabsContent value="hadith" className="fade-in">
              <ModernCard variant="luxury" padding="xl">
                <ModernCardHeader>
                  <ModernCardTitle className="text-4xl flex items-center gap-4">
                    <Mic className="w-10 h-10 text-[hsl(var(--primary))]" />
                    حديث شريف
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="bg-gradient-to-r from-[hsl(var(--secondary))]/30 to-[hsl(var(--accent))]/20 rounded-3xl p-10 border-r-8 border-[hsl(var(--primary))] shadow-inner">
                    <p className="text-2xl font-body leading-loose text-foreground">
                      {currentTopic.content.hadith?.text || 'لا يوجد حديث متاح حالياً'}
                    </p>
                    {currentTopic.content.hadith?.reference && (
                      <p className="text-lg text-[hsl(var(--primary))] font-semibold text-center mt-6">
                        {currentTopic.content.hadith.reference}
                      </p>
                    )}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            <TabsContent value="morningWord" className="fade-in">
              <ModernCard variant="luxury" padding="xl">
                <ModernCardHeader>
                  <ModernCardTitle className="text-4xl flex items-center gap-4">
                    <Sparkles className="w-10 h-10 text-[hsl(var(--primary))]" />
                    كلمة الصباح المميزة
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 rounded-3xl p-10 border-2 border-[hsl(var(--primary))]/30 shadow-inner">
                    <div className="mb-6 text-sm text-[hsl(var(--primary))] font-medium bg-[hsl(var(--primary))]/10 rounded-full py-2 px-4 inline-block">
                      طول النص: {getContentByLevel(currentTopic.content.morningWord).length} حرف
                    </div>
                    <p className="text-xl font-body leading-relaxed text-foreground">
                      {getContentByLevel(currentTopic.content.morningWord)}
                    </p>
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TopicViewer;