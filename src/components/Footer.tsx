export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Job Finder - Automated Python/Django job search
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Built by Mia Elena
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://miaelena.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Portfolio
            </a>
            <a 
              href="https://github.com/miasdk/job-finder-backend" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}