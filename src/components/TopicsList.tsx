// قائمة المواضيع الإذاعية - Radio Topics List
import { useState, useEffect } from 'react';
import { Search, Radio, ArrowLeft, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAppContext } from '../context/AppContext';
import { topics as staticTopics } from '../data/topics';
import { TopicGenerator } from './TopicGenerator';
import { Topic } from '../types';
import Footer from './Footer';

const TopicsList = () => {
  const { preferences, setPreferences, setCurrentTopic } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [allTopics, setAllTopics] = useState<Topic[]>(staticTopics);

  // Load custom topics from localStorage and filter by current preferences
  useEffect(() => {
    const loadCustomTopics = () => {
      try {
        const customTopicsJson = localStorage.getItem('customTopics');
        console.log('📚 localStorage customTopics:', customTopicsJson);
        console.log('👤 التفضيلات الحالية:', preferences);
        
        if (customTopicsJson) {
          const customTopics = JSON.parse(customTopicsJson);
          console.log('📋 جميع المواضيع المخصصة:', customTopics);
          
          // Filter custom topics by gender and education level
          const filteredCustomTopics = customTopics.filter((topic: Topic) => {
            const matches = topic.gender === preferences?.gender && 
                          topic.educationLevel === preferences?.educationLevel;
            console.log(`🔍 فحص موضوع "${topic.title}":`, {
              topicGender: topic.gender,
              topicLevel: topic.educationLevel,
              prefGender: preferences?.gender,
              prefLevel: preferences?.educationLevel,
              matches
            });
            return matches;
          });
          
          console.log('✅ المواضيع المفلترة:', filteredCustomTopics);
          setAllTopics([...filteredCustomTopics, ...staticTopics]);
        } else {
          console.log('⚠️ لا توجد مواضيع مخصصة في localStorage');
          setAllTopics(staticTopics);
        }
      } catch (error) {
        console.error('❌ خطأ في تحميل المواضيع:', error);
        setAllTopics(staticTopics);
      }
    };

    loadCustomTopics();
  }, [showGenerator, preferences?.gender, preferences?.educationLevel]); // Reload when returning from generator or preferences change

  // تصفية المواضيع حسب البحث فقط
  const filteredTopics = allTopics.filter(topic => {
    const matchesSearch = !searchTerm || 
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const genderText = preferences?.gender === 'girls' ? 'طالبات' : 'طلاب';
  const levelText = preferences?.educationLevel === 'primary' ? 'ابتدائي' : 
                   preferences?.educationLevel === 'middle' ? 'متوسط' : 'ثانوي';

  if (showGenerator) {
    return <TopicGenerator onBack={() => setShowGenerator(false)} />;
  }

  return (
    <main className={`min-h-screen transition-all duration-700 ${preferences?.gender === 'girls' ? 'bg-gradient-to-br from-[hsl(330,70%,30%)] via-[hsl(320,80%,40%)] to-[hsl(310,90%,50%)]' : 'bg-gradient-to-br from-[hsl(220,70%,25%)] via-[hsl(210,80%,35%)] to-[hsl(200,90%,45%)]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* زر الرجوع */}
        <button
          onClick={() => setPreferences(null)}
          className="mb-6 flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 text-radio-dark rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:bg-gray-100 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body font-semibold">رجوع للصفحة الرئيسية</span>
        </button>

        {/* العنوان الرئيسي البسيط */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 transition-colors duration-700">
            مكتبة المواضيع الإذاعية
          </h1>
          <p className="text-white/90 font-body max-w-2xl mx-auto transition-colors duration-700">
            اختر من مجموعة متنوعة من المواضيع المتخصصة والمعدة بعناية لطلاب {genderText} - المرحلة {levelText}
          </p>
        </div>

        {/* زر توليد موضوع جديد */}
        <div className="max-w-md mx-auto mb-6">
          <Button
            onClick={() => setShowGenerator(true)}
            className={`w-full py-6 text-lg font-heading shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 text-white ${
              preferences?.gender === 'girls'
                ? 'bg-gradient-to-r from-[hsl(330,70%,40%)] to-[hsl(310,80%,50%)] hover:from-[hsl(330,70%,45%)] hover:to-[hsl(310,80%,55%)]'
                : 'bg-gradient-to-r from-[hsl(220,70%,35%)] to-[hsl(200,80%,45%)] hover:from-[hsl(220,70%,40%)] hover:to-[hsl(200,80%,50%)]'
            }`}
          >
            <Sparkles className="w-6 h-6 ml-2" />
            توليد موضوع جديد بالذكاء الاصطناعي
          </Button>
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
                {/* عنوان الموضوع */}
                <h3 className="font-heading font-bold text-radio-dark text-xs sm:text-sm text-center line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                  {topic.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
        
        {/* التذييل */}
        <Footer />
      </div>
    </main>
  );
};

export default TopicsList;