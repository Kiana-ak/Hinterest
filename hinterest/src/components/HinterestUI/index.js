import HinterestSidebar from './HinterestSidebar';
import HinterestContent from './HinterestContent';
import HinterestRightBar from './HinterestRightBar';
import './Themes/themes.css';

export default function HinterestUI() {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      <HinterestSidebar />
      <HinterestContent />
      <HinterestRightBar />
    </div>
  );
}