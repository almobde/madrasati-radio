import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfPath } = await req.json();
    
    console.log("Processing PDF:", pdfPath);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not found");
    }
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not found");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Download the PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('pdf-uploads')
      .download(pdfPath);
    
    if (downloadError) {
      console.error("Download error:", downloadError);
      throw new Error(`Failed to download PDF: ${downloadError.message}`);
    }
    
    console.log("PDF downloaded successfully");
    
    // Convert to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    console.log("PDF converted to base64, calling Lovable AI...");
    
    // Use Lovable AI to analyze the PDF
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `أنت خبير في تحليل محتوى المستندات واستخراج المعلومات المهمة.
مهمتك استخراج وتحليل محتوى PDF التعليمي وإرجاع النتيجة بصيغة JSON فقط:

{
  "suggestedTitle": "عنوان مقترح قصير (كلمة أو كلمتين)",
  "mainPoints": ["نقطة رئيسية 1", "نقطة 2", "نقطة 3", "نقطة 4", "نقطة 5"],
  "keywords": ["كلمة مفتاحية 1", "كلمة 2", "كلمة 3"],
  "fullText": "النص الكامل المستخرج من PDF"
}

**مهم جداً:**
- العنوان المقترح يجب أن يكون قصيراً جداً (1-3 كلمات فقط)
- استخرج 5-7 نقاط رئيسية فقط من المحتوى
- الكلمات المفتاحية يجب أن تكون 3-5 كلمات فقط
- النص الكامل يجب أن يحتوي على كل محتوى PDF المهم
- **أرجع JSON فقط - لا نص إضافي قبله أو بعده**`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "حلل هذا المستند واستخرج المعلومات المطلوبة. أرجع JSON فقط."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:application/pdf;base64,${base64}`
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد إلى حساب Lovable AI" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Lovable AI error: ${response.status}`);
    }
    
    const aiData = await response.json();
    console.log("AI response received");
    
    const content = aiData.choices[0].message.content;
    
    // Try to extract JSON from the response
    let extractedData;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/```\s*([\s\S]*?)\s*```/);
      
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      extractedData = JSON.parse(jsonString.trim());
      
      console.log("PDF analysis completed successfully");
      
    } catch (parseError) {
      console.error("Failed to parse JSON:", content);
      throw new Error("فشل في تحليل استجابة الذكاء الاصطناعي");
    }
    
    return new Response(
      JSON.stringify(extractedData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "حدث خطأ غير معروف في معالجة الملف"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
