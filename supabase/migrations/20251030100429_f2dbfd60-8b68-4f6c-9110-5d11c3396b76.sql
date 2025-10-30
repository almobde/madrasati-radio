-- Create custom_topics table to store AI-generated topics
CREATE TABLE public.custom_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'موضوع مولد',
  gender TEXT NOT NULL CHECK (gender IN ('boys', 'girls')),
  education_level TEXT NOT NULL CHECK (education_level IN ('primary', 'middle', 'secondary')),
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.custom_topics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read topics
CREATE POLICY "Anyone can view topics"
ON public.custom_topics
FOR SELECT
USING (true);

-- Create policy to allow anyone to insert topics
CREATE POLICY "Anyone can insert topics"
ON public.custom_topics
FOR INSERT
WITH CHECK (true);

-- Create policy to allow anyone to delete topics
CREATE POLICY "Anyone can delete topics"
ON public.custom_topics
FOR DELETE
USING (true);

-- Create index for faster queries
CREATE INDEX idx_custom_topics_gender_education ON public.custom_topics(gender, education_level);