// مكون التذييل - Footer Component
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-radio-dark font-body font-semibold text-lg">
            فكرة وتصميم المدرب عبدالعزيز الخنين
          </p>
          <p className="text-gray-600 font-body">
            متخصص في الذكاء الاصطناعي
          </p>
          <a 
            href="https://linktr.ee/alkhonin837" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-body mt-2 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            linktr.ee/alkhonin837
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
