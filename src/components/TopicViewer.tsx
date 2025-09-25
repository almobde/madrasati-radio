// مكون عارض الموضوع الشامل - Complete Topic Viewer Component
import { useAppContext } from '../context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Home, BookOpen, Mic, Heart, Sparkles, Radio, Crown, Lightbulb, Quote, HelpCircle, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--secondary))]/30 to-[hsl(var(--accent))]/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="mb-8 fade-in">
          <ModernCard variant="glass" padding="lg" className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-right flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <Radio className="w-8 h-8 text-[hsl(var(--primary))]" />
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient leading-tight">
                    {currentTopic.title}
                  </h1>
                  <Crown className="w-8 h-8 text-[hsl(var(--primary))]" />
                </div>
                <p className="text-base text-muted-foreground font-body">
                  محتوى إذاعي شامل ومتكامل
                </p>
              </div>
              <ModernButton 
                variant="glass" 
                size="sm"
                onClick={handleBackToTopics}
                className="font-body"
              >
                <Home className="w-4 h-4" />
                العودة للمواضيع
              </ModernButton>
            </div>
          </ModernCard>
        </div>

        {/* التبويبات الثمانية */}
        <Tabs defaultValue="introduction" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent p-2 h-auto mb-8">
            <TabsTrigger 
              value="introduction" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-sm font-bold transition-all duration-500 hover:scale-[1.02] p-3"
            >
              <BookOpen className="w-4 h-4 mb-1" />
              <span className="text-xs">المقدمة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="verses" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-sm font-bold transition-all duration-500 hover:scale-[1.02] p-3"
            >
              <Heart className="w-4 h-4 mb-1" />
              <span className="text-xs">الآيات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="hadith" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-sm font-bold transition-all duration-500 hover:scale-[1.02] p-3"
            >
              <MessageCircle className="w-4 h-4 mb-1" />
              <span className="text-xs">الحديث</span>
            </TabsTrigger>
            <TabsTrigger 
              value="didYouKnow" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-sm font-bold transition-all duration-500 hover:scale-[1.02] p-3"
            >
              <Lightbulb className="w-4 h-4 mb-1" />
              <span className="text-xs">هل تعلم</span>
            </TabsTrigger>
            <TabsTrigger 
              value="morningWord" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-sm font-bold transition-all duration-500 hover:scale-[1.02] p-3"
            >
              <Mic className="w-4 h-4 mb-1" />
              <span className="text-xs">كلمة الصباح</span>
            </TabsTrigger>
            <TabsTrigger 
              value="miscellaneous" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-sm font-bold transition-all duration-500 hover:scale-[1.02] p-3"
            >
              <Sparkles className="w-4 h-4 mb-1" />
              <span className="text-xs">منوعات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="questions" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-sm font-bold transition-all duration-500 hover:scale-[1.02] p-3"
            >
              <HelpCircle className="w-4 h-4 mb-1" />
              <span className="text-xs">أسئلة وألغاز</span>
            </TabsTrigger>
            <TabsTrigger 
              value="conclusion" 
              className="tab-luxury-inactive data-[state=active]:tab-luxury-active text-sm font-bold transition-all duration-500 hover:scale-[1.02] p-3"
            >
              <Sparkles className="w-4 h-4 mb-1" />
              <span className="text-xs">الخاتمة</span>
            </TabsTrigger>
          </TabsList>

          {/* محتوى التبويبات */}
          <div className="tabs-content-safe">
            {/* المقدمة */}
            <TabsContent value="introduction" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-[hsl(var(--primary))]" />
                    مقدمة عن {currentTopic.title}
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="bg-gradient-to-br from-[hsl(var(--primary))]/5 to-[hsl(var(--accent))]/10 rounded-2xl p-6 border border-[hsl(var(--primary))]/20">
                    <p className="text-base font-body leading-relaxed text-foreground">
                      {getContentByLevel(currentTopic.content.introduction)}
                    </p>
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* الآيات القرآنية */}
            <TabsContent value="verses" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Heart className="w-6 h-6 text-[hsl(var(--primary))]" />
                    آيات قرآنية كريمة
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="bg-gradient-to-r from-[hsl(var(--accent))]/20 to-[hsl(var(--secondary))]/30 rounded-2xl p-8 border-r-4 border-[hsl(var(--primary))] shadow-inner">
                    <p className="text-xl font-heading leading-loose text-foreground text-center mb-4">
                      {currentTopic.content.quranVerse?.text || 'لا توجد آيات متاحة حالياً'}
                    </p>
                    {currentTopic.content.quranVerse?.reference && (
                      <p className="text-sm text-[hsl(var(--primary))] font-semibold text-center">
                        {currentTopic.content.quranVerse.reference}
                      </p>
                    )}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* الحديث الشريف */}
            <TabsContent value="hadith" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-[hsl(var(--primary))]" />
                    حديث شريف
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="bg-gradient-to-r from-[hsl(var(--secondary))]/30 to-[hsl(var(--accent))]/20 rounded-2xl p-8 border-r-4 border-[hsl(var(--primary))] shadow-inner">
                    <p className="text-lg font-body leading-loose text-foreground mb-4">
                      {currentTopic.content.hadith?.text || 'لا يوجد حديث متاح حالياً'}
                    </p>
                    {currentTopic.content.hadith?.reference && (
                      <p className="text-sm text-[hsl(var(--primary))] font-semibold text-center">
                        {currentTopic.content.hadith.reference}
                      </p>
                    )}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* هل تعلم */}
            <TabsContent value="didYouKnow" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-[hsl(var(--primary))]" />
                    هل تعلم؟
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-4">
                    {getContentByLevel(currentTopic.content.didYouKnow).map((fact: string, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl border-r-4 border-yellow-400">
                        <div className="flex items-start gap-3">
                          <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-1">
                            {index + 1}
                          </div>
                          <p className="text-base font-body leading-relaxed text-right flex-1">
                            {fact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* كلmة الصباح */}
            <TabsContent value="morningWord" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Mic className="w-6 h-6 text-[hsl(var(--primary))]" />
                    كلمة الصباح
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 rounded-2xl p-6 border border-[hsl(var(--primary))]/30 shadow-inner">
                    <div className="mb-4 text-xs text-[hsl(var(--primary))] font-medium bg-[hsl(var(--primary))]/10 rounded-full py-1 px-3 inline-block">
                      طول النص: {getContentByLevel(currentTopic.content.morningWord).length} حرف
                    </div>
                    <p className="text-base font-body leading-relaxed text-foreground">
                      {getContentByLevel(currentTopic.content.morningWord)}
                    </p>
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* منوعات */}
            <TabsContent value="miscellaneous" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
                    منوعات
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-6">
                    {getContentByLevel(currentTopic.content.miscellaneous).map((item: any, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border-r-4 border-emerald-400">
                        <div className="mb-3">
                          <Badge variant="secondary" className="text-xs font-body">
                            {item.type === 'story' ? 'قصة' : item.type === 'dua' ? 'دعاء' : item.type === 'medical' ? 'نصيحة طبية' : 'موضوع'}
                          </Badge>
                        </div>
                        <h4 className="text-lg font-heading font-bold mb-3 text-right">
                          {item.title}
                        </h4>
                        <p className="text-base font-body leading-relaxed text-right">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* أسئلة وألغاز */}
            <TabsContent value="questions" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-[hsl(var(--primary))]" />
                    أسئلة وألغاز
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-6">
                    {getContentByLevel(currentTopic.content.questions).map((qa: any, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                        <div className="flex items-start gap-3 mb-4">
                          <Badge variant="secondary" className="text-xs font-body">س{index + 1}</Badge>
                          <p className="text-base font-body font-medium text-right flex-1">
                            {qa.question}
                          </p>
                        </div>
                        <div className="flex items-start gap-3 mr-8">
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 font-body">جواب</Badge>
                          <p className="text-sm text-green-800 font-body text-right flex-1">
                            {qa.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* الخاتمة */}
            <TabsContent value="conclusion" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
                    خاتمة الإذاعة
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-4">
                    {currentTopic.content.conclusion && (
                      <div className="bg-gradient-to-r from-rose-50 to-rose-100 p-6 rounded-xl border-r-4 border-rose-400">
                        <p className="text-base font-body leading-relaxed text-right">
                          {currentTopic.content.conclusion}
                        </p>
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-r-4 border-gray-400">
                      <p className="text-base font-body leading-relaxed text-right">
                        {currentTopic.content.radioEnding}
                      </p>
                    </div>
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