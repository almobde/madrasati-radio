-- تعديل سياسة الحذف لتكون للإدارة فقط
DROP POLICY IF EXISTS "Anyone can delete topics" ON public.custom_topics;

CREATE POLICY "Admins can delete topics"
ON public.custom_topics
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));