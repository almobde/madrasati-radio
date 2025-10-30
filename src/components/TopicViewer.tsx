// مكون عارض الموضوع الشامل - Complete Topic Viewer Component
import { useAppContext } from '../context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Home, BookOpen, Mic, Heart, Sparkles, Radio, Crown, Lightbulb, Quote, HelpCircle, MessageCircle, Download, Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Footer from './Footer';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

const TopicViewer = () => {
  const { currentTopic, setCurrentTopic, preferences, fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useAppContext();
  const { toast } = useToast();

  if (!currentTopic) return null;

  const handleBackToTopics = () => {
    setCurrentTopic(null);
  };

  const handleExportToPDF = async () => {
    try {
      toast({
        title: "جارِ التصدير...",
        description: "يرجى الانتظار حتى يتم إنشاء ملف PDF",
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // إنشاء عنصر مؤقت للمحتوى
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.right = '-9999px';
      tempContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '40px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(tempContainer);

      // إضافة العنوان الرئيسي
      const titleDiv = document.createElement('div');
      titleDiv.style.cssText = `
        text-align: center;
        padding: 30px 20px;
        background: linear-gradient(135deg, ${preferences?.gender === 'girls' ? '#e91e63, #9c27b0' : '#2196f3, #1976d2'});
        color: white;
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      `;
      titleDiv.innerHTML = `<h1 style="font-size: 32px; margin: 0; font-weight: bold;">${currentTopic.title}</h1>`;
      tempContainer.appendChild(titleDiv);

      // تجهيز الأقسام
      const sections = [
        { 
          title: 'المقدمة', 
          icon: '📖',
          content: getContentByLevel(currentTopic.content.introduction),
          color: preferences?.gender === 'girls' ? '#e91e63' : '#2196f3'
        },
        { 
          title: 'الآيات القرآنية', 
          icon: '📿',
          content: currentTopic.content.quranVerses.map(v => `<div style="text-align: center; margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;"><p style="font-size: 20px; line-height: 2; margin-bottom: 10px;">${v.text}</p><p style="color: #666; font-size: 14px;">${v.reference}</p></div>`).join(''),
          color: '#4caf50'
        },
        { 
          title: 'الأحاديث النبوية', 
          icon: '💬',
          content: currentTopic.content.hadiths.map(h => `<div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;"><p style="font-size: 18px; line-height: 1.8; margin-bottom: 10px;">${h.text}</p><p style="color: #666; font-size: 14px; text-align: center;">${h.reference}</p></div>`).join(''),
          color: '#ff9800'
        },
        { 
          title: 'هل تعلم', 
          icon: '💡',
          content: getContentByLevel(currentTopic.content.didYouKnow).map((f: string, i: number) => `<div style="margin: 15px 0; padding: 15px; background: #fff3cd; border-right: 4px solid #ffc107; border-radius: 8px;"><span style="font-weight: bold; color: #ff9800;">${i + 1}.</span> ${f}</div>`).join(''),
          color: '#ffc107'
        },
        { 
          title: 'كلمة الصباح', 
          icon: '🎤',
          content: getContentByLevel(currentTopic.content.morningWord),
          color: '#9c27b0'
        },
        { 
          title: 'منوعات', 
          icon: '✨',
          content: getContentByLevel(currentTopic.content.miscellaneous).map((m: any) => `<div style="margin: 20px 0; padding: 20px; background: #e3f2fd; border-radius: 8px;"><h3 style="color: #1976d2; margin-bottom: 10px;">${m.title}</h3><p style="line-height: 1.8;">${m.content}</p></div>`).join(''),
          color: '#03a9f4'
        },
        { 
          title: 'أسئلة وألغاز', 
          icon: '❓',
          content: getContentByLevel(currentTopic.content.questions).map((q: any) => `<div style="margin: 20px 0; padding: 20px; background: #f3e5f5; border-radius: 8px;"><p style="font-weight: bold; color: #7b1fa2; margin-bottom: 8px;">س: ${q.question}</p><p style="color: #4a148c;">ج: ${q.answer}</p></div>`).join(''),
          color: '#9c27b0'
        },
        { 
          title: 'الخاتمة', 
          icon: '🌟',
          content: `${currentTopic.content.conclusion || ''}<br><br>${currentTopic.content.radioEnding}`,
          color: '#f44336'
        },
      ];

      let yOffset = 0;

      // إضافة كل قسم كصورة
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        // إنشاء div للقسم
        const sectionDiv = document.createElement('div');
        sectionDiv.style.cssText = `
          margin-bottom: 30px;
          page-break-inside: avoid;
        `;
        
        sectionDiv.innerHTML = `
          <div style="
            background: ${section.color};
            color: white;
            padding: 15px 20px;
            border-radius: 8px 8px 0 0;
            font-size: 24px;
            font-weight: bold;
            text-align: right;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            ${section.icon} ${section.title}
          </div>
          <div style="
            background: white;
            padding: 25px;
            border: 2px solid ${section.color};
            border-top: none;
            border-radius: 0 0 8px 8px;
            text-align: right;
            line-height: 1.8;
            font-size: 16px;
            color: #333;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            ${section.content}
          </div>
        `;
        
        tempContainer.appendChild(sectionDiv);
      }

      // التقاط صورة للمحتوى الكامل
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // حذف العنصر المؤقت
      document.body.removeChild(tempContainer);

      // حساب الأبعاد
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // إضافة الصورة إلى PDF مع تقسيمها على صفحات متعددة إذا لزم الأمر
      let heightLeft = imgHeight;
      let position = 0;

      // إضافة الصفحة الأولى
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight - 2 * margin;

      // إضافة صفحات إضافية إذا كان المحتوى أطول من صفحة واحدة
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight - 2 * margin;
      }

      pdf.save(`${currentTopic.title}.pdf`);
      
      toast({
        title: "تم التصدير بنجاح! ✅",
        description: "تم حفظ الملف على جهازك",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء إنشاء ملف PDF",
        variant: "destructive",
      });
    }
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

هل تعلم:
${getContentByLevel(currentTopic.content.didYouKnow).join('\n')}

كلمة الصباح:
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
              <span className="text-xs">هل تعلم</span>
            </TabsTrigger>
            <TabsTrigger 
              value="morningWord" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <Mic className="w-4 h-4 mb-1" />
              <span className="text-xs">كلمة الصباح</span>
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
              <span className="text-xs">أسئلة وألغاز</span>
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

            {/* هل تعلم */}
            <TabsContent value="didYouKnow" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-[hsl(var(--primary))]" />
                    هل تعلم؟
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
                    كلمة الصباح
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

            {/* أسئلة وألغاز */}
            <TabsContent value="questions" className="fade-in">
              <ModernCard variant="luxury" padding="lg">
                <ModernCardHeader>
                  <ModernCardTitle className="text-2xl flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-[hsl(var(--primary))]" />
                    أسئلة وألغاز
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