import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AdminButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/auth')}
      className="fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
      title="لوحة التحكم"
    >
      <Shield className="w-4 h-4 text-primary group-hover:text-primary-dark transition-colors" />
    </button>
  );
};

export default AdminButton;
