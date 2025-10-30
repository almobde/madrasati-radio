-- Add display_order column to custom_topics
ALTER TABLE public.custom_topics 
ADD COLUMN display_order integer;

-- Set default values for existing topics based on creation date
UPDATE public.custom_topics 
SET display_order = subquery.row_number 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC)::integer as row_number 
  FROM public.custom_topics
) AS subquery 
WHERE custom_topics.id = subquery.id;

-- Make the column NOT NULL after setting values
ALTER TABLE public.custom_topics 
ALTER COLUMN display_order SET NOT NULL;

-- Add index for better performance
CREATE INDEX idx_custom_topics_display_order 
ON public.custom_topics(display_order);

-- Add RLS policy for updates (admins only)
CREATE POLICY "Admins can update topics"
ON public.custom_topics
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));