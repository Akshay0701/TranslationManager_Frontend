'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TranslationKeyManager } from './components/translation/TranslationKeyManager';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  TagIcon,
  ChevronDownIcon,
  LanguageIcon,
  ArrowPathIcon,
  StarIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  BuildingStorefrontIcon,
  UserCircleIcon,
  CogIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useTranslationStore } from './store/translationStore';
import { AddKeyModal } from './components/translation/AddKeyModal';
import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
});

export default function Home() {
  const { 
    filters, 
    setFilters, 
    selectedLanguage, 
    setSelectedLanguage,
    openAddKeyModal
  } = useTranslationStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startItem, setStartItem] = useState(0);
  const [endItem, setEndItem] = useState(0);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search and filter handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value, offset: 0 });
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ category: e.target.value || undefined, offset: 0 });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setFilters({ offset: (newPage - 1) * 10 });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-stone-50/50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 font-geist">
        {/* Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          hasScrolled 
            ? 'bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-stone-200/50 dark:border-stone-800/50 shadow-sm' 
            : 'bg-transparent'
        }`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors lg:hidden"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center">
                    <RocketLaunchIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                    Localization Manager
                  </span>
                </div>
              </div>
              
              <nav className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors relative group">
                  <BellIcon className="h-5 w-5 text-stone-500 dark:text-stone-400 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-stone-900"></span>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                
                <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-stone-500 dark:text-stone-400 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
                </button>
                
                <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group">
                  <CogIcon className="h-5 w-5 text-stone-500 dark:text-stone-400 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
                </button>
                
                <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center text-white font-medium shadow-sm">
                    JD
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-stone-800 dark:text-stone-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      John Doe
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 group-hover:text-primary-500 dark:group-hover:text-primary-400">
                      Admin
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-stone-900 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              {/* Mobile menu content */}
            </div>
          </div>
        )}

        {/* Main Content Layout (Sidebar + Content Area) */}
        <div className="flex flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-16">
          {/* Sidebar */}
          <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 ease-in-out flex-shrink-0 mr-6 hidden lg:block`}>
            <div className={`bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 h-[calc(100vh-8rem)] sticky top-20 flex flex-col ${isSidebarCollapsed ? 'items-center' : ''}`}>
              {/* Project Section */}
              <div className={`${isSidebarCollapsed ? 'mb-8' : 'mb-6'}`}>
                <h2 className={`font-semibold mb-4 text-stone-700 dark:text-stone-300 flex items-center gap-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <BuildingStorefrontIcon className="h-5 w-5 text-primary-500" />
                  {!isSidebarCollapsed && <span>Navigation</span>}
                </h2>
                
                {/* Project Selector */}
                <div className="space-y-4">
                  <div className={`p-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 ${isSidebarCollapsed ? 'text-center' : ''}`}>
                    {isSidebarCollapsed ? (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center mb-2 shadow-sm">
                          <BuildingStorefrontIcon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium">Project</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-medium text-primary-600 dark:text-primary-400">Current Project</h3>
                          <button className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors">
                            Switch
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center shadow-sm">
                            <BuildingStorefrontIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-stone-800 dark:text-stone-100">E-commerce Platform</div>
                            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Production</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
                    {!isSidebarCollapsed && (
                      <h3 className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-3">Quick Filters</h3>
                    )}
                    <div className="space-y-1.5">
                      <button className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors group hover:bg-white dark:hover:bg-stone-700 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <ArrowPathIcon className="h-4 w-4 text-orange-500 group-hover:text-orange-600" />
                        {!isSidebarCollapsed && (
                          <>
                            <span>Recently Updated</span>
                            <span className="ml-auto text-xs px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">New</span>
                          </>
                        )}
                      </button>
                      <button className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors group hover:bg-white dark:hover:bg-stone-700 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <StarIcon className="h-4 w-4 text-yellow-500 group-hover:text-yellow-600" />
                        {!isSidebarCollapsed && <span>Favorites</span>}
                      </button>
                      <button className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors group hover:bg-white dark:hover:bg-stone-700 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500 group-hover:text-red-600" />
                        {!isSidebarCollapsed && (
                          <>
                            <span>Missing</span>
                            <span className="ml-auto text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">12</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages Section */}
              <div className="mt-auto">
                <h2 className={`font-semibold mb-4 text-stone-700 dark:text-stone-300 flex items-center gap-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <LanguageIcon className="h-5 w-5 text-blue-500" />
                  {!isSidebarCollapsed && <span>Languages</span>}
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
                    {!isSidebarCollapsed && (
                      <h3 className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-3">Language Progress</h3>
                    )}
                    <div className="space-y-4">
                      <div>
                        {!isSidebarCollapsed && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-stone-800 dark:text-stone-200">English (US)</span>
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">100%</span>
                          </div>
                        )}
                        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 w-full"></div>
                        </div>
                      </div>
                      
                      <div>
                        {!isSidebarCollapsed && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-stone-800 dark:text-stone-200">Spanish (ES)</span>
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">75%</span>
                          </div>
                        )}
                        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 w-3/4"></div>
                        </div>
                      </div>
                      
                      <div>
                        {!isSidebarCollapsed && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-stone-800 dark:text-stone-200">French (FR)</span>
                            <span className="text-xs font-medium text-red-600 dark:text-red-400">45%</span>
                          </div>
                        )}
                        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-red-600 w-[45%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
               
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Toolbar Area */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                {/* Search and Filters */}
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-stone-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search translations (e.g., button.save, welcome.message)"
                      value={filters.search || ''}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm placeholder-stone-400 dark:placeholder-stone-500"
                    />
                  </div>
                  
                  <div className="relative min-w-[160px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <TagIcon className="h-5 w-5 text-stone-400" />
                    </div>
                    <select
                      value={filters.category || ''}
                      onChange={handleCategoryFilter}
                      className="w-full pl-10 pr-8 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none text-sm"
                    >
                      <option value="">All Categories</option>
                      <option value="buttons">Buttons</option>
                      <option value="messages">Messages</option>
                      <option value="errors">Errors</option>
                      <option value="labels">Labels</option>
                      <option value="titles">Titles</option>
                      <option value="placeholders">Placeholders</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                  </div>

                  <div className="relative min-w-[160px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LanguageIcon className="h-5 w-5 text-stone-400" />
                    </div>
                    <select
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      className="w-full pl-10 pr-8 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none text-sm"
                    >
                      <option value="en_US">English (US)</option>
                      <option value="es_ES">Spanish (ES)</option>
                      <option value="fr_FR">French (FR)</option>
                      <option value="de_DE">German (DE)</option>
                      <option value="ja_JP">Japanese (JP)</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                {/* Add Key Button */}
                <button
                  onClick={openAddKeyModal}
                  className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-primary-600 to-blue-600 text-white rounded-lg hover:from-primary-700 hover:to-blue-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Add Key</span>
                </button>
              </div>
            </div>

            {/* Translation Keys List / Editor Area */}
            <section className="flex-grow bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                      Translation Keys
                    </h2>
                    <span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-stone-500 dark:text-stone-400">
                      {totalItems > 0 ? (
                        <>
                          Showing <span className="font-medium text-stone-700 dark:text-stone-300">{startItem}-{endItem}</span> of{' '}
                          <span className="font-medium text-stone-700 dark:text-stone-300">{totalItems}</span> keys
                        </>
                      ) : (
                        'No keys found'
                      )}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="h-8 px-3"
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-stone-500 dark:text-stone-400">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="h-8 px-3"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group">
                        <CommandLineIcon className="h-4 w-4 text-stone-400 group-hover:text-primary-500" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group">
                        <DocumentDuplicateIcon className="h-4 w-4 text-stone-400 group-hover:text-primary-500" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group">
                        <ArrowTopRightOnSquareIcon className="h-4 w-4 text-stone-400 group-hover:text-primary-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-8">
                <TranslationKeyManager />
              </div>
            </section>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 mt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  &copy; {new Date().getFullYear()} Localization Manager. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-stone-500 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Documentation</a>
                <a href="#" className="text-sm text-stone-500 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Support</a>
                <a href="#" className="text-sm text-stone-500 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">API</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}