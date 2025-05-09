
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <header className="py-6 px-4 border-b bg-white shadow-subtle">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
              alt="PEC Logo" 
              className="h-10 w-auto" 
            />
            <h1 className="text-xl font-bold text-pec-green">PEC Pulse</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto text-center max-w-4xl fade-in">
            <img 
              src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
              alt="PEC Logo" 
              className="h-24 mx-auto mb-6" 
            />
            <h1 className="text-4xl md:text-5xl font-bold text-pec-green mb-6">Welcome to PEC Pulse</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Pakistan Engineering Council's integrated platform for efficient workbody management and collaboration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button 
                  className="bg-pec-green hover:bg-pec-green/90 transition-colors duration-300 px-8 py-2.5 h-auto rounded-lg text-base"
                >
                  Login to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button 
                  variant="outline" 
                  className="border-pec-green text-pec-green hover:bg-pec-green/10 transition-colors duration-300 px-8 py-2.5 h-auto rounded-lg text-base"
                >
                  Explore as Guest
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-6 flex flex-col items-center text-center slide-in">
                <div className="bg-pec-green/10 p-4 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-pec-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Meeting Management</h3>
                <p className="text-gray-600">Schedule, track, and organize meetings across all workbodies efficiently.</p>
              </div>
              
              <div className="card p-6 flex flex-col items-center text-center slide-in" style={{animationDelay: "100ms"}}>
                <div className="bg-pec-green/10 p-4 rounded-full mb-4">
                  <Users className="h-8 w-8 text-pec-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Workbody Collaboration</h3>
                <p className="text-gray-600">Streamline communication and coordination between committee members.</p>
              </div>
              
              <div className="card p-6 flex flex-col items-center text-center slide-in" style={{animationDelay: "200ms"}}>
                <div className="bg-pec-green/10 p-4 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-pec-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Governance & Oversight</h3>
                <p className="text-gray-600">Ensure compliance with standards and track progress on initiatives.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
                  alt="PEC Logo" 
                  className="h-10 w-auto filter brightness-0 invert" 
                />
                <h2 className="text-xl font-bold">PEC Pulse</h2>
              </div>
              <p className="text-gray-400 text-sm md:max-w-sm">
                Pakistan Engineering Council's comprehensive workbody management system.
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © 2025 Pakistan Engineering Council. All rights reserved.
              </p>
              <div className="mt-2 flex gap-4 justify-center md:justify-end">
                <a href="#" className="text-sm text-gray-400 hover:text-white">Terms</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;
