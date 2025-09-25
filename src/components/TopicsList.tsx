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

  const filteredTopics = topics.filter(topic =>
    topic.title.includes(searchTerm) || topic.category.includes(searchTerm)
  );

  const handleTopicSelect = (topic: typeof topics[0]) => {
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              📚 مواضيع الإذاعة المدرسية
            </h1>
            <Button 
              variant="outline" 
              onClick={handleBackToPreferences}
              className="btn-secondary"
            >
              تغيير التفضيلات
            </Button>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              {genderText}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {levelText}
            </Badge>
          </div>

          {/* شريط البحث */}
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="ابحث عن موضوع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* قائمة المواضيع */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 slide-up">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="card-primary p-6 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {topic.category}
                  </Badge>
                </div>
                <Book className="w-6 h-6 text-primary" />
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {topic.content.introduction}
              </p>
              
              <Button 
                onClick={() => handleTopicSelect(topic)}
                className="btn-primary w-full group-hover:shadow-lg transition-shadow"
              >
                <span>اختر هذا الموضوع</span>
                <ArrowRight className="w-4 h-4 mr-2" />
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