
import ContactForm from '@/components/ContactForm';

const ContactSection = () => {
  return (
    <section className="py-20 bg-agency-darker">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto glass-card p-8 md:p-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let's <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-gray-400">
              Ready to take your digital presence to the next level? Reach out to us!
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
