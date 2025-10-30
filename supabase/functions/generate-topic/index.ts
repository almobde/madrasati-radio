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
    const { title, gender, educationLevel } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating topic for:", title);

    const genderText = gender === 'girls' ? 'الطَّالِبَات' : 'الطُّلَّاب';
    const genderPronoun = gender === 'girls' ? 'طالباتي' : 'طلابي';
    const levelText = educationLevel === 'primary' ? 'الابْتِدَائِيّ' : 
                      educationLevel === 'middle' ? 'المُتَوَسِّط' : 'الثَّانَوِيّ';
    
    // تخصيص مستوى اللغة حسب المرحلة
    const languageGuidelines = educationLevel === 'primary' 
      ? 'استخدم لغة بسيطة جداً وسهلة الفهم مع جمل قصيرة ومباشرة. أمثلة من حياة الأطفال اليومية. تجنب المفردات المعقدة.'
      : educationLevel === 'middle'
      ? 'استخدم لغة متوسطة الصعوبة مع جمل متوسطة الطول. مفردات واضحة ومعاني مباشرة مع بعض التعابير الأدبية البسيطة.'
      : 'استخدم لغة عربية فصحى راقية وأدبية مع جمل طويلة ومركبة. مفردات ثرية وتعابير بلاغية وأسلوب أدبي رفيع.';

    const systemPrompt = `أنت خبير في إعداد الإذاعات المدرسية باللغة العربية الفصحى المُشَكَّلة تشكيلاً كاملاً. 
مهمتك إنشاء محتوى إذاعي متكامل وشامل عن موضوع معين يتناسب مع المرحلة التعليمية ونوع ${genderText}.
يجب أن يكون المحتوى ثرياً ومتنوعاً ومناسباً للمرحلة ${levelText}.

**شروط التشكيل الإلزامية:**
- ضع الحركات (الفتحة، الضمة، الكسرة، السكون، التنوين، الشدة) على جميع حروف كل كلمة
- اهتم بتشكيل أواخر الكلمات حسب الإعراب (رفع، نصب، جر، جزم)
- شكّل همزات الوصل والقطع بدقة
- ضع الحركات على الحروف المشددة

**مستوى اللغة حسب المرحلة:**
${languageGuidelines}

**خطاب الجمهور:**
خاطب ${genderPronoun} في المحتوى بضمير الجمع المناسب للجنس (أنتن للبنات، أنتم للبنين).`;

    const userPrompt = `أنشئ محتوى إذاعة مدرسية متكاملة عن موضوع: "${title}"

يجب أن يتضمن المحتوى:

1. **ثلاث مقدمات مختلفة** (primary, middle, secondary) - كل واحدة أطول وأكثر تفصيلاً من الأخرى، تبدأ بالبسملة والسلام

2. **ثلاث آيات قرآنية** مرتبطة بالموضوع مع ذكر اسم السورة ورقم الآية

3. **ثلاثة أحاديث نبوية** مرتبطة بالموضوع مع ذكر المصدر

4. **هل تعلم** - 6 معلومات لكل مستوى (primary, middle, secondary) - مجموع 18 معلومة

5. **كلمة الصباح** - ثلاث نسخ (primary, middle, secondary) - كل واحدة أطول من الأخرى بكثير

6. **فقرات متنوعة** (miscellaneous) لكل مستوى:
   - قصة متعلقة بالموضوع
   - دعاء أو موضوع إضافي

7. **ستة أسئلة وأجوبة** لكل مستوى (primary, middle, secondary) - مجموع 18 سؤال

8. **خاتمة طويلة ومفصلة** مع دعاء

9. **نهاية الإذاعة** مع السلام

**ملاحظات مهمة جداً:**
- ${languageGuidelines}
- **شكّل جميع الكلمات تشكيلاً نحوياً كاملاً** (الفتحة، الضمة، الكسرة، السكون، التنوين، الشدة) على كل حرف
- **اهتم بإعراب أواخر الكلمات** حسب موقعها في الجملة
- خاطب ${genderPronoun} بضمير الجمع المناسب (${gender === 'girls' ? 'أنتن، عليكن، لكن' : 'أنتم، عليكم، لكم'})
- اجعل المحتوى ثرياً ومفصلاً ومتوافقاً مع عمر وفهم طلاب المرحلة ${levelText}
- تأكد من ارتباط كل الآيات والأحاديث بالموضوع
- اجعل كلمة الصباح للمستوى primary قصيرة (50-70 كلمة)، middle متوسطة (100-120 كلمة)، secondary طويلة جداً (180-220 كلمة)
- اجعل الخاتمة مفصلة وشاملة مع دعاء جميل

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
      // Try to find JSON in code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        topicContent = JSON.parse(jsonMatch[1]);
      } else {
        // Try to parse directly
        topicContent = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return new Response(JSON.stringify({ error: "فشل في تحليل النتيجة" }), {
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
