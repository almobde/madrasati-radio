-- إنشاء جدول البنر الإعلاني
CREATE TABLE public.advertisement_banner (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  link_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.advertisement_banner ENABLE ROW LEVEL SECURITY;

-- الجميع يمكنهم مشاهدة البنر النشط
CREATE POLICY "Anyone can view active banner"
ON public.advertisement_banner
FOR SELECT
TO public
USING (is_active = true);

-- المسؤولون فقط يمكنهم إدارة البنر
CREATE POLICY "Admins can manage banner"
ON public.advertisement_banner
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- إنشاء bucket للإعلانات
INSERT INTO storage.buckets (id, name, public)
VALUES ('advertisements', 'advertisements', true);

-- RLS policies للـ Storage
CREATE POLICY "Public can view advertisement images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'advertisements');

CREATE POLICY "Admins can upload advertisement images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'advertisements' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete advertisement images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'advertisements' 
  AND has_role(auth.uid(), 'admin'::app_role)
);