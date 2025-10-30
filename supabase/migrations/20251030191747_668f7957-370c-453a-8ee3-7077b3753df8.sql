-- إنشاء جدول آراء الزوار
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  content TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS على جدول الآراء
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- سياسة: الجميع يمكنهم مشاهدة الآراء المعتمدة فقط
CREATE POLICY "Anyone can view approved testimonials"
ON public.testimonials
FOR SELECT
USING (approved = true);

-- سياسة: الجميع يمكنهم إضافة رأي جديد
CREATE POLICY "Anyone can insert testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (true);

-- إنشاء enum للأدوار
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- إنشاء جدول الأدوار
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS على جدول الأدوار
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- سياسة: المستخدمون يمكنهم رؤية أدوارهم فقط
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- إنشاء دالة للتحقق من الأدوار (security definer لتجنب التكرار)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- سياسة: المشرفون فقط يمكنهم اعتماد/رفض الآراء
CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- سياسة: المشرفون فقط يمكنهم حذف الآراء
CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- سياسة: المشرفون يمكنهم رؤية جميع الآراء (المعتمدة وغير المعتمدة)
CREATE POLICY "Admins can view all testimonials"
ON public.testimonials
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- إنشاء دالة trigger لإضافة دور المستخدم تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN NEW.email = 'almobde.com@gmail.com' THEN 'admin'::app_role
      ELSE 'user'::app_role
    END
  );
  RETURN NEW;
END;
$$;

-- إنشاء trigger للمستخدمين الجدد
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();