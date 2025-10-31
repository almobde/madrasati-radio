// قائمة المواضيع الإذاعية - Radio Topics List
import { useState, useEffect } from 'react';
import { Search, Radio, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAppContext } from '../context/AppContext';
import { topics as staticTopics } from '../data/topics';
import { TopicGenerator } from './TopicGenerator';
import { Topic, Gender, EducationLevel } from '../types';
import { supabase } from '@/integrations/supabase/client';
import Footer from './Footer';

const TopicsList = () => {
  const { preferences, setPreferences, setCurrentTopic, isFavorite, toggleFavorite } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [allTopics, setAllTopics] = useState<Topic[]>(staticTopics);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load custom topics from database
  useEffect(() => {
    const loadCustomTopics = async () => {
      setIsLoading(true);
      try {
        if (!preferences) {
          setAllTopics(staticTopics);
          setIsLoading(false);
          return;
        }

        // تحميل جميع المواضيع من قاعدة البيانات
        const { data, error } = await supabase
          .from('custom_topics')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;

        const customTopics: Topic[] = (data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          gender: item.gender as Gender,
          educationLevel: item.education_level as EducationLevel,
          content: item.content,
          created_at: item.created_at,
        }));

        // تصفية المواضيع حسب التفضيلات
        const filteredCustomTopics = customTopics.filter(
          topic => topic.gender === preferences.gender && 
                   topic.educationLevel === preferences.educationLevel
        );

        setAllTopics([...filteredCustomTopics, ...staticTopics]);
      } catch (error) {
        console.error('Error loading custom topics:', error);
        setAllTopics(staticTopics);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomTopics();
  }, [showGenerator, preferences?.gender, preferences?.educationLevel]);

  // تصفية المواضيع حسب البحث والتبويب
  const filteredTopics = allTopics.filter(topic => {
    const matchesSearch = !searchTerm || 
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || (activeTab === 'favorites' && isFavorite(topic.id));
    
    return matchesSearch && matchesTab;
  });

  const genderText = preferences?.gender === 'girls' ? 'طالبات' : 'طلاب';
  const levelText = preferences?.educationLevel === 'primary' ? 'ابتدائي' : 
                   preferences?.educationLevel === 'middle' ? 'متوسط' : 'ثانوي';

  if (showGenerator) {
    return <TopicGenerator onBack={() => setShowGenerator(false)} />;
  }

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <main className={`min-h-screen transition-all duration-700 ${preferences?.gender === 'girls' ? 'bg-gradient-to-br from-[hsl(330,70%,30%)] via-[hsl(320,80%,40%)] to-[hsl(310,90%,50%)]' : 'bg-gradient-to-br from-[hsl(220,70%,25%)] via-[hsl(210,80%,35%)] to-[hsl(200,90%,45%)]'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white font-body text-lg">جاري تحميل المواضيع...</p>
          </div>
        </div>
      </main>
    );
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

        {/* تبويب الكل / المفضلة */}
        <div className="max-w-md mx-auto mb-6 flex gap-2 justify-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 px-4 rounded-xl font-heading font-bold text-sm transition-all duration-300 whitespace-nowrap border-[3px] ${
              preferences?.gender === 'girls'
                ? 'border-[hsl(330,70%,40%)]'
                : 'border-[hsl(220,70%,35%)]'
            } ${
              activeTab === 'all'
                ? preferences?.gender === 'girls'
                  ? 'bg-white text-[hsl(330,70%,40%)] shadow-lg scale-105'
                  : 'bg-white text-[hsl(220,70%,35%)] shadow-lg scale-105'
                : 'bg-white/30 text-white hover:bg-white/40 hover:scale-102'
            }`}
          >
            جميع المواضيع ({allTopics.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-3 px-4 rounded-xl font-heading font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap border-[3px] ${
              preferences?.gender === 'girls'
                ? 'border-[hsl(330,70%,40%)]'
                : 'border-[hsl(220,70%,35%)]'
            } ${
              activeTab === 'favorites'
                ? preferences?.gender === 'girls'
                  ? 'bg-white text-[hsl(330,70%,40%)] shadow-lg scale-105'
                  : 'bg-white text-[hsl(220,70%,35%)] shadow-lg scale-105'
                : 'bg-white/30 text-white hover:bg-white/40 hover:scale-102'
            }`}
          >
            <Star className="w-4 h-4" fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
            المفضلة ({allTopics.filter(t => isFavorite(t.id)).length})
          </button>
        </div>

        {/* شبكة المواضيع - 3 في الصف على الجوال */}
        {filteredTopics.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white font-body text-lg">
              {activeTab === 'favorites' 
                ? 'لا توجد مواضيع مفضلة بعد' 
                : searchTerm 
                  ? 'لا توجد نتائج للبحث' 
                  : 'لا توجد مواضيع متاحة لهذه الفئة'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
            {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="group relative"
            >
              {/* زر المفضلة - في الزاوية */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(topic.id);
                }}
                className="absolute top-1 left-1 z-10 hover:scale-125 transition-all duration-200"
              >
                <Star 
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 drop-shadow-md" 
                  fill={isFavorite(topic.id) ? '#fbbf24' : 'none'}
                  stroke={isFavorite(topic.id) ? '#fbbf24' : '#94a3b8'}
                  strokeWidth={2}
                />
              </button>

              {/* مربع الموضوع */}
              <div
                className="bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/50 cursor-pointer"
                onClick={() => setCurrentTopic(topic)}
              >
                {/* عنوان الموضوع */}
                <h3 className="font-heading font-bold text-radio-dark text-xs sm:text-sm text-center line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                  {topic.title}
                </h3>
              </div>
            </div>
            ))}
          </div>
        )}
        
        {/* التذييل */}
        <Footer />
      </div>
    </main>
  );
};

export default TopicsList;