// الصفحة الرئيسية للإذاعة المدرسية - Main Page for School Radio
import { useAppContext } from '../context/AppContext';
import PreferencesSelector from '../components/PreferencesSelector';
import TopicsList from '../components/TopicsList';
import TopicViewer from '../components/TopicViewer';
import TestimonialsSection from '../components/TestimonialsSection';
import AdminButton from '../components/AdminButton';

const Index = () => {
  const { preferences, currentTopic } = useAppContext();

  return (
    <>
      <AdminButton />
      {!preferences ? (
        <PreferencesSelector />
      ) : currentTopic ? (
        <TopicViewer />
      ) : (
        <>
          <TopicsList />
          <TestimonialsSection />
        </>
      )}
    </>
  );
};

export default Index;
