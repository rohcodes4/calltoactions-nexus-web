import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Award } from 'lucide-react';
import TeamMember from '@/components/TeamMember';
import ContactForm from '@/components/ContactForm';

// Sample team data
const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & Creative Director",
    bio: "With over 15 years in the creative industry, Alex leads our team with vision and innovation.",
    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800&auto=format&fit=crop",
    socialLinks: [
      { platform: "linkedin" as const, url: "#" },
      { platform: "twitter" as const, url: "#" },
      { platform: "email" as const, url: "mailto:alex@TBD.com" },
    ]
  },
  {
    name: "Sarah Chen",
    role: "Lead Web Developer",
    bio: "Sarah brings technical expertise and problem-solving skills to create robust, scalable web solutions.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    socialLinks: [
      { platform: "linkedin" as const, url: "#" },
      { platform: "twitter" as const, url: "#" },
      { platform: "email" as const, url: "mailto:sarah@TBD.com" },
    ]
  },
  {
    name: "Michael Rodriguez",
    role: "Design Director",
    bio: "Michael's eye for design and attention to detail ensures our visual assets are both beautiful and effective.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    socialLinks: [
      { platform: "linkedin" as const, url: "#" },
      { platform: "twitter" as const, url: "#" },
      { platform: "email" as const, url: "mailto:michael@TBD.com" },
    ]
  },
  {
    name: "Olivia Williams",
    role: "Marketing Strategist",
    bio: "Olivia develops data-driven marketing strategies that help our clients reach their target audience effectively.",
    imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop",
    socialLinks: [
      { platform: "linkedin" as const, url: "#" },
      { platform: "twitter" as const, url: "#" },
      { platform: "email" as const, url: "mailto:olivia@TBD.com" },
    ]
  },
];

const milestones = [
  {
    year: "2013",
    title: "Company Founded",
    description: "TBD was established with a mission to provide innovative digital solutions.",
  },
  {
    year: "2015",
    title: "First Major Client",
    description: "Partnered with a Fortune 500 company for a complete digital transformation project.",
  },
  {
    year: "2017",
    title: "Team Expansion",
    description: "Grew our team to 15 professionals and moved to a larger office space.",
  },
  {
    year: "2019",
    title: "Industry Recognition",
    description: "Received multiple awards for excellence in web design and digital marketing.",
  },
  {
    year: "2021",
    title: "Service Expansion",
    description: "Added video production to our service offerings to provide more comprehensive solutions.",
  },
  {
    year: "2023",
    title: "International Presence",
    description: "Expanded our client base to include companies from Europe and Asia.",
  },
];

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-agency-dark pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-gradient">Us</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              We are a team of passionate creatives dedicated to helping brands thrive in the digital landscape.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-6">
                Our <span className="text-gradient">Story</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Founded in 2013, TBD began with a simple vision: to create digital experiences that not only look stunning but also drive real results for our clients.
              </p>
              <p className="text-gray-300 mb-6">
                Over the years, we've evolved from a small team of passionate designers to a full-service creative agency offering comprehensive solutions for businesses of all sizes. Our journey has been marked by continuous learning, innovation, and a relentless pursuit of excellence.
              </p>
              <p className="text-gray-300 mb-8">
                Today, we're proud to have worked with clients across various industries, helping them establish strong digital presences and achieve their business goals through strategic creative solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                {["Creativity", "Innovation", "Excellence", "Collaboration", "Results-Driven"].map((value, index) => (
                  <div key={index} className="flex items-center bg-agency-purple/10 px-4 py-2 rounded-full">
                    <CheckCircle size={16} className="text-agency-purple mr-2" />
                    <span className="text-white text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="glass-card p-6 rounded-lg h-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-gradient-to-br from-agency-purple/20 to-agency-blue/20 rounded-lg aspect-square"></div>
                  <div className="bg-gradient-to-br from-agency-blue/20 to-agency-purple/20 rounded-lg aspect-square row-span-2"></div>
                  <div className="bg-gradient-to-br from-agency-teal/20 to-agency-purple/20 rounded-lg aspect-square"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-agency-purple to-agency-blue flex items-center justify-center">
                <Award size={80} className="text-white" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-white mb-6">
                Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Our mission is to empower businesses through creative digital solutions that captivate, engage, and convert. We believe in the power of strategic design and innovative technology to transform how brands connect with their audience.
              </p>
              <p className="text-gray-300 mb-8">
                We are committed to delivering exceptional results that exceed our clients' expectations, fostering long-term partnerships based on trust, transparency, and mutual success.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">Vision</h3>
                  <p className="text-gray-400">
                    To be the leading creative agency known for innovative digital solutions that drive meaningful results.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">Values</h3>
                  <p className="text-gray-400">
                    Creativity, integrity, excellence, collaboration, and client success guide everything we do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our talented team of professionals brings diverse skills and experience to every project.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/contact">
              <Button 
                className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all group"
              >
                Join Our Team
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Timeline */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              A timeline of key milestones in our growth and evolution.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-agency-purple via-agency-blue to-agency-teal"></div>
            
            <div className="flex flex-col space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className={`glass-card p-6 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'} max-w-md`}>
                      <div className="text-agency-purple font-bold text-xl mb-2">{milestone.year}</div>
                      <h3 className="text-white text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-agency-purple flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Work With <span className="text-gradient">Us</span>
              </h2>
              <p className="text-gray-400">
                Ready to start your project? Get in touch and let's create something amazing together.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
