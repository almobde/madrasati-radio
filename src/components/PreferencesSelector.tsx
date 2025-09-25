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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
      <Card className="w-full max-w-5xl p-10 card-gradient shadow-elegant">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-gradient mb-6 leading-tight">
            🎙️ الإذاعة المدرسية
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-body leading-relaxed">
            اختر تفضيلاتك لتحصل على محتوى مناسب لك
          </p>
        </div>

        <div className="space-y-8 slide-up">
          {/* اختيار الجنس */}
          <div>
            <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">الجنس:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedGender(option.value)}
                  className={`p-8 rounded-3xl border-2 transition-all duration-500 hover:scale-[1.02] ${
                    selectedGender === option.value
                      ? option.value === 'boys' 
                        ? 'border-boys-primary bg-boys-gradient text-white shadow-elegant scale-105'
                        : 'border-girls-primary bg-girls-gradient text-white shadow-elegant scale-105'
                      : 'border-border bg-card hover:border-primary hover:shadow-card glass-effect'
                  }`}
                >
                  <option.icon className="w-10 h-10 mx-auto mb-4" />
                  <span className="text-2xl font-body font-semibold">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* اختيار المرحلة */}
          <div>
            <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">المرحلة الدراسية:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {levelOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedLevel(option.value)}
                  className={`p-8 rounded-3xl border-2 transition-all duration-500 text-center hover:scale-[1.02] ${
                    selectedLevel === option.value
                      ? 'border-primary bg-gradient-to-br from-primary to-primary-dark text-white shadow-elegant scale-105'
                      : 'tab-inactive glass-effect'
                  }`}
                >
                  <option.icon className="w-10 h-10 mx-auto mb-4" />
                  <div className="text-xl font-body font-semibold mb-2">{option.label}</div>
                  <div className="text-sm opacity-80 font-body">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* زر البدء */}
          <div className="text-center pt-8">
            <Button
              onClick={handleSubmit}
              disabled={!selectedGender || !selectedLevel}
              className="btn-primary text-2xl px-16 py-6 disabled:opacity-50 disabled:cursor-not-allowed font-body scale-in"
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