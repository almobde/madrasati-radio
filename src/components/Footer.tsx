// مكون التذييل - Footer Component
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex flex-col items-center gap-1">
          <p className="text-white font-body font-semibold text-sm">
            فكرة وتصميم المدرب عبدالعزيز الخنين
          </p>
          <p className="text-white/90 font-body text-xs">
            متخصص في الذكاء الاصطناعي
          </p>
          <a 
            href="https://linktr.ee/alkhonin837" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white hover:text-white/80 transition-colors font-body text-xs mt-1 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            linktr.ee/alkhonin837
          </a>
          <p className="text-white/80 font-body text-xs mt-2">
            حقوق الطبع محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
