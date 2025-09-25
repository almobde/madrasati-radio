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

  const tabs = [
    { 
      id: 'introduction', 
      label: 'مقدمة', 
      icon: BookOpen, 
      content: currentTopic.content.introduction 
    },
    { 
      id: 'quran', 
      label: 'آيات قرآنية', 
      icon: Sparkles, 
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-r-4 border-green-400">
            <p className="text-lg leading-relaxed mb-4">{currentTopic.content.quranVerse.text}</p>
            <p className="text-sm text-green-700 font-semibold">{currentTopic.content.quranVerse.reference}</p>
          </div>
        </div>
      )
    },
    { 
      id: 'hadith', 
      label: 'حديث نبوي', 
      icon: MessageCircle, 
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-r-4 border-blue-400">
            <p className="text-lg leading-relaxed mb-4">{currentTopic.content.hadith.text}</p>
            <p className="text-sm text-blue-700 font-semibold">{currentTopic.content.hadith.reference}</p>
          </div>
        </div>
      )
    },
    { 
      id: 'didyouknow', 
      label: 'هل تعلم؟', 
      icon: Lightbulb, 
      content: (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border-r-4 border-yellow-400">
          <p className="text-lg">{currentTopic.content.didYouKnow}</p>
        </div>
      )
    },
    { 
      id: 'morning-word', 
      label: 'كلمة صباحية', 
      icon: Mic, 
      content: (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-r-4 border-purple-400">
          <p className="text-lg leading-relaxed">{currentTopic.content.morningWord}</p>
        </div>
      )
    },
    { 
      id: 'poetry', 
      label: 'شعر وحكم', 
      icon: Quote, 
      content: (
        <div className="space-y-4">
          {currentTopic.content.poetry.map((line, index) => (
            <div key={index} className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border-r-4 border-indigo-400">
              <p className="text-lg font-medium italic">{line}</p>
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
        <div className="space-y-6">
          {currentTopic.content.questions.map((qa, index) => (
            <div key={index} className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3 mb-3">
                <Badge variant="secondary" className="text-xs">س{index + 1}</Badge>
                <p className="text-lg font-medium">{qa.question}</p>
              </div>
              <div className="flex items-start gap-3 mr-8">
                <Badge variant="outline" className="text-xs bg-green-100 text-green-700">جواب</Badge>
                <p className="text-base text-green-800">{qa.answer}</p>
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
        <div className="space-y-4">
          {currentTopic.content.conclusion && (
            <div className="bg-gradient-to-r from-rose-50 to-rose-100 p-6 rounded-lg border-r-4 border-rose-400">
              <p className="text-lg leading-relaxed">{currentTopic.content.conclusion}</p>
            </div>
          )}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border-r-4 border-gray-400">
            <p className="text-lg leading-relaxed">{currentTopic.content.radioEnding}</p>
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
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 bg-secondary/50 p-1 rounded-xl mb-6">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                    activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-6">
                <div className="fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <tab.icon className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">{tab.label}</h2>
                  </div>
                  <div className="prose max-w-none">
                    {typeof tab.content === 'string' ? (
                      <div className="bg-gradient-to-r from-white to-secondary/30 p-6 rounded-lg border border-border">
                        <p className="text-lg leading-relaxed">{tab.content}</p>
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