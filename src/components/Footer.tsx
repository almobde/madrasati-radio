// مكون التذييل - Footer Component

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex flex-col items-center gap-1">
          <p className="text-white font-body font-semibold text-sm">
            فكرة وتصميم المدرب عبدالعزيز الخنين
          </p>
          <p className="text-white/90 font-body text-sm">
            بالتعاون مع الأستاذ ناصر اليحيا
          </p>
          <p className="text-white/80 font-body text-xs mt-2">
            حقوق الطبع محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
