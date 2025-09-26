// قائمة المواضيع الإذاعية - Radio Topics List
import { useState } from 'react';
import { Search, Radio, Book, ArrowLeft } from 'lucide-react';
import { ModernCard } from './ui/modern-card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useAppContext } from '../context/AppContext';
import { topics } from '../data/topics';

const TopicsList = () => {
  const { preferences, setCurrentTopic } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  // تصفية المواضيع حسب البحث فقط
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = !searchTerm || 
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const genderText = preferences?.gender === 'girls' ? 'طالبات' : 'طلاب';
  const levelText = preferences?.educationLevel === 'elementary' ? 'ابتدائي' : 
                   preferences?.educationLevel === 'middle' ? 'متوسط' : 'ثانوي';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* العنوان الرئيسي البسيط */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-radio-dark mb-4">
          مكتبة المواضيع الإذاعية
        </h1>
        <p className="text-gray-600 font-body max-w-2xl mx-auto">
          اختر من مجموعة متنوعة من المواضيع المتخصصة والمعدة بعناية لطلاب {genderText} - المرحلة {levelText}
        </p>
      </div>

      {/* شريط البحث */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="ابحث في المواضيع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 rounded-lg border-gray-300 focus:ring-radio-gold focus:border-radio-gold"
          />
        </div>
      </div>

      {/* شبكة المواضيع */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTopics.map((topic, index) => (
          <ModernCard
            key={topic.id}
            variant="luxury"
            padding="none"
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
            onClick={() => setCurrentTopic(topic)}
          >
            {/* صورة الموضوع */}
            <div className="aspect-[4/3] bg-gradient-to-br from-radio-gold/10 to-radio-gold/5 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-radio-gold rounded-full flex items-center justify-center shadow-lg">
                  <Radio className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 text-radio-dark text-xs px-2 py-1 font-medium">
                  {topic.category}
                </Badge>
              </div>
            </div>

            {/* محتوى الكارت */}
            <div className="p-4">
              <h3 className="font-heading font-bold text-radio-dark text-lg mb-2 line-clamp-2">
                {topic.title}
              </h3>
              
              {/* تفاصيل إضافية */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 font-body">
                    موضوع تعليمي
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 text-radio-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </ModernCard>
        ))}
      </div>
    </main>
  );
};

export default TopicsList;