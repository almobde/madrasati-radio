// مكون اختيار التفضيلات الجديد - New Modern Preferences Selector
import { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { UserPreferences, Gender, EducationLevel } from '../types';
import { useAppContext } from '../context/AppContext';
import { GraduationCap, Users, BookOpen, Star, Sparkles, Crown, Gem } from 'lucide-react';

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
      icon: Crown,
      gradient: 'bg-boys-gradient',
      description: 'تصميم احترافي للطلاب'
    },
    { 
      value: 'girls' as Gender, 
      label: 'بنات', 
      icon: Gem,
      gradient: 'bg-girls-gradient',
      description: 'تصميم أنيق للطالبات'
    }
  ];

  const levelOptions = [
    { 
      value: 'primary' as EducationLevel, 
      label: 'ابتدائي', 
      description: 'كلمات بسيطة ومحتوى قصير مناسب للأطفال',
      icon: BookOpen,
      color: 'from-green-400 to-green-600'
    },
    { 
      value: 'middle' as EducationLevel, 
      label: 'متوسط', 
      description: 'محتوى متوسط الطول مع تفاصيل أكثر',
      icon: GraduationCap,
      color: 'from-blue-400 to-blue-600'
    },
    { 
      value: 'secondary' as EducationLevel, 
      label: 'ثانوي', 
      description: 'محتوى غني ومفصل مع مفاهيم متقدمة',
      icon: Users,
      color: 'from-purple-400 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-t from-sky-200 to-blue-500 flex items-center justify-center">
      <ModernCard variant="luxury" padding="xl" className="w-full h-full min-h-screen rounded-none">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-joyel font-bold text-gradient leading-tight mb-6">
            الإذاعة المدرسية
          </h1>
        </div>

        <div className="space-y-10 slide-up max-w-4xl mx-auto">
          {/* اختيار نوع المدرسة */}
          <div>
            <h2 className="text-3xl font-heading font-bold mb-6 text-center text-gradient">نوع المدرسة</h2>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {genderOptions.map((option) => (
                <ModernCard
                  key={option.value}
                  variant="glass"  
                  padding="sm"
                  className={`cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                    selectedGender === option.value
                      ? option.value === 'boys' 
                        ? 'border-3 border-boys-primary shadow-[0_0_30px_hsl(var(--boys-primary))/25] scale-[1.01]'
                        : 'border-3 border-girls-primary shadow-[0_0_30px_hsl(var(--girls-primary))/25] scale-[1.01]'
                      : 'border-2 border-[hsl(var(--primary))]/20 hover:border-[hsl(var(--primary))]/40'
                  }`}
                  onClick={() => setSelectedGender(option.value)}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-full ${option.gradient} flex items-center justify-center shadow-lg`}>
                      <option.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-joyel font-bold text-foreground">{option.label}</h3>
                  </div>
                </ModernCard>
              ))}
            </div>
          </div>

          {/* اختيار المرحلة الدراسية */}
          <div>
            <h2 className="text-3xl font-heading font-bold mb-6 text-center text-gradient">المرحلة الدراسية</h2>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {levelOptions.map((option) => (
                <div
                  key={option.value}
                  className={`cursor-pointer text-center transition-all duration-300 hover:scale-105 p-5 rounded-xl ${
                    selectedLevel === option.value
                      ? `bg-gradient-to-r ${option.color} shadow-lg scale-105`
                      : 'bg-white/70 hover:bg-white/90 shadow-md'
                  }`}
                  onClick={() => setSelectedLevel(option.value)}
                >
                  <div className="flex items-center justify-center h-full">
                    <h3 className={`text-lg font-joyel font-bold whitespace-nowrap ${
                      selectedLevel === option.value ? 'text-white' : 'text-foreground'
                    }`}>
                      {option.label}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* زر البدء الفاخر */}
          <div className="text-center pt-12">
            <ModernButton
              onClick={handleSubmit}
              disabled={!selectedGender || !selectedLevel}
              variant="premium"
              size="xl"
              className="disabled:opacity-50 disabled:cursor-not-allowed font-body scale-in shadow-2xl"
            >
              <Sparkles className="w-6 h-6" />
              ابدأ الرحلة الإعلامية
              <Sparkles className="w-6 h-6" />
            </ModernButton>
            {selectedGender && selectedLevel && (
              <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                ✨ جاهز للانطلاق نحو تجربة إذاعية مميزة!
              </p>
            )}
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default PreferencesSelector;