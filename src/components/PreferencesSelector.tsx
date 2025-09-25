// مكون اختيار التفضيلات - Preferences Selector Component
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPreferences, Gender, EducationLevel } from '../types';
import { useAppContext } from '../context/AppContext';
import { GraduationCap, Users, BookOpen, Star } from 'lucide-react';

const PreferencesSelector = () => {
  const { setPreferences } = useAppContext();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null);

  const handleSubmit = () => {
    if (selectedGender && selectedLevel) {
      setPreferences({ gender: selectedGender, educationLevel: selectedLevel });
    }
  };

  const genderOptions = [
    { 
      value: 'boys' as Gender, 
      label: 'بنين', 
      icon: Users,
      color: 'from-blue-400 to-blue-600'
    },
    { 
      value: 'girls' as Gender, 
      label: 'بنات', 
      icon: Star,
      color: 'from-pink-400 to-pink-600'
    }
  ];

  const levelOptions = [
    { 
      value: 'primary' as EducationLevel, 
      label: 'المرحلة الابتدائية', 
      description: 'محتوى مبسط وقصير',
      icon: BookOpen
    },
    { 
      value: 'middle' as EducationLevel, 
      label: 'المرحلة المتوسطة', 
      description: 'محتوى متوسط الطول',
      icon: GraduationCap
    },
    { 
      value: 'secondary' as EducationLevel, 
      label: 'المرحلة الثانوية', 
      description: 'محتوى مفصل وغني',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8 card-primary">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🎙️ الإذاعة المدرسية
          </h1>
          <p className="text-xl text-muted-foreground">
            اختر تفضيلاتك لتحصل على محتوى مناسب لك
          </p>
        </div>

        <div className="space-y-8 slide-up">
          {/* اختيار الجنس */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">الجنس:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedGender(option.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedGender === option.value
                      ? 'border-primary bg-gradient-to-r ' + option.color + ' text-white shadow-lg scale-105'
                      : 'border-border bg-card hover:border-primary hover:shadow-md'
                  }`}
                >
                  <option.icon className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-xl font-semibold">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* اختيار المرحلة */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">المرحلة الدراسية:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {levelOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedLevel(option.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-center ${
                    selectedLevel === option.value
                      ? 'tab-active shadow-lg scale-105'
                      : 'tab-inactive'
                  }`}
                >
                  <option.icon className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-lg font-semibold mb-1">{option.label}</div>
                  <div className="text-sm opacity-80">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* زر البدء */}
          <div className="text-center pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!selectedGender || !selectedLevel}
              className="btn-primary text-xl px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ابدأ التصفح 🚀
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PreferencesSelector;