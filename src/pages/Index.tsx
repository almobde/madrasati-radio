// الصفحة الرئيسية للإذاعة المدرسية - Main Page for School Radio
import { useAppContext } from '../context/AppContext';
import PreferencesSelector from '../components/PreferencesSelector';
import TopicsList from '../components/TopicsList';
import TopicViewer from '../components/TopicViewer';
import Header from '../components/Header';

const Index = () => {
  const { preferences, currentTopic } = useAppContext();

  return (
    <>
      <Header />
      <div className="pt-16">
        {!preferences ? (
          <PreferencesSelector />
        ) : currentTopic ? (
          <TopicViewer />
        ) : (
          <TopicsList />
        )}
      </div>
    </>
  );
};

export default Index;
