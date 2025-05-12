
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Calendar, ChevronDown, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Modern Header with Shadow on Scroll */}
      <header 
        className={cn(
          "sticky top-0 w-full z-50 transition-all duration-300", 
          scrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-sm py-4"
        )}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
              alt="PEC Logo" 
              className="h-10 w-auto" 
            />
            <h1 className="text-xl font-bold text-pec-green">PEC Pulse</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center gap-6">
              <Link to="#about" className="text-gray-700 hover:text-pec-green transition-colors">
                About
              </Link>
              <Link to="#features" className="text-gray-700 hover:text-pec-green transition-colors">
                Features
              </Link>
              <Link to="#faq" className="text-gray-700 hover:text-pec-green transition-colors">
                FAQ
              </Link>
              <Link to="#contact" className="text-gray-700 hover:text-pec-green transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline" className="border-pec-green text-pec-green hover:bg-pec-green/10">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button size="sm" variant="outline" className="border-pec-green text-pec-green">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-white to-pec-green-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                  Modernizing <span className="text-pec-green">Workbody Management</span> at Pakistan Engineering Council
                </h1>
                <p className="text-xl text-gray-600 max-w-xl">
                  PEC Pulse is an integrated platform for efficient coordination, collaboration, 
                  and oversight of committees, working groups, and task forces.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/login">
                    <Button 
                      className="bg-pec-green hover:bg-pec-green-600 text-white px-8 py-6 h-auto rounded-xl text-base"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="#about">
                    <Button 
                      variant="outline" 
                      className="border-2 border-pec-green text-pec-green hover:bg-pec-green/10 px-8 py-6 h-auto rounded-xl text-base"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
                    alt="PEC Pulse Dashboard Preview" 
                    className="w-full h-auto bg-white p-12"
                  />
                </div>
                <div className="absolute inset-0 bg-pec-green/20 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                PEC Pulse provides comprehensive tools for managing engineering workbodies efficiently
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Users className="h-8 w-8 text-pec-green" />}
                title="Workbody Management"
                description="Efficiently organize committees, working groups, and task forces with clear mandates and progress tracking"
              />
              <FeatureCard 
                icon={<Calendar className="h-8 w-8 text-pec-green" />}
                title="Meeting Coordination"
                description="Schedule, track, and document meetings with automatic minutes generation and action item extraction"
              />
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-pec-green" />}
                title="Governance & Oversight"
                description="Maintain standards compliance with transparent reporting and comprehensive audit trails"
              />
              <FeatureCard 
                icon={<CheckCircle className="h-8 w-8 text-pec-green" />}
                title="Progress Tracking"
                description="Monitor action items and deadlines with automatic notifications and status updates"
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8 text-pec-green" />}
                title="Member Collaboration"
                description="Foster seamless communication and engagement among workbody members"
              />
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-pec-green" />}
                title="Secure Access"
                description="Role-based permissions ensure information security and appropriate access levels"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold mb-4">About PEC Pulse</h2>
                <p className="text-gray-700">
                  PEC Pulse is a secure, WCAG‑AA compliant, role‑based workbody management portal 
                  designed specifically for the Pakistan Engineering Council (PEC). It provides 
                  a comprehensive solution for managing committees, working groups, and task forces, 
                  ensuring effective governance and oversight.
                </p>
                <p className="text-gray-700">
                  Our platform streamlines administrative processes, facilitates collaboration, 
                  and provides real-time insights into workbody performance, helping PEC achieve 
                  its strategic objectives efficiently.
                </p>
                <div className="pt-4">
                  <h3 className="font-semibold mb-2">Key Benefits:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-pec-green mr-2 mt-0.5" />
                      <span>Streamlined workbody management and coordination</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-pec-green mr-2 mt-0.5" />
                      <span>Enhanced transparency and accountability</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-pec-green mr-2 mt-0.5" />
                      <span>Improved decision-making through data-driven insights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-pec-green mr-2 mt-0.5" />
                      <span>Secure, role-based access to sensitive information</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-6">Workbody Types</h3>
                  <div className="space-y-4">
                    <WorkbodyTypeCard 
                      title="Committees"
                      description="Standing groups tasked with ongoing oversight and governance responsibilities"
                      count={12}
                    />
                    <WorkbodyTypeCard 
                      title="Working Groups"
                      description="Specialized teams focused on specific technical or operational projects"
                      count={24}
                    />
                    <WorkbodyTypeCard 
                      title="Task Forces"
                      description="Time-limited groups established to address specific challenges or initiatives"
                      count={8}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about PEC Pulse
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <FaqItem 
                question="How do I request access to PEC Pulse?"
                answer="Access is granted based on your role within the Pakistan Engineering Council. If you are a committee member, working group participant, or task force member, please contact your workbody coordinator or the PEC administration office to request access."
              />
              <FaqItem 
                question="What browsers are supported?"
                answer="PEC Pulse supports all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for optimal performance and security."
              />
              <FaqItem 
                question="How secure is the platform?"
                answer="PEC Pulse implements industry-standard security measures including HTTPS, HSTS, Content-Security-Policy, rate limiting, encryption of sensitive data at rest, and daily backups. All user activities are logged for audit purposes."
              />
              <FaqItem 
                question="Can I access PEC Pulse on mobile devices?"
                answer="Yes, PEC Pulse is fully responsive and works on smartphones and tablets. The interface automatically adapts to different screen sizes for an optimal user experience."
              />
              <FaqItem 
                question="How do I report an issue or suggest a feature?"
                answer="Please use the feedback form available in the platform's settings menu or contact the technical support team at support@pecpulse.pk."
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-pec-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Have questions or need assistance? Get in touch with the PEC Pulse team
              </p>
            </div>
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-pec-green p-8 text-white">
                  <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <p className="flex items-start">
                      <span className="mr-3">📍</span>
                      <span>Pakistan Engineering Council, Ataturk Avenue, G-5/2, Islamabad</span>
                    </p>
                    <p className="flex items-center">
                      <span className="mr-3">✉️</span>
                      <span>info@pec.org.pk</span>
                    </p>
                    <p className="flex items-center">
                      <span className="mr-3">📞</span>
                      <span>+92-51-111-111-732</span>
                    </p>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-pec-green-100 focus:border-pec-green"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-pec-green-100 focus:border-pec-green"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-pec-green-100 focus:border-pec-green"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-pec-green-100 focus:border-pec-green"
                        placeholder="Type your message here..."
                      ></textarea>
                    </div>
                    <div>
                      <Button className="w-full bg-pec-green hover:bg-pec-green-600 text-white">
                        Send Message
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
                  alt="PEC Logo" 
                  className="h-10 w-auto filter brightness-0 invert" 
                />
                <h2 className="text-xl font-bold">PEC Pulse</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Pakistan Engineering Council's comprehensive workbody management platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="#contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.pec.org.pk/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    Official Website
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Pakistan Engineering Council. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-2 hover:border-pec-green-100">
      <CardContent className="p-6">
        <div className="bg-pec-green-50 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

// Workbody Type Card Component
const WorkbodyTypeCard = ({ title, description, count }: { 
  title: string; 
  description: string; 
  count: number;
}) => {
  return (
    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-pec-green-50 transition-colors">
      <div className="mr-4 bg-pec-green-100 text-pec-green font-bold rounded-full w-12 h-12 flex items-center justify-center">
        {count}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// FAQ Item Component
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <ChevronDown 
          className={cn(
            "h-5 w-5 text-gray-500 transition-transform", 
            isOpen ? "transform rotate-180" : ""
          )} 
        />
      </button>
      <div className={cn(
        "mt-2 text-gray-600 overflow-hidden transition-all duration-300",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <p className="pb-4">{answer}</p>
      </div>
    </div>
  );
};

export default Index;
