// مكون عارض الموضوع الشامل - Complete Topic Viewer Component
import { useAppContext } from '../context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Home, BookOpen, Mic, Heart, Sparkles, Radio, Crown, Lightbulb, Quote, HelpCircle, MessageCircle, Download, Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Footer from './Footer';
import { useToast } from '@/hooks/use-toast';

const TopicViewer = () => {
  const { currentTopic, setCurrentTopic, preferences, fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useAppContext();
  const { toast } = useToast();

  if (!currentTopic) return null;

  const handleBackToTopics = () => {
    setCurrentTopic(null);
  };

  const handleExportToPDF = () => {
    toast({
      title: "جارِ التحضير للطباعة...",
      description: "يتم تجهيز جميع المحاور",
    });

    // إنشاء نافذة جديدة للطباعة
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const themeColor = preferences?.gender === 'girls' ? '#e91e63' : '#2196f3';
    
    // بناء HTML الكامل
    let html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>${currentTopic.title}</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px; 
            background: white;
            color: #333;
            font-size: 18px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: ${themeColor};
            color: white;
            border-radius: 12px;
            border: 3px solid ${themeColor};
          }
          .header h1 { margin: 0; font-size: 38px; }
          .header p { margin: 10px 0 0 0; font-size: 20px; }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
            border: 3px solid ${themeColor};
            border-radius: 12px;
          }
          .section-title {
            background: ${themeColor};
            color: white;
            padding: 18px 25px;
            font-size: 26px;
            font-weight: bold;
            border-radius: 9px 9px 0 0;
          }
          .section-content {
            padding: 30px;
            background: white;
            border-radius: 0 0 9px 9px;
            line-height: 2;
            font-size: 19px;
          }
          .verse, .hadith {
            background: #f5f5f5;
            padding: 25px;
            margin: 20px 0;
            border-radius: 10px;
            text-align: center;
            border: 2px solid #e0e0e0;
          }
          .verse-text { font-size: 24px; line-height: 2.2; margin-bottom: 15px; font-weight: 500; }
          .reference { color: #666; font-size: 17px; margin-top: 12px; font-weight: 600; }
          .fact { 
            margin: 18px 0; 
            padding: 20px; 
            background: #fff3cd; 
            border-right: 5px solid #ffc107;
            border-radius: 10px;
            font-size: 18px;
            border: 2px solid #ffc107;
          }
          @media print {
            body { padding: 20px; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${currentTopic.title}</h1>
          <p>محتوى إذاعي شامل ومتكامل</p>
        </div>
    `;

    // المقدمة
    html += `
      <div class="section">
        <div class="section-title">📖 المقدمة</div>
        <div class="section-content">
          <p>${getContentByLevel(currentTopic.content.introduction)}</p>
        </div>
      </div>
    `;

    // الآيات القرآنية
    html += `
      <div class="section">
        <div class="section-title">📿 الآيات القرآنية</div>
        <div class="section-content">
    `;
    currentTopic.content.quranVerses.forEach(verse => {
      html += `
        <div class="verse">
          <div class="verse-text">${verse.text}</div>
          <div class="reference">${verse.reference}</div>
        </div>
      `;
    });
    html += `</div></div>`;

    // الأحاديث
    html += `
      <div class="section">
        <div class="section-title">💬 الأحاديث النبوية</div>
        <div class="section-content">
    `;
    currentTopic.content.hadiths.forEach(hadith => {
      html += `
        <div class="hadith">
          <p>${hadith.text}</p>
          <div class="reference">${hadith.reference}</div>
        </div>
      `;
    });
    html += `</div></div>`;

    // معلومات
    html += `
      <div class="section">
        <div class="section-title">💡 معلومات</div>
        <div class="section-content">
    `;
    getContentByLevel(currentTopic.content.didYouKnow).forEach((fact: string, i: number) => {
      html += `<div class="fact"><strong>${i + 1}.</strong> ${fact}</div>`;
    });
    html += `</div></div>`;

    // كلمة
    html += `
      <div class="section">
        <div class="section-title">🎤 كلمة</div>
        <div class="section-content">
          <p>${getContentByLevel(currentTopic.content.morningWord)}</p>
        </div>
      </div>
    `;

    // منوعات
    if (currentTopic.content.miscellaneous && getContentByLevel(currentTopic.content.miscellaneous).length > 0) {
      html += `
        <div class="section">
          <div class="section-title">✨ منوعات</div>
          <div class="section-content">
      `;
      getContentByLevel(currentTopic.content.miscellaneous).forEach((item: any) => {
        html += `
          <div style="margin: 20px 0;">
            <h3 style="color: ${themeColor};">${item.title}</h3>
            <p>${item.content}</p>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    // أسئلة
    if (currentTopic.content.questions && getContentByLevel(currentTopic.content.questions).length > 0) {
      html += `
        <div class="section">
          <div class="section-title">❓ أسئلة</div>
          <div class="section-content">
      `;
      getContentByLevel(currentTopic.content.questions).forEach((q: any) => {
        html += `
          <div style="margin: 20px 0; padding: 20px; background: #f3e5f5; border-radius: 8px;">
            <p style="font-weight: bold; color: #7b1fa2;">س: ${q.question}</p>
            <p style="color: #4a148c; margin-top: 10px;">ج: ${q.answer}</p>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    // الخاتمة
    html += `
      <div class="section">
        <div class="section-title">🌟 الخاتمة</div>
        <div class="section-content">
          <p>${currentTopic.content.conclusion || ''}</p>
          <p style="margin-top: 20px;">${currentTopic.content.radioEnding}</p>
        </div>
      </div>
    `;

    html += `
      </body>
      </html>
    `;

    // كتابة المحتوى للنافذة الجديدة
    printWindow.document.write(html);
    printWindow.document.close();

    // انتظار تحميل المحتوى ثم طباعة
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        toast({
          title: "جاهز للطباعة! 📄",
          description: "اختر 'حفظ كـ PDF' من خيارات الطباعة",
        });
      }, 500);
    };
  };

  const handleShare = () => {
    const content = `
إذاعة مدرسية - ${currentTopic.title}

المقدمة:
${getContentByLevel(currentTopic.content.introduction)}

الآيات القرآنية:
${currentTopic.content.quranVerses.map(v => `${v.text}\n(${v.reference})`).join('\n\n')}

الأحاديث النبوية:
${currentTopic.content.hadiths.map(h => `${h.text}\n(${h.reference})`).join('\n\n')}

معلومات:
${getContentByLevel(currentTopic.content.didYouKnow).join('\n')}

كلمة:
${getContentByLevel(currentTopic.content.morningWord)}

الخاتمة:
${currentTopic.content.radioEnding}
    `.trim();

    // مشاركة عبر واتساب
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(content)}`;
    
    // مشاركة عبر البريد الإلكتروني
    const emailSubject = encodeURIComponent(`إذاعة مدرسية - ${currentTopic.title}`);
    const emailBody = encodeURIComponent(content);
    const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;

    // عرض خيارات المشاركة
    const shareOption = confirm("اختر طريقة المشاركة:\nموافق = واتساب\nإلغاء = البريد الإلكتروني");
    
    if (shareOption) {
      window.open(whatsappUrl, '_blank');
    } else {
      window.location.href = emailUrl;
    }
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

  return (
    <div className={`min-h-screen p-4 transition-all duration-700 ${preferences?.gender === 'girls' ? 'bg-gradient-to-br from-[hsl(330,70%,30%)] via-[hsl(320,80%,40%)] to-[hsl(310,90%,50%)]' : 'bg-gradient-to-br from-[hsl(220,70%,25%)] via-[hsl(210,80%,35%)] to-[hsl(200,90%,45%)]'}`}>
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="mb-8 fade-in">
          <ModernCard variant="glass" padding="lg" className="mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-right flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <Radio className="w-8 h-8 text-[hsl(var(--primary))]" />
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient leading-tight">
                      {currentTopic.title}
                    </h1>
                    <Crown className="w-8 h-8 text-[hsl(var(--primary))]" />
                  </div>
                  <p className="text-base text-muted-foreground font-body">
                    محتوى إذاعي شامل ومتكامل
                  </p>
                </div>
              <ModernButton 
                variant="glass" 
                size="sm"
                onClick={handleBackToTopics}
                className="font-body"
                title="العودة للمواضيع"
              >
                <Home className="w-5 h-5" />
              </ModernButton>
              </div>
              
              {/* أزرار التحكم */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center">
                <ModernButton 
                  variant="glass" 
                  size="sm"
                  onClick={handleExportToPDF}
                  className="font-body"
                  title="تصدير PDF"
                >
                  <Download className="w-5 h-5" />
                </ModernButton>
                <ModernButton 
                  variant="glass" 
                  size="sm"
                  onClick={handleShare}
                  className="font-body"
                  title="مشاركة"
                >
                  <Share2 className="w-5 h-5" />
                </ModernButton>
                <div className="flex gap-1">
                  <ModernButton 
                    variant="glass" 
                    size="sm"
                    onClick={decreaseFontSize}
                    className="font-body"
                    title="تصغير الخط"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </ModernButton>
                  <ModernButton 
                    variant="glass" 
                    size="sm"
                    onClick={resetFontSize}
                    className="font-body"
                    title="إعادة ضبط الخط"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </ModernButton>
                  <ModernButton 
                    variant="glass" 
                    size="sm"
                    onClick={increaseFontSize}
                    className="font-body"
                    title="تكبير الخط"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </ModernButton>
                </div>
                <span className="text-sm text-muted-foreground self-center">
                  {fontSize}%
                </span>
              </div>
            </div>
          </ModernCard>
        </div>

        {/* التبويبات الثمانية */}
        <Tabs defaultValue="introduction" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent p-2 h-auto mb-8">
            <TabsTrigger 
              value="introduction" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <BookOpen className="w-4 h-4 mb-1" />
              <span className="text-xs">المقدمة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="verses" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <Heart className="w-4 h-4 mb-1" />
              <span className="text-xs">الآيات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="hadith" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <MessageCircle className="w-4 h-4 mb-1" />
              <span className="text-xs">الحديث</span>
            </TabsTrigger>
            <TabsTrigger 
              value="didYouKnow" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <Lightbulb className="w-4 h-4 mb-1" />
              <span className="text-xs">معلومات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="morningWord" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <Mic className="w-4 h-4 mb-1" />
              <span className="text-xs">كلمة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="miscellaneous" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <Sparkles className="w-4 h-4 mb-1" />
              <span className="text-xs">منوعات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="questions" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <HelpCircle className="w-4 h-4 mb-1" />
              <span className="text-xs">أسئلة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="conclusion" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <Sparkles className="w-4 h-4 mb-1" />
              <span className="text-xs">الخاتمة</span>
            </TabsTrigger>
          </TabsList>

          {/* محتوى التبويبات */}
          <div className="tabs-content-safe">
            {/* المقدمة */}
            <TabsContent value="introduction" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-[hsl(var(--primary))]" />
                    مقدمة عن {currentTopic.title}
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <p className="text-base font-body leading-relaxed text-foreground">
                    {getContentByLevel(currentTopic.content.introduction)}
                  </p>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* الآيات القرآنية */}
            <TabsContent value="verses" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Heart className="w-6 h-6 text-[hsl(var(--primary))]" />
                    آيات قرآنية كريمة
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-6">
                    {currentTopic.content.quranVerses.map((verse, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-0">
                        <p className="text-xl font-heading leading-loose text-foreground text-center mb-4">
                          {verse.text}
                        </p>
                        <p className="text-sm text-[hsl(var(--primary))] font-semibold text-center">
                          {verse.reference}
                        </p>
                      </div>
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* الحديث الشريف */}
            <TabsContent value="hadith" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-[hsl(var(--primary))]" />
                    أحاديث شريفة
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-6">
                    {currentTopic.content.hadiths.map((hadith, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-0">
                        <p className="text-lg font-body leading-loose text-foreground mb-4">
                          {hadith.text}
                        </p>
                        <p className="text-sm text-[hsl(var(--primary))] font-semibold text-center">
                          {hadith.reference}
                        </p>
                      </div>
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* معلومات */}
            <TabsContent value="didYouKnow" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-[hsl(var(--primary))]" />
                    معلومات
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-4">
                    {getContentByLevel(currentTopic.content.didYouKnow).map((fact: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-1">
                          {index + 1}
                        </div>
                        <p className="text-base font-body leading-relaxed text-right flex-1">
                          {fact}
                        </p>
                      </div>
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* كلmة الصباح */}
            <TabsContent value="morningWord" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Mic className="w-6 h-6 text-[hsl(var(--primary))]" />
                    كلمة
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="mb-4 text-xs text-[hsl(var(--primary))] font-medium bg-[hsl(var(--primary))]/10 rounded-full py-1 px-3 inline-block">
                    طول النص: {getContentByLevel(currentTopic.content.morningWord).length} حرف
                  </div>
                  <p className="text-base font-body leading-relaxed text-foreground">
                    {getContentByLevel(currentTopic.content.morningWord)}
                  </p>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* منوعات */}
            <TabsContent value="miscellaneous" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
                    منوعات
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-6">
                    {getContentByLevel(currentTopic.content.miscellaneous).map((item: any, index: number) => (
                      <div key={index}>
                        <div className="mb-3">
                          <Badge variant="secondary" className="text-xs font-body">
                            {item.type === 'story' ? 'قصة' : item.type === 'dua' ? 'دعاء' : item.type === 'medical' ? 'نصيحة طبية' : 'موضوع'}
                          </Badge>
                        </div>
                        <h4 className="text-lg font-heading font-bold mb-3 text-right">
                          {item.title}
                        </h4>
                        <p className="text-base font-body leading-relaxed text-right">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* أسئلة */}
            <TabsContent value="questions" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-[hsl(var(--primary))]" />
                    أسئلة
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-6">
                    {getContentByLevel(currentTopic.content.questions).map((qa: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-start gap-3 mb-4">
                          <Badge variant="secondary" className="text-xs font-body">س{index + 1}</Badge>
                          <p className="text-base font-body font-medium text-right flex-1">
                            {qa.question}
                          </p>
                        </div>
                        <div className="flex items-start gap-3 mr-8">
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 font-body">جواب</Badge>
                          <p className="text-sm text-green-800 font-body text-right flex-1">
                            {qa.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>

            {/* الخاتمة */}
            <TabsContent value="conclusion" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
                    خاتمة الإذاعة
                  </ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-4">
                    {currentTopic.content.conclusion && (
                      <p className="text-base font-body leading-relaxed text-right">
                        {currentTopic.content.conclusion}
                      </p>
                    )}
                    <p className="text-base font-body leading-relaxed text-right">
                      {currentTopic.content.radioEnding}
                    </p>
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>
          </div>
        </Tabs>
        
        {/* التذييل */}
        <Footer />
      </div>
    </div>
  );
};

export default TopicViewer;