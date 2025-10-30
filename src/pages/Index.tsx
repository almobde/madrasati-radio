// الصفحة الرئيسية للإذاعة المدرسية - Main Page for School Radio
import { useAppContext } from '../context/AppContext';
import PreferencesSelector from '../components/PreferencesSelector';
import TopicsList from '../components/TopicsList';
import TopicViewer from '../components/TopicViewer';
import Header from '../components/Header';

const Index = () => {
  const { preferences, currentTopic } = useAppContext();

  // إذا لم يتم اختيار التفضيلات بعد
  if (!preferences) {
    return <PreferencesSelector />;
  }

  // إذا تم اختيار موضوع للعرض
  if (currentTopic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <TopicViewer />
      </div>
    );
  }

  // عرض قائمة المواضيع
  return <TopicsList />;
};

export default Index;
