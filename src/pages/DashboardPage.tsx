import { useDailyUpdate } from '../hooks/useDailyUpdate';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import TodayPapers from '../components/dashboard/TodayPapers';
import TodayVideos from '../components/dashboard/TodayVideos';
import TodayReadings from '../components/dashboard/TodayReadings';
import QuickNav from '../components/dashboard/QuickNav';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { recommendations, loading } = useDailyUpdate();

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <LoadingSpinner size="lg" message="Loading today's recommendations..." />
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <WelcomeBanner />

      <TodayPapers papers={recommendations.papers} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TodayVideos videos={recommendations.videos} />
        <TodayReadings readings={recommendations.readings} />
      </div>

      <QuickNav />
    </div>
  );
}
