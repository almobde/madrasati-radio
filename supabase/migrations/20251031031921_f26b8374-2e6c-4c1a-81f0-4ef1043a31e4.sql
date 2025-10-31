-- Create table for topic reports/notes
CREATE TABLE public.topic_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.custom_topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('delete', 'edit', 'add')),
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_resolved BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.topic_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert reports
CREATE POLICY "Anyone can insert reports"
ON public.topic_reports
FOR INSERT
WITH CHECK (true);

-- Policy: Admins can view all reports
CREATE POLICY "Admins can view all reports"
ON public.topic_reports
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can update reports
CREATE POLICY "Admins can update reports"
ON public.topic_reports
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can delete reports
CREATE POLICY "Admins can delete reports"
ON public.topic_reports
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for topic_reports table
ALTER PUBLICATION supabase_realtime ADD TABLE public.topic_reports;