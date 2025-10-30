import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModernCard } from './ui/modern-card';
import { ModernButton } from './ui/modern-button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string | null;
  content: string;
  created_at: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTestimonials(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: 'خطأ',
        description: 'الرجاء كتابة رأيك',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('testimonials').insert({
      name: name.trim() || null,
      content: content.trim(),
    });

    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال رأيك',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم الإرسال',
        description: 'شكراً لك! سيتم مراجعة رأيك قريباً',
      });
      setName('');
      setContent('');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-white mb-2 flex items-center justify-center gap-2">
            <MessageCircle className="w-8 h-8" />
            آراء الزوار
          </h2>
          <p className="text-white/80 font-body">شاركنا رأيك في الموقع</p>
        </div>

        {/* نموذج إضافة رأي */}
        <ModernCard className="mb-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-semibold text-foreground mb-2">
                الاسم (اختياري)
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك"
                className="font-body"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-body font-semibold text-foreground mb-2">
                رأيك *
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="شاركنا رأيك في الموقع..."
                className="font-body min-h-[120px]"
                maxLength={500}
                required
              />
              <p className="text-xs text-muted-foreground mt-1 font-body">
                {content.length}/500
              </p>
            </div>
            <ModernButton
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              <Send className="w-4 h-4 ml-2" />
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرأي'}
            </ModernButton>
          </form>
        </ModernCard>

        {/* عرض الآراء المعتمدة */}
        {testimonials.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              آراء الزوار المعتمدة
            </h3>
            {testimonials.map((testimonial) => (
              <ModernCard key={testimonial.id} className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="font-body font-semibold text-foreground">
                      {testimonial.name || 'زائر'}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      {new Date(testimonial.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <p className="font-body text-foreground leading-relaxed">
                    {testimonial.content}
                  </p>
                </div>
              </ModernCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;
