
import { Link } from 'react-router-dom';
import { Monitor, Code, Video, PenTool, BarChart, ArrowRight, CheckCircle, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ServiceCard';
import ContactForm from '@/components/ContactForm';

const servicesData = [
  {
    id: "web-design",
    title: "Web Design",
    description: "Stunning, conversion-focused websites that captivate your audience and reflect your brand identity.",
    icon: <Monitor size={24} />,
    details: "Our web design process focuses on creating visually appealing, user-friendly interfaces that drive engagement and conversions. We combine aesthetics with functionality to deliver websites that not only look great but also perform exceptionally well.",
    benefits: [
      "Custom design tailored to your brand",
      "Responsive layouts for all devices",
      "User experience (UX) optimization",
      "Conversion-focused design elements",
      "Brand consistency across all pages"
    ]
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Robust, scalable web applications built with cutting-edge technologies for optimal performance.",
    icon: <Code size={24} />,
    details: "We build powerful web applications using the latest technologies and best practices. Our development team creates scalable, secure, and high-performance websites that provide seamless user experiences.",
    benefits: [
      "Clean, efficient code structure",
      "Optimized performance and loading speed",
      "Secure development practices",
      "Custom functionality and features",
      "Seamless integration with third-party services"
    ]
  },
  {
    id: "video-production",
    title: "Video Production",
    description: "Compelling video content that tells your story and engages viewers across all platforms.",
    icon: <Video size={24} />,
    details: "From concept to final cut, we create video content that captivates your audience and communicates your message effectively. Our video production services cover everything from promotional videos to corporate presentations.",
    benefits: [
      "Professional scriptwriting and storyboarding",
      "High-quality filming and equipment",
      "Expert editing and post-production",
      "Animation and special effects",
      "Optimized for various platforms and devices"
    ]
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    description: "Eye-catching visual assets that strengthen your brand and communicate your message effectively.",
    icon: <PenTool size={24} />,
    details: "Our graphic design services help you create a strong visual identity that resonates with your target audience. From logos to marketing materials, we design assets that make your brand memorable and impactful.",
    benefits: [
      "Professional logo and brand identity design",
      "Print and digital marketing materials",
      "Packaging and product design",
      "Infographics and data visualization",
      "Social media graphics and templates"
    ]
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Strategic campaigns that increase your visibility, drive traffic, and convert leads into customers.",
    icon: <BarChart size={24} />,
    details: "We develop comprehensive digital marketing strategies that help you reach your target audience, increase brand awareness, and drive conversions. Our data-driven approach ensures optimal ROI for your marketing investments.",
    benefits: [
      "Search engine optimization (SEO)",
      "Pay-per-click (PPC) advertising",
      "Social media marketing and management",
      "Email marketing campaigns",
      "Analytics and performance tracking"
    ]
  }
];

const Services = () => {
  return (
    <div className="flex flex-col min-h-screen bg-agency-dark pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              We offer comprehensive creative solutions to help your brand thrive in the digital landscape. Our team of experts is committed to delivering exceptional results that exceed your expectations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {servicesData.map((service) => (
                <a 
                  key={service.id} 
                  href={`#${service.id}`} 
                  className="inline-flex items-center bg-white/5 hover:bg-agency-purple/10 text-white px-4 py-2 rounded-full transition-colors"
                >
                  {service.icon && <span className="mr-2">{service.icon}</span>}
                  {service.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Services List */}
      <section className="py-16 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                link={`/services/${service.id}`}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Individual Service Sections */}
      {servicesData.map((service) => (
        <section id={service.id} key={service.id} className="py-20 bg-agency-darker">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <div className="mb-6 flex items-center">
                  <div className="w-12 h-12 bg-agency-purple/10 rounded-lg flex items-center justify-center text-agency-purple mr-4">
                    {service.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-white">{service.title}</h2>
                </div>
                <p className="text-gray-300 mb-6">
                  {service.details}
                </p>
                <ul className="space-y-4 mb-8">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={18} className="text-agency-purple mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link to={`/services/${service.id}`}>
                  <Button 
                    className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all group"
                  >
                    Learn More About {service.title}
                    <ChevronsRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                </Link>
              </div>
              <div className="lg:w-1/2 glass-card p-6 rounded-lg">
                <div className="aspect-video w-full bg-gradient-to-br from-agency-purple/20 to-agency-blue/20 rounded-lg flex items-center justify-center">
                  <div className="text-6xl text-agency-purple/30">{service.icon}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
      
      {/* Call to Action */}
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to <span className="text-gradient">Get Started?</span>
              </h2>
              <p className="text-gray-400">
                Contact us today to discuss your project and how we can help bring your vision to life.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
