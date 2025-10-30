import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, gender, educationLevel, addressStyle, contentLength, selectedSections } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating topic for:", title);

    const genderText = gender === 'girls' ? 'الطَّالِبَات' : 'الطُّلَّاب';
    const genderPronoun = gender === 'girls' ? 'طالباتي' : 'طلابي';
    const levelText = educationLevel === 'primary' ? 'الابْتِدَائِيّ' : 
                      educationLevel === 'middle' ? 'المُتَوَسِّط' : 'الثَّانَوِيّ';
    
    // أسلوب الخطاب
    const addressPronouns = addressStyle === 'feminine' 
      ? { plural: 'أنتن', object: 'عليكن، لكن', possessive: 'كن' }
      : { plural: 'أنتم', object: 'عليكم، لكم', possessive: 'كم' };
    
    // تخصيص مستوى اللغة حسب المرحلة
    const languageGuidelines = educationLevel === 'primary' 
      ? 'استخدم لغة بسيطة جداً وسهلة الفهم مع جمل قصيرة ومباشرة. أمثلة من حياة الأطفال اليومية. تجنب المفردات المعقدة.'
      : educationLevel === 'middle'
      ? 'استخدم لغة متوسطة الصعوبة مع جمل متوسطة الطول. مفردات واضحة ومعاني مباشرة مع بعض التعابير الأدبية البسيطة.'
      : 'استخدم لغة عربية فصحى راقية وأدبية مع جمل طويلة ومركبة. مفردات ثرية وتعابير بلاغية وأسلوب أدبي رفيع.';
    
    // طول المحتوى
    const contentLengthGuidelines = contentLength === 'short'
      ? 'اجعل المحتوى مختصراً وموجزاً. المقدمة قصيرة (3-4 جمل)، آيتين بدلاً من ثلاث، حديثين بدلاً من ثلاثة، 3 معلومات هل تعلم بدلاً من 6، كلمة الصباح قصيرة (40-60 كلمة)، 3 أسئلة بدلاً من 6.'
      : 'اجعل المحتوى مفصلاً وشاملاً. المقدمة طويلة ومفصلة، ثلاث آيات، ثلاثة أحاديث، 6 معلومات هل تعلم، كلمة صباح طويلة، 6 أسئلة.';

    const systemPrompt = `أنت خبير في إعداد الإذاعات المدرسية باللغة العربية الفصحى المُشَكَّلة تشكيلاً كاملاً. 
مهمتك إنشاء محتوى إذاعي متكامل وشامل عن موضوع معين يتناسب مع المرحلة التعليمية ونوع ${genderText}.
يجب أن يكون المحتوى ثرياً ومتنوعاً ومناسباً للمرحلة ${levelText}.

**شروط التشكيل الإلزامية:**
- ضع الحركات (الفتحة، الضمة، الكسرة، السكون، التنوين، الشدة) على جميع حروف كل كلمة
- اهتم بتشكيل أواخر الكلمات حسب الإعراب (رفع، نصب، جر، جزم)
- شكّل همزات الوصل والقطع بدقة
- ضع الحركات على الحروف المشددة

**الأحاديث النبوية الشريفة - شروط صارمة:**
- استخدم الأحاديث الصحيحة فقط من صحيح البخاري أو صحيح مسلم
- يجب أن يبدأ كل حديث باسم الراوي
- مثال: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: ..."
- مثال: "عَنْ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا قَالَتْ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: ..."
- اذكر المصدر بدقة: "رَوَاهُ البُخَارِيّ" أو "رَوَاهُ مُسْلِم" أو "مُتَّفَقٌ عَلَيْه"

**مستوى اللغة حسب المرحلة:**
${languageGuidelines}

**خطاب الجمهور:**
خاطب ${genderPronoun} في المحتوى بضمير الجمع: ${addressPronouns.plural}، ${addressPronouns.object}.

**طول المحتوى:**
${contentLengthGuidelines}`;

    // بناء محتوى الأقسام المطلوبة
    const sections = [];
    let sectionNumber = 1;
    
    if (selectedSections.introduction) {
      sections.push(`${sectionNumber}. **${contentLength === 'short' ? 'مقدمة قصيرة' : 'ثلاث مقدمات مختلفة'}** (primary, middle, secondary) - ${contentLength === 'short' ? 'موجزة ومباشرة' : 'كل واحدة أطول وأكثر تفصيلاً من الأخرى'}، تبدأ بالبسملة والسلام`);
      sectionNumber++;
    }
    
    if (selectedSections.quranVerses) {
      const versesCount = contentLength === 'short' ? 'آيتين' : 'ثلاث آيات';
      sections.push(`${sectionNumber}. **${versesCount} قرآنية** مرتبطة بالموضوع مع ذكر اسم السورة ورقم الآية`);
      sectionNumber++;
    }
    
    if (selectedSections.hadiths) {
      const hadithsCount = contentLength === 'short' ? 'حديثين' : 'ثلاثة أحاديث';
      sections.push(`${sectionNumber}. **${hadithsCount} نبوية صحيحة** من صحيح البخاري أو مسلم - يجب أن تبدأ بالراوي (عَنْ فلان رَضِيَ اللَّهُ عَنْهُ...) ثم نص الحديث ثم المصدر`);
      sectionNumber++;
    }
    
    if (selectedSections.didYouKnow) {
      const infoCount = contentLength === 'short' ? '3 معلومات' : '6 معلومات';
      sections.push(`${sectionNumber}. **هل تعلم** - ${infoCount} لكل مستوى (primary, middle, secondary)`);
      sectionNumber++;
    }
    
    if (selectedSections.morningWord) {
      sections.push(`${sectionNumber}. **كلمة الصباح** - ثلاث نسخ (primary, middle, secondary) - ${contentLength === 'short' ? 'موجزة' : 'كل واحدة أطول من الأخرى بكثير'}`);
      sectionNumber++;
    }
    
    if (selectedSections.miscellaneous) {
      sections.push(`${sectionNumber}. **فقرات متنوعة** (miscellaneous) لكل مستوى:
   - قصة متعلقة بالموضوع
   - دعاء أو موضوع إضافي`);
      sectionNumber++;
    }
    
    if (selectedSections.questions) {
      const questionsCount = contentLength === 'short' ? 'ثلاثة أسئلة' : 'ستة أسئلة';
      sections.push(`${sectionNumber}. **${questionsCount} وأجوبة** لكل مستوى (primary, middle, secondary)`);
      sectionNumber++;
    }
    
    if (selectedSections.conclusion) {
      sections.push(`${sectionNumber}. **خاتمة ${contentLength === 'short' ? 'موجزة' : 'طويلة ومفصلة'}** مع دعاء`);
      sectionNumber++;
    }
    
    sections.push(`${sectionNumber}. **نهاية الإذاعة** مع السلام`);
    
    const userPrompt = `أنشئ محتوى إذاعة مدرسية متكاملة عن موضوع: "${title}"

يجب أن يتضمن المحتوى الأقسام التالية فقط:

${sections.join('\n\n')}

**ملاحظات مهمة جداً:**
- ${languageGuidelines}
- ${contentLengthGuidelines}
- **شكّل جميع الكلمات تشكيلاً نحوياً كاملاً** (الفتحة، الضمة، الكسرة، السكون، التنوين، الشدة) على كل حرف
- **اهتم بإعراب أواخر الكلمات** حسب موقعها في الجملة
- خاطب ${genderPronoun} بضمير الجمع: ${addressPronouns.plural}، ${addressPronouns.object}
- اجعل المحتوى ${contentLength === 'short' ? 'مختصراً ومباشراً' : 'ثرياً ومفصلاً'} ومتوافقاً مع عمر وفهم طلاب المرحلة ${levelText}
- تأكد من ارتباط كل الآيات والأحاديث بالموضوع
- ${contentLength === 'short' 
    ? 'اجعل كلمة الصباح قصيرة جداً (40-60 كلمة) للجميع'
    : 'اجعل كلمة الصباح للمستوى primary قصيرة (50-70 كلمة)، middle متوسطة (100-120 كلمة)، secondary طويلة جداً (180-220 كلمة)'}
- ${selectedSections.conclusion ? `اجعل الخاتمة ${contentLength === 'short' ? 'موجزة' : 'مفصلة وشاملة'} مع دعاء جميل` : ''}

**مهم جداً للتنسيق:**
- أرجع JSON صحيح بدون أي أسطر جديدة داخل النصوص
- لا تضع تعليقات أو شروحات إضافية داخل نصوص الأحاديث
- اجعل كل نص في سطر واحد متصل

أرجع الناتج كـ JSON بهذا الشكل:
\`\`\`json
{
  "introduction": {
    "primary": "نص المقدمة البسيطة...",
    "middle": "نص المقدمة المتوسطة...",
    "secondary": "نص المقدمة المفصلة..."
  },
  "quranVerses": [
    {"text": "نص الآية", "reference": "اسم السورة - رقم الآية"},
    {"text": "نص الآية", "reference": "اسم السورة - رقم الآية"},
    {"text": "نص الآية", "reference": "اسم السورة - رقم الآية"}
  ],
  "hadiths": [
    {"text": "نص الحديث", "reference": "المصدر"},
    {"text": "نص الحديث", "reference": "المصدر"},
    {"text": "نص الحديث", "reference": "المصدر"}
  ],
  "didYouKnow": {
    "primary": ["معلومة 1", "معلومة 2", "معلومة 3", "معلومة 4", "معلومة 5", "معلومة 6"],
    "middle": ["معلومة 1", "معلومة 2", "معلومة 3", "معلومة 4", "معلومة 5", "معلومة 6"],
    "secondary": ["معلومة 1", "معلومة 2", "معلومة 3", "معلومة 4", "معلومة 5", "معلومة 6"]
  },
  "morningWord": {
    "primary": "كلمة قصيرة...",
    "middle": "كلمة متوسطة...",
    "secondary": "كلمة طويلة ومفصلة جداً..."
  },
  "miscellaneous": {
    "primary": [
      {"type": "story", "title": "عنوان", "content": "المحتوى"},
      {"type": "dua", "title": "دعاء", "content": "المحتوى"}
    ],
    "middle": [
      {"type": "story", "title": "عنوان", "content": "المحتوى"},
      {"type": "topic", "title": "عنوان", "content": "المحتوى"}
    ],
    "secondary": [
      {"type": "story", "title": "عنوان", "content": "المحتوى"},
      {"type": "topic", "title": "عنوان", "content": "المحتوى"}
    ]
  },
  "questions": {
    "primary": [
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"}
    ],
    "middle": [
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"}
    ],
    "secondary": [
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"},
      {"question": "السؤال؟", "answer": "الجواب"}
    ]
  },
  "conclusion": "خاتمة طويلة ومفصلة...",
  "radioEnding": "نهاية الإذاعة..."
}
\`\`\``;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 8000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح، الرجاء المحاولة لاحقاً" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إضافة رصيد للحساب" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "خطأ في الاتصال بخدمة الذكاء الاصطناعي" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("AI Response:", content);

    // Extract JSON from response
    let topicContent;
    try {
      console.log("Raw AI Response length:", content.length);
      console.log("First 300 chars:", content.substring(0, 300));
      console.log("Last 300 chars:", content.substring(content.length - 300));

      // Try multiple patterns to extract JSON from code blocks
      const codeBlockPatterns = [
        /```json\s*\n([\s\S]*?)\n```/,  // ```json ... ```
        /```\s*\n([\s\S]*?)\n```/,      // ``` ... ```
        /`json\s*\n([\s\S]*?)\n`/,      // `json ... `
      ];

      let jsonText = "";
      let found = false;

      for (const pattern of codeBlockPatterns) {
        const match = content.match(pattern);
        if (match) {
          jsonText = match[1];
          found = true;
          console.log("Found JSON using pattern:", pattern.source);
          break;
        }
      }

      if (!found) {
        console.log("No code block found, trying direct parse");
        jsonText = content;
      }

      // Clean the JSON text thoroughly
      jsonText = jsonText
        .trim()                           // Remove extra whitespace
        .replace(/^\`+|\`+$/g, '')        // Remove backticks at start/end
        .replace(/^json\s*/i, '')         // Remove "json" prefix
        .replace(/\r\n/g, '\n')           // Normalize line endings
        .replace(/\t/g, ' ')              // Replace tabs with spaces
        .replace(/[\u0000-\u001F]/g, ''); // Remove control characters

      console.log("Extracted JSON length:", jsonText.length);
      console.log("JSON first 200 chars:", jsonText.substring(0, 200));
      console.log("JSON last 200 chars:", jsonText.substring(jsonText.length - 200));

      // Try multiple parsing strategies
      const parsingStrategies = [
        // Strategy 1: Parse directly
        () => {
          console.log("Trying direct parse...");
          return JSON.parse(jsonText);
        },
        
        // Strategy 2: Try to fix common issues
        () => {
          console.log("Trying with newline replacement...");
          return JSON.parse(jsonText.replace(/\n/g, ' '));
        },
        
        // Strategy 3: Find JSON object boundaries
        () => {
          console.log("Trying to find JSON boundaries...");
          const start = jsonText.indexOf('{');
          const end = jsonText.lastIndexOf('}') + 1;
          if (start >= 0 && end > start) {
            const extracted = jsonText.substring(start, end);
            console.log("Extracted JSON from boundaries, length:", extracted.length);
            return JSON.parse(extracted);
          }
          throw new Error('No JSON object found');
        }
      ];

      let parseError: Error | undefined;
      for (const strategy of parsingStrategies) {
        try {
          topicContent = strategy();
          console.log("Successfully parsed JSON");
          break;
        } catch (e) {
          parseError = e instanceof Error ? e : new Error(String(e));
          console.log("Parsing strategy failed:", parseError.message);
          continue;
        }
      }

      if (!topicContent) {
        console.error("All parsing strategies failed");
        throw parseError || new Error('All parsing strategies failed');
      }
      
      // Validate required fields
      if (!topicContent.introduction || !topicContent.quranVerses || !topicContent.hadiths) {
        console.error("Missing required fields in AI response");
        return new Response(JSON.stringify({ error: "المحتوى المُولّد غير مكتمل" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Content preview:", content.substring(0, 500));
      return new Response(JSON.stringify({ error: "فشل في تحليل النتيجة. الرجاء المحاولة مرة أخرى." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ content: topicContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-topic function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "حدث خطأ غير متوقع" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
