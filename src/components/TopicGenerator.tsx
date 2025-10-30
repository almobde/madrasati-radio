import { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAppContext } from '../context/AppContext';
import { Topic } from '../types';
import Footer from './Footer';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

// مجموعة كبيرة من العناوين المقترحة
const ALL_SUGGESTIONS = [
  'الصدق', 'التعاون', 'الإبداع', 'الأمانة', 'العطاء', 'الإيجابية', 
  'التفاؤل', 'الطموح', 'الاحترام', 'النظافة', 'الصبر', 'الشكر',
  'الإخلاص', 'المثابرة', 'النجاح', 'التميز', 'الإتقان', 'الأخوة',
  'التسامح', 'الوفاء', 'الكرم', 'الشجاعة', 'المسؤولية', 'الانضباط',
  'الإبتسامة', 'النشاط', 'التنظيم', 'حب الوطن', 'الأمل', 'القراءة',
  'العلم', 'الحكمة', 'الصداقة', 'التواضع', 'الجد', 'البر',
  'الحياء', 'الرحمة', 'العدل', 'الإحسان'
];

interface TopicGeneratorProps {
  onBack: () => void;
}

export const TopicGenerator = ({ onBack }: TopicGeneratorProps) => {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedTopic, setGeneratedTopic] = useState<Topic | null>(null);
  const [addressStyle, setAddressStyle] = useState<'masculine' | 'feminine'>('masculine');
  const [contentLength, setContentLength] = useState<'long' | 'short'>('long');
  const [selectedSections, setSelectedSections] = useState({
    introduction: true,
    quranVerses: true,
    hadiths: true,
    didYouKnow: true,
    morningWord: true,
    miscellaneous: true,
    questions: true,
    conclusion: true,
  });
  const { toast } = useToast();
  const { preferences } = useAppContext();

  // عناوين مقترحة عشوائية تتغير في كل مرة
  const randomSuggestions = useMemo(() => {
    const shuffled = [...ALL_SUGGESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }, []);

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
    setProgress(0);
    
    // تحريك شريط التقدم تدريجياً وببطء
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 3; // زيادة عشوائية بين 0-3%
      if (currentProgress > 95) currentProgress = 95; // لا يتجاوز 95% حتى ينتهي التوليد
      setProgress(Math.floor(currentProgress));
    }, 1500); // كل 1.5 ثانية
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-topic', {
        body: {
          title: title.trim(),
          gender: preferences?.gender || 'boys',
          educationLevel: preferences?.educationLevel || 'middle',
          addressStyle,
          contentLength,
          selectedSections
        }
      });

      clearInterval(progressInterval);
      setProgress(100); // عند الانتهاء يصل إلى 100%

      if (error) throw error;

      if (data.error) {
        toast({
          title: "خطأ",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.content) {
        toast({
          title: "خطأ",
          description: "لم يتم استلام المحتوى من الخادم",
          variant: "destructive",
        });
        return;
      }

      const newTopic: Topic = {
        id: Date.now().toString(),
        title: title.trim(),
        category: 'موضوع مولد',
        gender: preferences?.gender,
        educationLevel: preferences?.educationLevel,
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
        description: "حدث خطأ أثناء توليد الموضوع. حاول مرة أخرى.",
        variant: "destructive",
      });
      clearInterval(progressInterval);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleAddToList = async () => {
    if (generatedTopic && preferences) {
      try {
        // Get the maximum display_order
        const { data: maxOrderData } = await supabase
          .from('custom_topics')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1)
          .maybeSingle();

        const newOrder = (maxOrderData?.display_order || 0) + 1;

        const { error } = await supabase
          .from('custom_topics')
          .insert({
            title: generatedTopic.title,
            category: generatedTopic.category,
            gender: preferences.gender,
            education_level: preferences.educationLevel,
            content: generatedTopic.content,
            display_order: newOrder,
          });

        if (error) throw error;

        const levelName = preferences.educationLevel === 'primary' ? 'ابتدائي' : 
                          preferences.educationLevel === 'middle' ? 'متوسط' : 'ثانوي';
        const genderName = preferences.gender === 'girls' ? 'البنات' : 'البنين';

        toast({
          title: "✅ تم الإضافة",
          description: `تم إضافة الموضوع إلى قائمة ${genderName} - ${levelName}`,
        });

        onBack();
      } catch (error) {
        console.error('Error saving topic:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حفظ الموضوع",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-700 ${preferences?.gender === 'girls' ? 'bg-gradient-to-br from-[hsl(330,70%,30%)] via-[hsl(320,80%,40%)] to-[hsl(310,90%,50%)]' : 'bg-gradient-to-br from-[hsl(220,70%,25%)] via-[hsl(210,80%,35%)] to-[hsl(200,90%,45%)]'}`}>
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
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white transition-colors duration-700">
              توليد موضوع جديد
            </h1>
          </div>
          <p className="text-white/90 font-body transition-colors duration-700">
            اكتب عنوان الموضوع وسيتم توليد محتوى إذاعي متكامل بالذكاء الاصطناعي
          </p>
        </div>

        {/* نموذج الإدخال */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6">
          <div className="space-y-6">
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
              <div className="mt-3">
                <p className="text-sm text-gray-600 font-body mb-2">عناوين مقترحة:</p>
                <div className="flex flex-wrap gap-2">
                  {randomSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setTitle(suggestion)}
                      disabled={isGenerating}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-radio-dark rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* الخطاب */}
            <div>
              <label className="block text-radio-dark font-heading font-bold mb-3">
                أسلوب الخطاب
              </label>
              <RadioGroup value={addressStyle} onValueChange={(value: 'masculine' | 'feminine') => setAddressStyle(value)} className="flex gap-6">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="masculine" id="masculine" />
                  <Label htmlFor="masculine" className="font-body cursor-pointer">مذكر</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="feminine" id="feminine" />
                  <Label htmlFor="feminine" className="font-body cursor-pointer">مؤنث</Label>
                </div>
              </RadioGroup>
            </div>

            {/* الطول */}
            <div>
              <label className="block text-radio-dark font-heading font-bold mb-3">
                طول المحتوى
              </label>
              <RadioGroup value={contentLength} onValueChange={(value: 'long' | 'short') => setContentLength(value)} className="flex gap-6">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long" className="font-body cursor-pointer">طويل</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short" className="font-body cursor-pointer">قصير</Label>
                </div>
              </RadioGroup>
            </div>

            {/* الأقسام */}
            <div>
              <label className="block text-radio-dark font-heading font-bold mb-3">
                الأقسام المطلوبة
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="introduction" 
                    checked={selectedSections.introduction}
                    onCheckedChange={() => toggleSection('introduction')}
                  />
                  <Label htmlFor="introduction" className="font-body cursor-pointer">المقدمة</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="quranVerses" 
                    checked={selectedSections.quranVerses}
                    onCheckedChange={() => toggleSection('quranVerses')}
                  />
                  <Label htmlFor="quranVerses" className="font-body cursor-pointer">الآيات</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="hadiths" 
                    checked={selectedSections.hadiths}
                    onCheckedChange={() => toggleSection('hadiths')}
                  />
                  <Label htmlFor="hadiths" className="font-body cursor-pointer">الأحاديث</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="didYouKnow" 
                    checked={selectedSections.didYouKnow}
                    onCheckedChange={() => toggleSection('didYouKnow')}
                  />
                  <Label htmlFor="didYouKnow" className="font-body cursor-pointer">معلومات</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="morningWord" 
                    checked={selectedSections.morningWord}
                    onCheckedChange={() => toggleSection('morningWord')}
                  />
                  <Label htmlFor="morningWord" className="font-body cursor-pointer">كلمة</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="miscellaneous" 
                    checked={selectedSections.miscellaneous}
                    onCheckedChange={() => toggleSection('miscellaneous')}
                  />
                  <Label htmlFor="miscellaneous" className="font-body cursor-pointer">منوعات</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="questions" 
                    checked={selectedSections.questions}
                    onCheckedChange={() => toggleSection('questions')}
                  />
                  <Label htmlFor="questions" className="font-body cursor-pointer">أسئلة</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="conclusion" 
                    checked={selectedSections.conclusion}
                    onCheckedChange={() => toggleSection('conclusion')}
                  />
                  <Label htmlFor="conclusion" className="font-body cursor-pointer">خاتمة</Label>
                </div>
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-3">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-gray-600">
                  {progress < 30 && 'جاري تحليل العنوان...'}
                  {progress >= 30 && progress < 60 && 'جاري إنشاء المحتوى...'}
                  {progress >= 60 && progress < 90 && 'جاري التنسيق والمراجعة...'}
                  {progress >= 90 && 'اكتمل التوليد!'}
                </p>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !title.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] active:bg-orange-700 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:bg-orange-700 active:scale-95 transition-all duration-300"
              >
                إضافة للقائمة
              </Button>
            </div>

            <div className="space-y-4 text-right">
              {selectedSections.introduction && generatedTopic.content.introduction && (
                <div>
                  <h3 className="font-heading font-bold text-radio-dark mb-2">المقدمة</h3>
                  <p className="text-gray-700 font-body leading-relaxed">
                    {generatedTopic.content.introduction.primary}
                  </p>
                </div>
              )}

              {selectedSections.quranVerses && generatedTopic.content.quranVerses && (
                <div>
                  <h3 className="font-heading font-bold text-radio-dark mb-2">الآيات القرآنية</h3>
                  {generatedTopic.content.quranVerses.map((verse, idx) => (
                    <div key={idx} className="mb-2 p-3 bg-green-50 rounded-lg">
                      <p className="font-body text-gray-800 mb-1">{verse.text}</p>
                      <p className="text-sm text-gray-600">({verse.reference})</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedSections.hadiths && generatedTopic.content.hadiths && (
                <div>
                  <h3 className="font-heading font-bold text-radio-dark mb-2">الأحاديث النبوية</h3>
                  {generatedTopic.content.hadiths.map((hadith, idx) => (
                    <div key={idx} className="mb-2 p-3 bg-blue-50 rounded-lg">
                      <p className="font-body text-gray-800 mb-1">{hadith.text}</p>
                      <p className="text-sm text-gray-600">({hadith.reference})</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedSections.didYouKnow && generatedTopic.content.didYouKnow && (
                <div>
                  <h3 className="font-heading font-bold text-radio-dark mb-2">معلومات</h3>
                  <div className="space-y-2">
                    {(generatedTopic.content.didYouKnow[preferences?.educationLevel || 'middle'] || []).map((fact, idx) => (
                      <p key={idx} className="text-gray-700 font-body p-2 bg-yellow-50 rounded-lg">
                        {fact}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {selectedSections.morningWord && generatedTopic.content.morningWord && (
                <div>
                  <h3 className="font-heading font-bold text-radio-dark mb-2">كلمة</h3>
                  <p className="text-gray-700 font-body leading-relaxed">
                    {generatedTopic.content.morningWord[preferences?.educationLevel || 'middle']}
                  </p>
                </div>
              )}

              {selectedSections.miscellaneous && generatedTopic.content.miscellaneous && (
                <div>
                  <h3 className="font-heading font-bold text-radio-dark mb-2">منوعات</h3>
                  <div className="space-y-3">
                    {(generatedTopic.content.miscellaneous[preferences?.educationLevel || 'middle'] || []).map((item, idx) => (
                      <div key={idx} className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-body font-semibold text-gray-800 mb-1">{item.title}</h4>
                        <p className="text-gray-700 font-body text-sm">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSections.questions && generatedTopic.content.questions && (
                <div>
                  <h3 className="font-heading font-bold text-radio-dark mb-2">أسئلة</h3>
                  <div className="space-y-3">
                    {(generatedTopic.content.questions[preferences?.educationLevel || 'middle'] || []).map((question, idx) => (
                      <div key={idx} className="p-3 bg-orange-50 rounded-lg">
                        <p className="font-body text-gray-800 mb-1">{question.question}</p>
                        <p className="text-sm text-gray-600 font-semibold">الإجابة: {question.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSections.conclusion && generatedTopic.content.conclusion && (
                <div>
                  <h3 className="font-heading font-bold text-radio-dark mb-2">خاتمة</h3>
                  <p className="text-gray-700 font-body leading-relaxed">
                    {generatedTopic.content.conclusion}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* التذييل */}
        <Footer />
      </div>
    </div>
  );
};
