// مكون عارض الموضوع - Topic Viewer Component
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '../context/AppContext';
import { 
  BookOpen, 
  Sparkles, 
  MessageCircle, 
  Lightbulb, 
  Mic, 
  Quote, 
  HelpCircle,
  Heart,
  ArrowRight,
  Share2
} from 'lucide-react';

const TopicViewer = () => {
  const { currentTopic, setCurrentTopic, preferences } = useAppContext();
  const [activeTab, setActiveTab] = useState('introduction');

  if (!currentTopic) return null;

  const handleBack = () => {
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

  const tabs = [
    { 
      id: 'introduction', 
      label: 'مقدمة', 
      icon: BookOpen, 
      content: getContentByLevel(currentTopic.content.introduction)
    },
    { 
      id: 'quran', 
      label: 'آيات قرآنية', 
      icon: Sparkles, 
      content: (
        <div className="verse-container">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-2xl border-r-4 border-green-400 content-box">
            <p className="text-xl font-body leading-loose mb-6 text-right" dir="rtl">
              {currentTopic.content.quranVerse.text}
            </p>
            <p className="text-base text-green-700 font-semibold text-right font-body" dir="rtl">
              {currentTopic.content.quranVerse.reference}
            </p>
          </div>
        </div>
      )
    },
    { 
      id: 'hadith', 
      label: 'حديث نبوي', 
      icon: MessageCircle, 
      content: (
        <div className="hadith-container">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl border-r-4 border-blue-400 content-box">
            <p className="text-xl font-body leading-loose mb-6 text-right" dir="rtl">
              {currentTopic.content.hadith.text}
            </p>
            <p className="text-base text-blue-700 font-semibold text-right font-body" dir="rtl">
              {currentTopic.content.hadith.reference}
            </p>
          </div>
        </div>
      )
    },
    { 
      id: 'didyouknow', 
      label: 'هل تعلم؟', 
      icon: Lightbulb, 
      content: (
        <div className="content-box space-y-4">
          {getContentByLevel(currentTopic.content.didYouKnow).map((fact: string, index: number) => (
            <div key={index} className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-2xl border-r-4 border-yellow-400">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-xl font-body leading-loose text-right flex-1" dir="rtl">
                  {fact}
                </p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    { 
      id: 'morning-word', 
      label: 'كلمة صباحية', 
      icon: Mic, 
      content: (
        <div className="content-box">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8 rounded-2xl border-r-4 border-purple-400">
            <div className="mb-4 text-sm text-purple-600 font-medium">
              طول النص: {getContentByLevel(currentTopic.content.morningWord).length} حرف
            </div>
            <p className="text-xl font-body leading-loose text-right" dir="rtl">
              {getContentByLevel(currentTopic.content.morningWord)}
            </p>
          </div>
        </div>
      )
    },
    { 
      id: 'poetry', 
      label: 'شعر وحكم', 
      icon: Quote, 
      content: (
        <div className="content-box space-y-6">
          {getContentByLevel(currentTopic.content.poetry).map((line: string, index: number) => (
            <div key={index} className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-2xl border-r-4 border-indigo-400">
              <p className="text-xl font-heading font-medium text-right leading-loose" dir="rtl">
                {line}
              </p>
            </div>
          ))}
        </div>
      )
    },
    { 
      id: 'questions', 
      label: 'أسئلة وألغاز', 
      icon: HelpCircle, 
      content: (
        <div className="content-box space-y-8">
          {getContentByLevel(currentTopic.content.questions).map((qa: any, index: number) => (
            <div key={index} className="bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200">
              <div className="flex items-start gap-4 mb-6">
                <Badge variant="secondary" className="text-sm font-body">س{index + 1}</Badge>
                <p className="text-xl font-body font-medium text-right flex-1" dir="rtl">
                  {qa.question}
                </p>
              </div>
              <div className="flex items-start gap-4 mr-12">
                <Badge variant="outline" className="text-sm bg-green-100 text-green-700 font-body">جواب</Badge>
                <p className="text-lg text-green-800 font-body text-right flex-1" dir="rtl">
                  {qa.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    { 
      id: 'conclusion', 
      label: 'خاتمة', 
      icon: Heart, 
      content: (
        <div className="content-box space-y-6">
          {currentTopic.content.conclusion && (
            <div className="bg-gradient-to-r from-rose-50 to-rose-100 p-8 rounded-2xl border-r-4 border-rose-400">
              <p className="text-xl font-body leading-loose text-right" dir="rtl">
                {currentTopic.content.conclusion}
              </p>
            </div>
          )}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border-r-4 border-gray-400">
            <p className="text-xl font-body leading-loose text-right" dir="rtl">
              {currentTopic.content.radioEnding}
            </p>
          </div>
        </div>
      )
    }
  ];

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
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                📖 {currentTopic.title}
              </h1>
              <div className="flex gap-2">
                <Badge variant="secondary">{currentTopic.category}</Badge>
                <Badge variant="outline">{genderText}</Badge>
                <Badge variant="outline">{levelText}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="btn-secondary">
                <Share2 className="w-4 h-4 ml-2" />
                مشاركة
              </Button>
              <Button onClick={handleBack} className="btn-primary">
                العودة للمواضيع
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* التبويبات */}
        <Card className="card-primary p-6 slide-up">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-secondary/50 p-2 rounded-xl mb-12">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                    activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-8">
                <div className="fade-in">
                  <div className="flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-r-4 border-primary">
                    <tab.icon className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">{tab.label}</h2>
                  </div>
                  <div className="prose max-w-none relative z-10">
                    {typeof tab.content === 'string' ? (
                      <div className="bg-gradient-to-r from-white to-secondary/30 p-8 rounded-2xl border border-border content-box">
                        <p className="text-xl font-body leading-loose text-right" dir="rtl">
                          {tab.content}
                        </p>
                      </div>
                    ) : (
                      tab.content
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default TopicViewer;