// مكون قائمة المواضيع - Topics List Component
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '../context/AppContext';
import { topics } from '../data/topics';
import { Search, Book, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="max-w-6xl mx-auto">
        {/* رأس الصفحة */}
        <div className="mb-8 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient">
              📚 مواضيع الإذاعة المدرسية
            </h1>
            <Button 
              variant="outline" 
              onClick={handleBackToPreferences}
              className="btn-secondary font-body"
            >
              تغيير التفضيلات
            </Button>
          </div>
          
          <div className="flex gap-3 mb-6">
            <Badge variant="secondary" className="text-sm font-body py-2 px-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/20">
              {genderText}
            </Badge>
            <Badge variant="secondary" className="text-sm font-body py-2 px-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/20">
              {levelText}
            </Badge>
          </div>

          {/* شريط البحث */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="ابحث عن موضوع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 py-3 text-lg font-body rounded-2xl border-2 border-primary/20 focus:border-primary bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* قائمة المواضيع */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 slide-up">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="card-gradient p-8 cursor-pointer group hover:shadow-elegant transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-heading font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                    {topic.title}
                  </h3>
                  <Badge variant="outline" className="text-sm font-body py-1 px-3 rounded-full border-primary/30 text-primary">
                    {topic.category}
                  </Badge>
                </div>
                <Book className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors" />
              </div>
              
              <p className="text-muted-foreground text-base font-body mb-6 line-clamp-3 leading-relaxed">
                {getContentByLevel(topic.content.introduction)}
              </p>
              
              <Button 
                onClick={() => handleTopicSelect(topic)}
                className="btn-primary w-full group-hover:shadow-glow transition-all duration-300 font-body"
              >
                <span>اختر هذا الموضوع</span>
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </Card>
          ))}
        </div>

        {/* حالة عدم وجود نتائج */}
        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              لم نجد أي نتائج
            </h3>
            <p className="text-muted-foreground">
              جرب البحث بكلمات أخرى أو تصفح جميع المواضيع
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsList;