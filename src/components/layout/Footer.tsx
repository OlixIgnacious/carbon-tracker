import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-carbon-500">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">🌍</span>
            <span>Carbon Tracker — Track & reduce your footprint</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="hover:text-emerald-400 transition-colors"
            >
              Methodology & Sources
            </Link>
            <span className="text-carbon-700">•</span>
            <span className="text-carbon-600">
              All data stored locally in your browser
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
