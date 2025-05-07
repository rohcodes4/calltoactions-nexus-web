
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/services/databaseService';
import { formatBoldText } from '@/lib/utils';

const FAQSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Fetch services to build service-specific FAQs
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices
  });
  
  // Service-oriented FAQs
  const faqs = [
    {
      question: "What services do you offer?",
      answer: `We offer a comprehensive range of digital services including ${services.map(s => s.title).join(', ')}. Our team works closely with you to deliver tailored solutions that meet your specific business needs.`
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on scope and complexity. A simple website might take 2-4 weeks, while more complex applications can take 2-3 months. During our initial consultation, we'll provide a detailed timeline based on your **specific requirements**."
    },
    {
      question: "What is your pricing structure?",
      answer: "We offer flexible pricing options tailored to your needs. This includes project-based quotes, retainer arrangements, and growth-based partnerships. We believe in **transparent pricing** and will provide detailed quotes after understanding your project scope."
    },
    {
      question: "Do you offer ongoing support after project completion?",
      answer: "**Absolutely!** We provide comprehensive maintenance packages to ensure your digital assets remain secure, up-to-date, and performing optimally. Our support includes regular updates, security monitoring, performance optimization, and technical assistance."
    },
    {
      question: "How do you ensure my website will generate leads and conversions?",
      answer: "We implement **proven conversion strategies** including optimized user journeys, strategic call-to-actions, responsive design, and performance optimization. We also utilize analytics to continuously monitor and improve your site's conversion performance."
    },
    {
      question: "Can you help with marketing my business after the website is built?",
      answer: "**Yes!** Our digital marketing services include SEO, content marketing, social media management, paid advertising, and email marketing campaigns – all designed to drive traffic to your new website and convert visitors into customers."
    },
    {
      question: "What makes your agency different from others?",
      answer: "We combine **creative excellence** with **technical expertise** and a deep understanding of **business strategy**. Our process is highly collaborative, and we maintain complete transparency throughout. We measure our success by your results."
    }
  ];

  return (
    <section className="py-20 bg-agency-dark" ref={sectionRef} id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            Frequently <span className="text-gradient">Asked Questions</span>
          </motion.h2>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Have questions about our services? We've got answers. If you don't see what you're looking for, feel free to contact us.
          </motion.p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`} className="border-white/10 py-2">
                  <AccordionTrigger className="text-white text-left hover:text-agency-purple transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    <div dangerouslySetInnerHTML={{ __html: formatBoldText(faq.answer) }} />
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
