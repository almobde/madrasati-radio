import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Trash2, Edit, Plus } from "lucide-react";

const reportSchema = z.object({
  reportType: z.enum(["delete", "edit", "add"], {
    required_error: "يرجى اختيار نوع الملاحظة",
  }),
  noteText: z
    .string()
    .trim()
    .min(10, { message: "يجب أن تكون الملاحظة 10 أحرف على الأقل" })
    .max(1000, { message: "يجب أن تكون الملاحظة أقل من 1000 حرف" }),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ReportTopicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  topicTitle: string;
}

export const ReportTopicDialog = ({
  isOpen,
  onClose,
  topicId,
  topicTitle,
}: ReportTopicDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const reportType = watch("reportType");

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("topic_reports").insert({
        topic_id: topicId,
        user_id: userData.user?.id || null,
        report_type: data.reportType,
        note_text: data.noteText,
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الملاحظة بنجاح",
        description: "سيتم مراجعتها من قبل الإدارة في أقرب وقت",
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "خطأ في إرسال الملاحظة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportOptions = [
    {
      value: "delete" as const,
      label: "طلب حذف الموضوع",
      icon: Trash2,
      description: "هذا الموضوع يحتوي على محتوى غير مناسب أو خاطئ",
    },
    {
      value: "edit" as const,
      label: "اقتراح تعديل",
      icon: Edit,
      description: "هناك معلومات تحتاج إلى تحديث أو تصحيح",
    },
    {
      value: "add" as const,
      label: "اقتراح إضافة",
      icon: Plus,
      description: "يمكن إثراء الموضوع بمعلومات إضافية",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] font-arabic">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            الإبلاغ عن مشكلة في الموضوع
          </DialogTitle>
          <DialogDescription className="text-right">
            الموضوع: <span className="font-semibold">{topicTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Report Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">نوع الملاحظة</Label>
            <RadioGroup
              value={reportType}
              onValueChange={(value) =>
                setValue("reportType", value as "delete" | "edit" | "add")
              }
              className="space-y-2"
            >
              {reportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-2 space-x-reverse rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      reportType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setValue("reportType", option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <div className="flex-1 space-y-1">
                      <Label
                        htmlFor={option.value}
                        className="flex items-center gap-2 cursor-pointer font-semibold"
                      >
                        <Icon className="w-4 h-4" />
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
            {errors.reportType && (
              <p className="text-sm text-destructive">
                {errors.reportType.message}
              </p>
            )}
          </div>

          {/* Note Text */}
          <div className="space-y-2">
            <Label htmlFor="noteText" className="text-base font-semibold">
              تفاصيل الملاحظة
            </Label>
            <Textarea
              id="noteText"
              {...register("noteText")}
              placeholder="اكتب تفاصيل ملاحظتك هنا... (10 أحرف على الأقل)"
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
            />
            {errors.noteText && (
              <p className="text-sm text-destructive">
                {errors.noteText.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الإرسال..." : "إرسال الملاحظة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
