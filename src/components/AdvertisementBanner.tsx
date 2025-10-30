// مكون البنر الإعلاني - Advertisement Banner Component
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BannerData {
  id: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
}

const AdvertisementBanner = () => {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveBanner();
  }, []);

  const fetchActiveBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisement_banner')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setBanner(data);
      }
    } catch (error) {
      console.error('Error fetching banner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !banner) {
    return null;
  }

  return (
    <div className="w-full py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <a
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <img
            src={banner.image_url}
            alt="إعلان"
            className="w-full h-auto rounded-lg shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl"
            loading="lazy"
          />
        </a>
      </div>
    </div>
  );
};

export default AdvertisementBanner;
