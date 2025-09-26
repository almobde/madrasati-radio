// مكون قائمة المواضيع الجديد - New Modern Topics List
import { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '../context/AppContext';
import { topics } from '../data/topics';
import { Search, Book, ArrowRight, Sparkles, Radio, Settings, Globe } from 'lucide-react';

const TopicsList = () => {
  const { preferences, setCurrentTopic, setPreferences } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

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

  // المواضيع المتاحة
  const availableTopics = topics;

  const filteredTopics = availableTopics.filter(topic =>
    topic.title.includes(searchTerm) || topic.category.includes(searchTerm)
  );

  const handleTopicSelect = (topic: typeof availableTopics[0]) => {
    setCurrentTopic(topic);
  };

  const handleBackToPreferences = () => {
    setPreferences(null as any);
  };

  const genderText = preferences?.gender === 'boys' ? 'بنين' : 'بنات';
  const levelText = 
    preferences?.educationLevel === 'primary' ? 'ابتدائي' :
    preferences?.educationLevel === 'middle' ? 'متوسط' : 'ثانوي';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--secondary))]/40 to-[hsl(var(--accent))]/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة الفاخر */}
        <div className="mb-12 fade-in">
          <ModernCard variant="glass" padding="lg" className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <Radio className="w-12 h-12 text-[hsl(var(--primary))]" />
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-black">
                    مكتبة المواضيع الإذاعية
                  </h1>
                  <Globe className="w-12 h-12 text-[hsl(var(--primary))]" />
                </div>
                <p className="text-xl text-muted-foreground font-body">
                  اختر من مجموعة متنوعة من المواضيع المتخصصة والمعدة بعناية
                </p>
              </div>
              <ModernButton 
                variant="glass" 
                onClick={handleBackToPreferences}
                className="font-body"
              >
                <Settings className="w-5 h-5" />
                تغيير التفضيلات
              </ModernButton>
            </div>
          </ModernCard>
          
          <div className="flex justify-center gap-4 mb-8">
            <Badge className="text-base font-body py-3 px-6 rounded-full bg-gradient-to-r from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border-2 border-[hsl(var(--primary))]/30 shadow-lg">
              <Sparkles className="w-4 h-4 ml-2" />
              {genderText}
            </Badge>
            <Badge className="text-base font-body py-3 px-6 rounded-full bg-gradient-to-r from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/10 text-black border-2 border-[hsl(var(--primary))]/30 shadow-lg">
              <Book className="w-4 h-4 ml-2" />
              {levelText}
            </Badge>
          </div>

          {/* شريط البحث الفاخر */}
          <ModernCard variant="glass" padding="default" className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-[hsl(var(--primary))] w-6 h-6" />
              <Input
                type="text"
                placeholder="🔍 ابحث في مكتبة المواضيع المتنوعة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-16 py-4 text-xl font-body rounded-2xl border-2 border-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))] bg-white/90 backdrop-blur-sm shadow-lg"
              />
            </div>
          </ModernCard>
        </div>

        {/* قائمة المواضيع الفاخرة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 slide-up">
          {filteredTopics.map((topic, index) => (
            <ModernCard 
              key={topic.id} 
              variant="luxury" 
              padding="lg"
              className="cursor-pointer group hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-dark))] flex items-center justify-center shadow-lg">
                      <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-[hsl(var(--primary))] transition-colors leading-tight">
                        {topic.title}
                      </h3>
                      <Badge className="mt-2 text-sm font-body py-1 px-4 rounded-full bg-gradient-to-r from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/30">
                        {topic.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Book className="w-8 h-8 text-[hsl(var(--primary))] group-hover:text-[hsl(var(--primary-dark))]" />
                </div>
              </div>
              
              <p className="text-muted-foreground text-base font-body mb-8 line-clamp-3 leading-relaxed">
                {getContentByLevel(topic.content.introduction)}
              </p>
              
              <ModernButton 
                onClick={() => handleTopicSelect(topic)}
                variant="premium"
                className="w-full group-hover:shadow-[0_0_30px_hsl(var(--primary))/40] transition-all duration-300 font-body"
              >
                <Sparkles className="w-5 h-5" />
                <span>اختر هذا الموضوع</span>
                <ArrowRight className="w-5 h-5" />
              </ModernButton>
            </ModernCard>
          ))}
        </div>

        {/* حالة عدم وجود نتائج */}
        {filteredTopics.length === 0 && (
          <ModernCard variant="glass" padding="xl" className="text-center max-w-2xl mx-auto">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-heading font-bold text-foreground mb-4">
              لم نعثر على نتائج مطابقة
            </h3>
            <p className="text-xl text-muted-foreground font-body leading-relaxed mb-6">
              جرب البحث بكلمات مختلفة أو تصفح جميع المواضيع المتاحة
            </p>
            <ModernButton 
              variant="glass"
              onClick={() => setSearchTerm('')}
              className="font-body"
            >
              <Globe className="w-5 h-5" />
              عرض جميع المواضيع
            </ModernButton>
          </ModernCard>
        )}
      </div>
    </div>
  );
};

export default TopicsList;