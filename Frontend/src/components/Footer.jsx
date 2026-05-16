import { Bus } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-6 text-sm text-gray-500 sm:px-6">

        <div className="flex items-center gap-2">
          <Bus size={16} className="text-blue-600" />
          <span>BusTrak · Bus Timetable & Delay Tracker</span>
        </div>

        <div>Kuliyapitiya → Colombo · bustimetable.lk</div>
      </div>
    </footer>
  );
}