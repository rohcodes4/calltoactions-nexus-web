
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

const servicesData = {
  "web-design": {
    title: "Web Design",
    description: "Stunning, conversion-focused websites that captivate your audience and reflect your brand identity.",
    process: [
      {
        title: "Discovery",
        description: "We begin by understanding your business, target audience, and goals to create a strategic foundation for your website."
      },
      {
        title: "Wireframing",
        description: "We create wireframes to establish the layout and structure of your website, focusing on user experience and conversion paths."
      },
      {
        title: "Design",
        description: "Our designers create visually stunning mockups that align with your brand identity and capture your audience's attention."
      },
      {
        title: "Revisions",
        description: "We refine the design based on your feedback to ensure it meets your expectations and business requirements."
      },
      {
        title: "Handoff",
        description: "Once approved, we prepare the design files for development, ensuring a smooth transition to the next phase."
      }
    ],
    benefits: [
      "Increased user engagement",
      "Higher conversion rates",
      "Improved brand perception",
      "Enhanced user experience",
      "Mobile-friendly design",
      "Accessibility compliance"
    ],
    faqs: [
      {
        question: "How long does the web design process take?",
        answer: "The timeline varies depending on project complexity, but typically ranges from 2-4 weeks for design alone."
      },
      {
        question: "Do you only design websites, or do you develop them too?",
        answer: "We offer both design and development services, either separately or as a comprehensive package."
      },
      {
        question: "How do you ensure the design will convert visitors into customers?",
        answer: "We incorporate conversion-focused elements, strategic calls-to-action, and user-friendly navigation based on UX best practices."
      }
    ]
  },
  "web-development": {
    title: "Web Development",
    description: "Robust, scalable web applications built with cutting-edge technologies for optimal performance.",
    process: [
      {
        title: "Planning",
        description: "We define the technical requirements, architecture, and technology stack best suited for your project."
      },
      {
        title: "Development",
        description: "Our developers write clean, efficient code following best practices and industry standards."
      },
      {
        title: "Testing",
        description: "We conduct thorough testing to ensure functionality, performance, and compatibility across devices and browsers."
      },
      {
        title: "Deployment",
        description: "We handle the deployment process, ensuring a smooth transition to your live environment."
      },
      {
        title: "Maintenance",
        description: "We provide ongoing support and maintenance to keep your website secure, up-to-date, and optimized."
      }
    ],
    benefits: [
      "Fast loading speeds",
      "Secure and reliable performance",
      "Scalable architecture",
      "SEO-friendly structure",
      "Integration with third-party services",
      "Custom functionality"
    ],
    faqs: [
      {
        question: "What technologies do you use for web development?",
        answer: "We work with modern frameworks like React, Next.js, and Vue.js for frontend, and Node.js, Python, or PHP for backend development."
      },
      {
        question: "How do you ensure website security?",
        answer: "We implement secure coding practices, regular updates, SSL certificates, and follow OWASP guidelines to protect against common vulnerabilities."
      },
      {
        question: "Can you integrate my website with existing systems?",
        answer: "Yes, we specialize in integrating websites with CRMs, payment gateways, marketing tools, and other third-party services."
      }
    ]
  },
  "video-production": {
    title: "Video Production",
    description: "Compelling video content that tells your story and engages viewers across all platforms.",
    process: [
      {
        title: "Concept Development",
        description: "We work with you to develop a concept that aligns with your brand and effectively communicates your message."
      },
      {
        title: "Scriptwriting",
        description: "Our team creates a script that captures your voice and speaks directly to your target audience."
      },
      {
        title: "Production",
        description: "We handle all aspects of filming, including location scouting, equipment setup, and directing."
      },
      {
        title: "Editing",
        description: "Our editors craft the final product, incorporating music, graphics, and special effects as needed."
      },
      {
        title: "Delivery",
        description: "We provide the finished video in multiple formats optimized for different platforms and uses."
      }
    ],
    benefits: [
      "Increased engagement rates",
      "Enhanced brand storytelling",
      "Improved conversion rates",
      "Higher social media reach",
      "Professional brand representation",
      "Versatile marketing asset"
    ],
    faqs: [
      {
        question: "How long does video production take?",
        answer: "The timeline varies based on complexity, but typically ranges from 2-6 weeks from concept to final delivery."
      },
      {
        question: "What types of videos do you produce?",
        answer: "We create promotional videos, explainer videos, testimonials, product demos, company culture videos, and more."
      },
      {
        question: "Do you provide actors or should we use our own team?",
        answer: "We can provide professional actors or work with your team members depending on your preferences and budget."
      }
    ]
  },
  "graphic-design": {
    title: "Graphic Design",
    description: "Eye-catching visual assets that strengthen your brand and communicate your message effectively.",
    process: [
      {
        title: "Brief",
        description: "We start by understanding your brand, target audience, and design needs to establish clear objectives."
      },
      {
        title: "Research",
        description: "Our designers research industry trends and competitors to inform a unique and effective approach."
      },
      {
        title: "Concept Development",
        description: "We create initial design concepts that align with your brand identity and project goals."
      },
      {
        title: "Refinement",
        description: "Based on your feedback, we refine the designs to ensure they meet your expectations and requirements."
      },
      {
        title: "Delivery",
        description: "We provide the final designs in various formats suitable for both print and digital applications."
      }
    ],
    benefits: [
      "Consistent brand presentation",
      "Professional visual communication",
      "Increased brand recognition",
      "Effective message delivery",
      "Versatile marketing materials",
      "Enhanced visual appeal"
    ],
    faqs: [
      {
        question: "What types of graphic design services do you offer?",
        answer: "We offer logo design, brand identity, marketing materials, packaging design, social media graphics, and more."
      },
      {
        question: "Do I get ownership of the design files?",
        answer: "Yes, you receive full ownership of the final design files upon project completion and payment."
      },
      {
        question: "How many revisions are included in the design process?",
        answer: "Our standard packages include up to three rounds of revisions to ensure your complete satisfaction."
      }
    ]
  },
  "digital-marketing": {
    title: "Digital Marketing",
    description: "Strategic campaigns that increase your visibility, drive traffic, and convert leads into customers.",
    process: [
      {
        title: "Strategy Development",
        description: "We create a comprehensive marketing strategy based on your goals, target audience, and industry landscape."
      },
      {
        title: "Campaign Setup",
        description: "We set up and configure your campaigns across relevant channels with optimized targeting and messaging."
      },
      {
        title: "Content Creation",
        description: "Our team develops engaging content tailored to each platform and audience segment."
      },
      {
        title: "Implementation",
        description: "We launch and manage your campaigns, making real-time adjustments to maximize performance."
      },
      {
        title: "Analysis & Reporting",
        description: "We track results, analyze data, and provide detailed reports with actionable insights."
      }
    ],
    benefits: [
      "Increased brand awareness",
      "Higher website traffic",
      "Improved conversion rates",
      "Better ROI on marketing spend",
      "Data-driven decision making",
      "Targeted audience reach"
    ],
    faqs: [
      {
        question: "What digital marketing services do you offer?",
        answer: "We offer SEO, pay-per-click advertising, social media marketing, email marketing, content marketing, and analytics."
      },
      {
        question: "How do you measure the success of marketing campaigns?",
        answer: "We track key performance indicators (KPIs) such as traffic, conversions, engagement, and ROI to measure success."
      },
      {
        question: "How long does it take to see results from digital marketing?",
        answer: "While some tactics like PPC can show immediate results, others like SEO typically take 3-6 months to demonstrate significant impact."
      }
    ]
  }
};

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = serviceId ? servicesData[serviceId as keyof typeof servicesData] : null;
  
  if (!service) {
    return (
      <div className="flex flex-col min-h-screen bg-agency-dark pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Service Not Found</h1>
          <p className="text-gray-400 mb-8">The service you're looking for doesn't exist.</p>
          <Link to="/services">
            <Button>
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-agency-dark pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <Link to="/services" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to All Services
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-gray-300">
              {service.description}
            </p>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12">
            Our <span className="text-gradient">Process</span>
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-agency-purple to-agency-blue"></div>
            
            <div className="space-y-12">
              {service.process.map((step, index) => (
                <div key={index} className="flex">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-agency-purple/10 flex items-center justify-center text-agency-purple z-10 relative">
                      <span className="text-2xl font-bold">{index + 1}</span>
                    </div>
                    {index !== service.process.length - 1 && (
                      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 h-12 w-1 bg-gradient-to-b from-agency-purple to-transparent"></div>
                    )}
                  </div>
                  <div className="ml-8 glass-card p-6 flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Key <span className="text-gradient">Benefits</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Here's why our {service.title.toLowerCase()} services can make a difference for your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start p-6 glass-card">
                <CheckCircle size={24} className="text-agency-purple flex-shrink-0 mr-4" />
                <p className="text-white">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Common questions about our {service.title.toLowerCase()} services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {service.faqs.map((faq, index) => (
              <div key={index} className="glass-card overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to <span className="text-gradient">Get Started?</span>
              </h2>
              <p className="text-gray-400">
                Contact us today to discuss your {service.title.toLowerCase()} project.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
