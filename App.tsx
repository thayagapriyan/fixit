import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Wrench, 
  Hammer, 
  User, 
  Briefcase, 
  LogOut, 
  PlusCircle, 
  Search, 
  Menu,
  X,
  Zap,
  Droplet,
  ArrowRight
} from 'lucide-react';
import { TOOLS_DATA, SERVICE_PROS, INITIAL_REQUESTS } from './constants';
import { UserRole, View, Product, ServiceRequest } from './types';
import { AIAssistant } from './components/AIAssistant';

// --- Sub-components for cleaner App.tsx ---

const ProductCard: React.FC<{ product: Product; onAdd: (p: Product) => void }> = ({ product, onAdd }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col h-full">
    <div className="relative h-48 bg-gray-100">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold shadow-sm text-gray-700">
        ⭐ {product.rating}
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col">
      <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        <button 
          onClick={() => onAdd(product)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <ShoppingCart size={16} /> Add
        </button>
      </div>
    </div>
  </div>
);

const ServiceCard: React.FC<{ profile: any; role: UserRole }> = ({ profile, role }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-6 flex items-start gap-4">
    <img src={profile.image} alt={profile.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{profile.name}</h3>
          <p className="text-blue-600 font-medium text-sm">{profile.profession}</p>
        </div>
        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
          <span className="text-yellow-600 text-sm font-bold">★ {profile.rating}</span>
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-2">Rate: ${profile.rate}/hr</p>
      <div className="mt-4 flex gap-2">
        {role === UserRole.CUSTOMER ? (
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            Contact
          </button>
        ) : (
          <span className="text-xs text-gray-400 italic">Peer Professional</span>
        )}
      </div>
    </div>
  </div>
);

const RequestCard: React.FC<{ request: ServiceRequest; onAccept: (id: string) => void }> = ({ request, onAccept }) => (
  <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-blue-500 border-gray-100 p-5">
    <div className="flex justify-between items-start mb-3">
      <div>
        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase tracking-wide mb-2">
          {request.category}
        </span>
        <h3 className="font-bold text-gray-900">{request.customerName}</h3>
      </div>
      <span className="text-xs text-gray-400">{request.date}</span>
    </div>
    <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-lg">{request.description}</p>
    <div className="flex justify-end">
      {request.status === 'OPEN' ? (
        <button 
          onClick={() => onAccept(request.id)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Briefcase size={16} /> Accept Job
        </button>
      ) : (
        <span className="text-green-600 font-medium text-sm flex items-center gap-1">
          ✓ Accepted
        </span>
      )}
    </div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [cart, setCart] = useState<Product[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    alert(`Added ${product.name} to cart!`);
  };

  // Job Logic
  const acceptJob = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'IN_PROGRESS' } : req
    ));
  };

  const postJob = (desc: string, cat: string) => {
    const newReq: ServiceRequest = {
      id: Date.now().toString(),
      customerId: 'current-user',
      customerName: 'You',
      description: desc,
      category: cat,
      status: 'OPEN',
      date: new Date().toLocaleDateString()
    };
    setRequests([newReq, ...requests]);
    alert('Job Posted Successfully!');
    setCurrentView(View.DASHBOARD);
  };

  // Login Logic
  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setShowLoginModal(false);
    // Redirect based on role
    if (selectedRole === UserRole.PROFESSIONAL) {
      setCurrentView(View.DASHBOARD);
    } else {
      setCurrentView(View.HOME);
    }
  };

  const handleLogout = () => {
    setRole(UserRole.GUEST);
    setCurrentView(View.HOME);
    setCart([]);
  };

  // Navigation Helper
  const NavItem = ({ view, label, icon: Icon }: any) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        currentView === view 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  // Render Views
  const renderContent = () => {
    switch (currentView) {
      case View.HOME:
        return (
          <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
              <div className="flex-1 space-y-6 z-10">
                <div className="inline-block bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  The #1 Home Services Platform
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                  Fix your home.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Faster than ever.
                  </span>
                </h1>
                <p className="text-gray-400 text-lg max-w-lg">
                  Whether you need a pro or just the right tool, FixItHub connects you with everything needed to solve household issues.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setCurrentView(View.AI_HELPER)}
                    className="bg-white text-slate-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Zap className="text-yellow-500" /> AI Diagnose
                  </button>
                  <button 
                    onClick={() => setCurrentView(View.SERVICES)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    Find a Pro
                  </button>
                </div>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-900/50 to-transparent pointer-events-none"></div>
              {/* Decorative circles */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Featured Tools Preview */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Popular Tools</h2>
                  <p className="text-gray-500">Essential gear for your DIY projects</p>
                </div>
                <button 
                  onClick={() => setCurrentView(View.STORE)} 
                  className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
                >
                  View Store <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TOOLS_DATA.slice(0, 4).map(t => (
                  <ProductCard key={t.id} product={t} onAdd={addToCart} />
                ))}
              </div>
            </section>
          </div>
        );

      case View.STORE:
        return (
          <div className="space-y-6">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tools Marketplace</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">High-quality equipment for professionals and DIY enthusiasts.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOOLS_DATA.map(t => (
                <ProductCard key={t.id} product={t} onAdd={addToCart} />
              ))}
            </div>
          </div>
        );

      case View.SERVICES:
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Expert Professionals</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Vetted experts ready to tackle your electrical, plumbing, and carpentry needs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICE_PROS.map(p => (
                <ServiceCard key={p.id} profile={p} role={role} />
              ))}
            </div>
          </div>
        );

      case View.DASHBOARD:
        if (role === UserRole.PROFESSIONAL) {
          return (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Pro Dashboard</h2>
                  <p className="text-gray-400">Welcome back! You have open requests.</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold">{requests.filter(r => r.status === 'OPEN').length}</span>
                  <span className="text-sm ml-2 opacity-80">New Leads</span>
                </div>
              </div>
              <div className="grid gap-6">
                <h3 className="font-bold text-lg text-gray-800">Available Jobs</h3>
                {requests.length === 0 ? (
                   <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                     No open requests at the moment. Check back later!
                   </div>
                ) : (
                  requests.map(req => (
                    <RequestCard key={req.id} request={req} onAccept={acceptJob} />
                  ))
                )}
              </div>
            </div>
          );
        }
        // Customer Dashboard
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Post a Service Request</h2>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const desc = (form.elements.namedItem('desc') as HTMLTextAreaElement).value;
                  const cat = (form.elements.namedItem('cat') as HTMLSelectElement).value;
                  postJob(desc, cat);
                  form.reset();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Category</label>
                  <select name="cat" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="General">General Handyman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="desc" 
                    rows={4} 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your issue in detail..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors">
                  Post Request
                </button>
              </form>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800">My Requests</h3>
              {requests.filter(r => r.customerId === 'current-user' || r.customerId === 'You').map(req => (
                 <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                   <div>
                     <span className="text-xs font-bold text-blue-600 uppercase">{req.category}</span>
                     <p className="text-gray-800 font-medium">{req.description}</p>
                     <p className="text-xs text-gray-400 mt-1">{req.date}</p>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                     req.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' : 
                     req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                   }`}>
                     {req.status}
                   </span>
                 </div>
              ))}
               {requests.filter(r => r.customerId === 'current-user' || r.customerId === 'You').length === 0 && (
                 <p className="text-gray-500 text-sm">You haven't posted any requests yet.</p>
               )}
            </div>
          </div>
        );

      case View.AI_HELPER:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900">AI Diagnostic Assistant</h2>
              <p className="text-gray-500 mt-2">Not sure what's wrong? Describe the problem, and our Gemini-powered AI will suggest the right tool or professional.</p>
            </div>
            <AIAssistant />
            
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentView(View.STORE)}>
                 <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                   <Hammer size={24} />
                 </div>
                 <h3 className="font-bold text-lg mb-2">Buy Tools</h3>
                 <p className="text-gray-500 text-sm">If the AI suggests a DIY fix, browse our extensive catalog of power and hand tools.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentView(View.SERVICES)}>
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                   <User size={24} />
                 </div>
                 <h3 className="font-bold text-lg mb-2">Hire a Pro</h3>
                 <p className="text-gray-500 text-sm">For complex or dangerous tasks, connect with one of our verified experts immediately.</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div 
                className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
                onClick={() => setCurrentView(View.HOME)}
              >
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Wrench className="text-white h-5 w-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">FixItHub</span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex space-x-2">
                <NavItem view={View.HOME} label="Home" icon={Wrench} />
                <NavItem view={View.STORE} label="Store" icon={ShoppingCart} />
                <NavItem view={View.SERVICES} label="Services" icon={User} />
                <NavItem view={View.AI_HELPER} label="AI Helper" icon={Zap} />
                {role !== UserRole.GUEST && (
                   <NavItem view={View.DASHBOARD} label="Dashboard" icon={Briefcase} />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {role !== UserRole.GUEST && (
                 <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   {role === UserRole.PROFESSIONAL ? 'Pro Account' : 'Customer'}
                 </div>
              )}

              {role === UserRole.GUEST ? (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Login / Sign Up
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 p-2 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                </button>
              )}
              
              <button 
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-2">
            <NavItem view={View.HOME} label="Home" icon={Wrench} />
            <NavItem view={View.STORE} label="Store" icon={ShoppingCart} />
            <NavItem view={View.SERVICES} label="Services" icon={User} />
            <NavItem view={View.AI_HELPER} label="AI Helper" icon={Zap} />
            {role !== UserRole.GUEST && <NavItem view={View.DASHBOARD} label="Dashboard" icon={Briefcase} />}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
               <div className="bg-gray-900 p-1.5 rounded-lg">
                  <Wrench className="text-white h-4 w-4" />
                </div>
                <span className="font-bold text-lg text-gray-900">FixItHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; 2024 FixItHub. All rights reserved. Powered by Google Gemini.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome to FixItHub</h2>
                <p className="text-gray-500 mt-2">Select your account type to continue</p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleLogin(UserRole.CUSTOMER)}
                  className="w-full p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center gap-4 text-left"
                >
                  <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <User className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">I'm a Customer</h3>
                    <p className="text-sm text-gray-500">I need tools or services for my home</p>
                  </div>
                </button>

                <button
                  onClick={() => handleLogin(UserRole.PROFESSIONAL)}
                  className="w-full p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group flex items-center gap-4 text-left"
                >
                  <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Briefcase className="text-orange-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">I'm a Professional</h3>
                    <p className="text-sm text-gray-500">I want to find jobs and buy gear</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="bg-gray-50 px-8 py-4 text-center">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
