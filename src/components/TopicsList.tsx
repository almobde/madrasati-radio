// قائمة المواضيع الإذاعية - Radio Topics List
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Radio, Book, ArrowLeft } from 'lucide-react';
import { ModernCard } from './ui/modern-card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useAppContext } from '../context/AppContext';
import { topics } from '../data/topics';

const TopicsList = () => {
  const navigate = useNavigate();
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
  const levelText = preferences?.educationLevel === 'primary' ? 'ابتدائي' : 
                   preferences?.educationLevel === 'middle' ? 'متوسط' : 'ثانوي';

  return (
    <main className="min-h-screen bg-gradient-to-br from-[hsl(200,100%,90%)] via-[hsl(210,100%,85%)] to-[hsl(220,100%,80%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* زر الرجوع */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-radio-dark" />
          <span className="font-body text-radio-dark">رجوع للصفحة الرئيسية</span>
        </button>

        {/* العنوان الرئيسي البسيط */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-radio-dark mb-4">
            مكتبة المواضيع الإذاعية
          </h1>
          <p className="text-gray-700 font-body max-w-2xl mx-auto">
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
              className="pr-10 rounded-lg border-gray-300 focus:ring-radio-gold focus:border-radio-gold bg-white/90 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* شبكة المواضيع - 3 في الصف على الجوال */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="group cursor-pointer"
              onClick={() => setCurrentTopic(topic)}
            >
              {/* مربع الموضوع */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/50">
                {/* أيقونة الموضوع */}
                <div className="aspect-square bg-gradient-to-br from-radio-gold/20 to-radio-gold/10 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-radio-gold" />
                </div>
                
                {/* عنوان الموضوع */}
                <h3 className="font-heading font-bold text-radio-dark text-xs sm:text-sm text-center line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                  {topic.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TopicsList;