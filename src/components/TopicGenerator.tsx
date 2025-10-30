import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAppContext } from '../context/AppContext';
import { Topic } from '../types';
import Footer from './Footer';

interface TopicGeneratorProps {
  onBack: () => void;
}

export const TopicGenerator = ({ onBack }: TopicGeneratorProps) => {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTopic, setGeneratedTopic] = useState<Topic | null>(null);
  const { toast } = useToast();
  const { preferences } = useAppContext();

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال عنوان الموضوع",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-topic', {
        body: {
          title: title.trim(),
          gender: preferences?.gender || 'boys',
          educationLevel: preferences?.educationLevel || 'middle'
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "خطأ",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      const newTopic: Topic = {
        id: Date.now().toString(),
        title: title.trim(),
        category: 'موضوع مولد',
        content: data.content
      };

      setGeneratedTopic(newTopic);

      toast({
        title: "نجح!",
        description: "تم توليد الموضوع بنجاح",
      });

    } catch (error) {
      console.error('Error generating topic:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء توليد الموضوع",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToList = () => {
    if (generatedTopic && preferences) {
      const existingTopics = JSON.parse(localStorage.getItem('customTopics') || '[]');
      const newTopic = {
        ...generatedTopic,
        gender: preferences.gender,
        educationLevel: preferences.educationLevel,
      };
      existingTopics.push(newTopic);
      localStorage.setItem('customTopics', JSON.stringify(existingTopics));

      const levelName = preferences.educationLevel === 'primary' ? 'ابتدائي' : 
                        preferences.educationLevel === 'middle' ? 'متوسط' : 'ثانوي';
      const genderName = preferences.gender === 'girls' ? 'البنات' : 'البنين';

      toast({
        title: "✅ تم الإضافة",
        description: `تم إضافة الموضوع إلى قائمة ${genderName} - ${levelName}`,
      });

      onBack();
    }
  };

  return (
    <div className={`min-h-screen p-6 ${preferences?.gender === 'girls' ? 'bg-gradient-to-br from-pink-200 via-pink-300 to-purple-400' : 'bg-gradient-to-br from-[hsl(200,100%,90%)] via-[hsl(210,100%,85%)] to-[hsl(220,100%,80%)]'}`}>
      <div className="max-w-4xl mx-auto">
        {/* زر الرجوع */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:bg-gray-100 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-radio-dark" />
          <span className="font-body text-radio-dark font-semibold">رجوع</span>
        </button>

        {/* العنوان */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-radio-gold" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-radio-dark">
              توليد موضوع جديد
            </h1>
          </div>
          <p className="text-gray-700 font-body">
            اكتب عنوان الموضوع وسيتم توليد محتوى إذاعي متكامل بالذكاء الاصطناعي
          </p>
        </div>

        {/* نموذج الإدخال */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-radio-dark font-heading font-bold mb-2">
                عنوان الموضوع
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: الأمل، المثابرة، حب الوطن..."
                className="text-lg"
                disabled={isGenerating}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !title.trim()}
              className="w-full bg-white hover:bg-gray-50 text-radio-dark text-lg py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] active:bg-gray-100 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  جاري التوليد...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 ml-2" />
                  توليد الموضوع
                </>
              )}
            </Button>
          </div>
        </div>

        {/* عرض النتيجة */}
        {generatedTopic && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold text-radio-dark">
                {generatedTopic.title}
              </h2>
              <Button
                onClick={handleAddToList}
                className="bg-white hover:bg-gray-50 text-radio-dark shadow-lg hover:shadow-xl hover:scale-105 active:bg-gray-100 active:scale-95 transition-all duration-300"
              >
                إضافة للقائمة
              </Button>
            </div>

            <div className="space-y-4 text-right">
              <div>
                <h3 className="font-heading font-bold text-radio-dark mb-2">المقدمة</h3>
                <p className="text-gray-700 font-body leading-relaxed">
                  {generatedTopic.content.introduction.primary}
                </p>
              </div>

              <div>
                <h3 className="font-heading font-bold text-radio-dark mb-2">الآيات القرآنية</h3>
                {generatedTopic.content.quranVerses.map((verse, idx) => (
                  <div key={idx} className="mb-2 p-3 bg-green-50 rounded-lg">
                    <p className="font-body text-gray-800 mb-1">{verse.text}</p>
                    <p className="text-sm text-gray-600">({verse.reference})</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-heading font-bold text-radio-dark mb-2">الأحاديث النبوية</h3>
                {generatedTopic.content.hadiths.map((hadith, idx) => (
                  <div key={idx} className="mb-2 p-3 bg-blue-50 rounded-lg">
                    <p className="font-body text-gray-800 mb-1">{hadith.text}</p>
                    <p className="text-sm text-gray-600">({hadith.reference})</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-heading font-bold text-radio-dark mb-2">كلمة الصباح</h3>
                <p className="text-gray-700 font-body leading-relaxed">
                  {generatedTopic.content.morningWord.middle}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* التذييل */}
        <Footer />
      </div>
    </div>
  );
};
