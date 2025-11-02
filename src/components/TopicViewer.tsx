// مكون عارض الموضوع الشامل - Complete Topic Viewer Component
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight, Home, BookOpen, Mic, Heart, Sparkles, Radio, Crown, Lightbulb, Quote, HelpCircle, MessageCircle, Download, Share2, Settings, Edit, Copy, AlertCircle } from 'lucide-react';
import Footer from './Footer';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReportTopicDialog } from './ReportTopicDialog';

const TopicViewer = () => {
  const { currentTopic, setCurrentTopic, preferences } = useAppContext();
  const { toast } = useToast();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const isMobile = useIsMobile();

  if (!currentTopic) return null;

  const handleBackToTopics = () => {
    setCurrentTopic(null);
  };

  const handleEditTopic = () => {
    toast({
      title: "قريباً",
      description: "خاصية التعديل قيد التطوير",
    });
  };

  const handleCopyContent = async () => {
    // بناء المحتوى بشكل آمن
    let content = `📻 إذاعة مدرسية - ${currentTopic.title}\n\n`;

    // المقدمة
    const intro = getContentByLevel(currentTopic.content.introduction);
    if (intro) {
      content += `📖 المقدمة:\n${intro}\n\n`;
    }

    // الآيات القرآنية
    if (currentTopic.content.quranVerses && currentTopic.content.quranVerses.length > 0) {
      content += `📿 الآيات القرآنية:\n`;
      currentTopic.content.quranVerses.forEach((v, i) => {
        if (v.text) {
          content += `${i + 1}. ${v.text}\n`;
          if (v.reference) content += `   (${v.reference})\n`;
        }
      });
      content += '\n';
    }

    // الأحاديث النبوية
    if (currentTopic.content.hadiths && currentTopic.content.hadiths.length > 0) {
      content += `💬 الأحاديث النبوية:\n`;
      currentTopic.content.hadiths.forEach((h, i) => {
        if (h.text) {
          content += `${i + 1}. ${h.text}\n`;
          if (h.reference) content += `   (${h.reference})\n`;
        }
      });
      content += '\n';
    }

    // معلومات
    const facts = getContentByLevel(currentTopic.content.didYouKnow);
    if (facts && Array.isArray(facts) && facts.length > 0) {
      content += `💡 معلومات:\n`;
      facts.forEach((fact: string, i: number) => {
        if (fact) content += `${i + 1}. ${fact}\n`;
      });
      content += '\n';
    }

    // كلمة
    const morningWord = getContentByLevel(currentTopic.content.morningWord);
    if (morningWord) {
      content += `🎤 كلمة:\n${morningWord}\n\n`;
    }

    // منوعات
    const misc = currentTopic.content.miscellaneous ? getContentByLevel(currentTopic.content.miscellaneous) : null;
    if (misc && Array.isArray(misc) && misc.length > 0) {
      content += `✨ منوعات:\n`;
      misc.forEach((item: any, i: number) => {
        if (item && item.title && item.content) {
          content += `${i + 1}. ${item.title}\n   ${item.content}\n`;
        }
      });
      content += '\n';
    }

    // أسئلة
    const questions = currentTopic.content.questions ? getContentByLevel(currentTopic.content.questions) : null;
    if (questions && Array.isArray(questions) && questions.length > 0) {
      content += `❓ أسئلة:\n`;
      questions.forEach((q: any, i: number) => {
        if (q && q.question && q.answer) {
          content += `${i + 1}. س: ${q.question}\n   ج: ${q.answer}\n`;
        }
      });
      content += '\n';
    }

    // الخاتمة
    if (currentTopic.content.radioEnding) {
      content += `🌟 الخاتمة:\n${currentTopic.content.radioEnding}`;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "تم النسخ! 📋",
        description: "تم نسخ المحتوى بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ المحتوى",
        variant: "destructive",
      });
    }
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
    const lightTheme = preferences?.gender === 'girls' ? '#fce4ec' : '#e3f2fd';
    
    // بناء HTML الكامل
    let html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>${currentTopic.title}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 30px; 
            background: linear-gradient(135deg, ${lightTheme} 0%, white 100%);
            color: #2c3e50;
            font-size: 16px;
            line-height: 1.8;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 40px 30px;
            background: linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%);
            color: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .header h1 { 
            margin: 0 0 15px 0; 
            font-size: 42px; 
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .header p { 
            margin: 0; 
            font-size: 20px; 
            opacity: 0.95;
            font-weight: 300;
          }
          .section {
            margin-bottom: 35px;
            page-break-inside: avoid;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border: 1px solid #e0e0e0;
          }
          .section-title {
            background: linear-gradient(135deg, ${themeColor} 0%, ${themeColor}cc 100%);
            color: white;
            padding: 20px 30px;
            font-size: 24px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .section-content {
            padding: 35px;
            background: white;
            line-height: 2;
            font-size: 17px;
          }
          .verse, .hadith {
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            padding: 30px;
            margin: 25px 0;
            border-radius: 12px;
            text-align: center;
            border: 2px solid ${themeColor}40;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .verse-text { 
            font-size: 22px; 
            line-height: 2.3; 
            margin-bottom: 18px; 
            font-weight: 600;
            color: #1a237e;
          }
          .reference { 
            color: ${themeColor}; 
            font-size: 16px; 
            margin-top: 15px; 
            font-weight: 700;
            padding: 8px 16px;
            background: ${themeColor}15;
            border-radius: 20px;
            display: inline-block;
          }
          .fact { 
            margin: 20px 0; 
            padding: 22px 25px; 
            background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%); 
            border-right: 6px solid #ffc107;
            border-radius: 12px;
            font-size: 17px;
            box-shadow: 0 2px 8px rgba(255,193,7,0.15);
            display: flex;
            gap: 15px;
            align-items: flex-start;
          }
          .fact strong {
            color: #f57c00;
            font-size: 20px;
            min-width: 30px;
          }
          .misc-item {
            margin: 25px 0;
            padding: 25px;
            background: linear-gradient(135deg, ${lightTheme} 0%, white 100%);
            border-radius: 12px;
            border-right: 5px solid ${themeColor};
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .misc-item h3 {
            color: ${themeColor};
            font-size: 20px;
            margin-bottom: 15px;
            font-weight: 700;
          }
          .misc-item p {
            color: #424242;
            line-height: 1.9;
          }
          .question-item {
            margin: 25px 0;
            padding: 25px;
            background: linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%);
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(123,31,162,0.1);
          }
          .question-text {
            font-weight: 700;
            color: #7b1fa2;
            font-size: 18px;
            margin-bottom: 12px;
            padding-right: 25px;
            position: relative;
          }
          .question-text::before {
            content: 'س:';
            position: absolute;
            right: 0;
            font-weight: 900;
          }
          .answer-text {
            color: #4a148c;
            font-size: 17px;
            line-height: 1.9;
            padding: 18px;
            background: white;
            border-radius: 8px;
            border-right: 4px solid #9c27b0;
          }
          @media print {
            body { 
              padding: 15px; 
              background: white;
            }
            .section { 
              page-break-inside: avoid;
              box-shadow: none;
            }
            .header {
              box-shadow: none;
            }
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
    const introContent = getContentByLevel(currentTopic.content.introduction);
    if (introContent) {
      html += `
        <div class="section">
          <div class="section-title">📖 المقدمة</div>
          <div class="section-content">
            <p>${introContent}</p>
          </div>
        </div>
      `;
    }

    // الآيات القرآنية
    if (currentTopic.content.quranVerses && currentTopic.content.quranVerses.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">📿 الآيات القرآنية</div>
          <div class="section-content">
      `;
      currentTopic.content.quranVerses.forEach(verse => {
        html += `
          <div class="verse">
            <div class="verse-text">${verse.text || ''}</div>
            <div class="reference">${verse.reference || ''}</div>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    // الأحاديث
    if (currentTopic.content.hadiths && currentTopic.content.hadiths.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">💬 الأحاديث النبوية</div>
          <div class="section-content">
      `;
      currentTopic.content.hadiths.forEach(hadith => {
        html += `
          <div class="hadith">
            <p>${hadith.text || ''}</p>
            <div class="reference">${hadith.reference || ''}</div>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    // معلومات
    const facts = getContentByLevel(currentTopic.content.didYouKnow);
    if (facts && Array.isArray(facts) && facts.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">💡 معلومات</div>
          <div class="section-content">
      `;
      facts.forEach((fact: string, i: number) => {
        if (fact) {
          html += `<div class="fact"><strong>${i + 1}.</strong><span>${fact}</span></div>`;
        }
      });
      html += `</div></div>`;
    }

    // كلمة
    const morningWord = getContentByLevel(currentTopic.content.morningWord);
    if (morningWord) {
      html += `
        <div class="section">
          <div class="section-title">🎤 كلمة</div>
          <div class="section-content">
            <p>${morningWord}</p>
          </div>
        </div>
      `;
    }

    // منوعات
    const miscellaneous = currentTopic.content.miscellaneous ? getContentByLevel(currentTopic.content.miscellaneous) : null;
    if (miscellaneous && Array.isArray(miscellaneous) && miscellaneous.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">✨ منوعات</div>
          <div class="section-content">
      `;
      miscellaneous.forEach((item: any) => {
        if (item && item.title && item.content) {
          html += `
            <div class="misc-item">
              <h3>${item.title}</h3>
              <p>${item.content}</p>
            </div>
          `;
        }
      });
      html += `</div></div>`;
    }

    // أسئلة
    const questions = currentTopic.content.questions ? getContentByLevel(currentTopic.content.questions) : null;
    if (questions && Array.isArray(questions) && questions.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">❓ أسئلة</div>
          <div class="section-content">
      `;
      questions.forEach((q: any) => {
        if (q && q.question && q.answer) {
          html += `
            <div class="question-item">
              <p class="question-text">${q.question}</p>
              <p class="answer-text">${q.answer}</p>
            </div>
          `;
        }
      });
      html += `</div></div>`;
    }

    // الخاتمة
    html += `
      <div class="section">
        <div class="section-title">🌟 الخاتمة</div>
        <div class="section-content">
          ${currentTopic.content.conclusion ? `<p style="margin-bottom: 20px;">${currentTopic.content.conclusion}</p>` : ''}
          <p>${currentTopic.content.radioEnding || ''}</p>
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
    // بناء المحتوى بشكل آمن
    let content = `📻 إذاعة مدرسية - ${currentTopic.title}\n\n`;

    // المقدمة
    const intro = getContentByLevel(currentTopic.content.introduction);
    if (intro) {
      content += `📖 المقدمة:\n${intro}\n\n`;
    }

    // الآيات القرآنية
    if (currentTopic.content.quranVerses && currentTopic.content.quranVerses.length > 0) {
      content += `📿 الآيات القرآنية:\n`;
      currentTopic.content.quranVerses.forEach((v, i) => {
        if (v.text) {
          content += `${i + 1}. ${v.text}\n`;
          if (v.reference) content += `   (${v.reference})\n`;
        }
      });
      content += '\n';
    }

    // الأحاديث النبوية
    if (currentTopic.content.hadiths && currentTopic.content.hadiths.length > 0) {
      content += `💬 الأحاديث النبوية:\n`;
      currentTopic.content.hadiths.forEach((h, i) => {
        if (h.text) {
          content += `${i + 1}. ${h.text}\n`;
          if (h.reference) content += `   (${h.reference})\n`;
        }
      });
      content += '\n';
    }

    // معلومات
    const facts = getContentByLevel(currentTopic.content.didYouKnow);
    if (facts && Array.isArray(facts) && facts.length > 0) {
      content += `💡 معلومات:\n`;
      facts.forEach((fact: string, i: number) => {
        if (fact) content += `${i + 1}. ${fact}\n`;
      });
      content += '\n';
    }

    // كلمة
    const morningWord = getContentByLevel(currentTopic.content.morningWord);
    if (morningWord) {
      content += `🎤 كلمة:\n${morningWord}\n\n`;
    }

    // منوعات
    const misc = currentTopic.content.miscellaneous ? getContentByLevel(currentTopic.content.miscellaneous) : null;
    if (misc && Array.isArray(misc) && misc.length > 0) {
      content += `✨ منوعات:\n`;
      misc.forEach((item: any, i: number) => {
        if (item && item.title && item.content) {
          content += `${i + 1}. ${item.title}\n   ${item.content}\n`;
        }
      });
      content += '\n';
    }

    // أسئلة
    const questions = currentTopic.content.questions ? getContentByLevel(currentTopic.content.questions) : null;
    if (questions && Array.isArray(questions) && questions.length > 0) {
      content += `❓ أسئلة:\n`;
      questions.forEach((q: any, i: number) => {
        if (q && q.question && q.answer) {
          content += `${i + 1}. س: ${q.question}\n   ج: ${q.answer}\n`;
        }
      });
      content += '\n';
    }

    // الخاتمة
    if (currentTopic.content.radioEnding) {
      content += `🌟 الخاتمة:\n${currentTopic.content.radioEnding}`;
    }

    // عرض خيارات المشاركة مباشرة
    const shareChoice = confirm("اختر طريقة المشاركة:\n\n✅ موافق = واتساب\n❌ إلغاء = البريد الإلكتروني");
    
    if (shareChoice) {
      // مشاركة عبر واتساب
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`;
      window.open(whatsappUrl, '_blank');
      toast({
        title: "تم فتح واتساب 💚",
        description: "يمكنك الآن اختيار جهة الاتصال",
      });
    } else {
      // مشاركة عبر البريد الإلكتروني
      const emailSubject = encodeURIComponent(`إذاعة مدرسية - ${currentTopic.title}`);
      const emailBody = encodeURIComponent(content);
      const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
      window.location.href = emailUrl;
      toast({
        title: "تم فتح البريد الإلكتروني 📧",
        description: "يمكنك الآن إرسال الرسالة",
      });
    }
  };

  // دالة للحصول على المحتوى حسب المرحلة التعليمية
  const getContentByLevel = (content: any) => {
    // التحقق من وجود المحتوى أولاً
    if (!content) return null;
    
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
              </div>
              
              {/* أزرار التحكم - سطران للجوال */}
              <div className="grid grid-cols-3 md:flex gap-2 justify-center md:justify-start items-center">
                {/* السطر الأول */}
                <ModernButton 
                  variant="glass" 
                  size="sm"
                  onClick={handleBackToTopics}
                  className={`font-body ${preferences?.gender === 'girls' ? 'bg-[#e91e63] hover:bg-[#c2185b]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                  title="الرئيسية"
                >
                  <Home className="w-5 h-5" />
                </ModernButton>
                <ModernButton 
                  variant="glass" 
                  size="sm"
                  onClick={handleExportToPDF}
                  className={`font-body ${preferences?.gender === 'girls' ? 'bg-[#e91e63] hover:bg-[#c2185b]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                  title="تصدير"
                >
                  <Download className="w-5 h-5" />
                </ModernButton>
                <ModernButton 
                  variant="glass" 
                  size="sm"
                  onClick={handleCopyContent}
                  className={`font-body ${preferences?.gender === 'girls' ? 'bg-[#e91e63] hover:bg-[#c2185b]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                  title="نسخ"
                >
                  <Copy className="w-5 h-5" />
                </ModernButton>
                
                {/* السطر الثاني */}
                {isMobile && (
                  <ModernButton 
                    variant="glass" 
                    size="sm"
                    onClick={handleShare}
                    className={`font-body ${preferences?.gender === 'girls' ? 'bg-[#e91e63] hover:bg-[#c2185b]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                    title="مشاركة"
                  >
                    <Share2 className="w-5 h-5" />
                  </ModernButton>
                )}
                <ModernButton 
                  variant="glass" 
                  size="sm"
                  onClick={() => {
                    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
                    const currentIndex = sizes.indexOf(fontSize);
                    const nextIndex = (currentIndex + 1) % sizes.length;
                    setFontSize(sizes[nextIndex]);
                    toast({
                      title: "تم تغيير حجم الخط",
                      description: sizes[nextIndex] === 'small' ? 'صغير' : sizes[nextIndex] === 'medium' ? 'متوسط' : 'كبير',
                    });
                  }}
                  className={`font-body ${preferences?.gender === 'girls' ? 'bg-[#e91e63] hover:bg-[#c2185b]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                  title="حجم الخط"
                >
                  <span className="text-lg font-bold">Aa</span>
                </ModernButton>
                
                {/* زر الإدارة */}
                <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
                  <DialogTrigger asChild>
                    <ModernButton 
                      variant="glass" 
                      size="sm"
                      className={`font-body ${preferences?.gender === 'girls' ? 'bg-[#e91e63] hover:bg-[#c2185b]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                      title="الإدارة"
                    >
                      <Settings className="w-5 h-5" />
                    </ModernButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إدارة الموضوع</DialogTitle>
                      <DialogDescription>
                        يمكنك الإبلاغ عن أي مشكلة في هذا الموضوع
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <ModernButton 
                        variant="glass" 
                        onClick={() => {
                          setIsAdminOpen(false);
                          setIsReportOpen(true);
                        }}
                        className="w-full justify-start gap-2"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span>الإبلاغ عن مشكلة</span>
                      </ModernButton>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </ModernCard>
        </div>

        {/* Report Topic Dialog */}
        {currentTopic?.id && (
          <ReportTopicDialog
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            topicId={currentTopic.id}
            topicTitle={currentTopic.title}
          />
        )}

        {/* التبويبات الثمانية */}
        <Tabs defaultValue="introduction" className={`w-full ${fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'}`} dir="rtl">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent p-2 h-auto mb-8">
            <TabsTrigger 
              value="introduction" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <span className="text-xs">المقدمة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="verses" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <span className="text-xs">الآيات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="hadith" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <span className="text-xs">الحديث</span>
            </TabsTrigger>
            <TabsTrigger 
              value="didYouKnow" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <span className="text-xs">معلومات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="morningWord" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <span className="text-xs">كلمة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="miscellaneous" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <span className="text-xs">منوعات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="questions" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <span className="text-xs">أسئلة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="conclusion" 
              className="bg-white hover:bg-gray-50 text-radio-dark data-[state=active]:bg-gray-100 data-[state=active]:scale-105 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 p-3 rounded-lg shadow-md"
            >
              <span className="text-xs">الخاتمة</span>
            </TabsTrigger>
          </TabsList>

          {/* محتوى التبويبات */}
          <div className={`tabs-content-safe ${fontSize === 'small' ? '[&_p]:!text-sm [&_.text-xl]:!text-lg [&_.text-2xl]:!text-xl' : fontSize === 'large' ? '[&_p]:!text-xl [&_.text-xl]:!text-2xl [&_.text-2xl]:!text-3xl' : ''}`}>
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
                    {getContentByLevel(currentTopic.content.didYouKnow)?.map((fact: string, index: number) => (
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
                    طول النص: {getContentByLevel(currentTopic.content.morningWord)?.length || 0} حرف
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
                    {getContentByLevel(currentTopic.content.miscellaneous)?.map((item: any, index: number) => (
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
                    {getContentByLevel(currentTopic.content.questions)?.map((qa: any, index: number) => (
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