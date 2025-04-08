
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

const FAQSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer a comprehensive range of digital services including web design and development, digital marketing, branding, UI/UX design, SEO, and content creation. Our team works closely with you to deliver tailored solutions that meet your specific business needs."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on scope and complexity. A simple website might take 2-4 weeks, while more complex applications can take 2-3 months. During our initial consultation, we'll provide a detailed timeline based on your specific requirements."
    },
    {
      question: "What is your pricing structure?",
      answer: "We offer flexible pricing options tailored to your needs. This includes project-based quotes, retainer arrangements, and growth-based partnerships. We believe in transparent pricing and will provide detailed quotes after understanding your project scope."
    },
    {
      question: "Do you offer ongoing support after project completion?",
      answer: "Absolutely! We provide comprehensive maintenance packages to ensure your digital assets remain secure, up-to-date, and performing optimally. Our support includes regular updates, security monitoring, performance optimization, and technical assistance."
    },
    {
      question: "How do you measure success for your clients?",
      answer: "We establish clear KPIs at the beginning of each project, aligned with your business objectives. These may include metrics like conversion rates, organic traffic growth, engagement metrics, or ROI on digital marketing campaigns. We provide regular reports to track progress."
    },
    {
      question: "Can you work with clients internationally?",
      answer: "Yes, we work with clients worldwide. Our digital workflow and communication tools allow us to collaborate effectively across different time zones, providing the same level of service excellence to international clients as we do to local ones."
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
            Have questions? We've got answers. If you don't see what you're looking for, feel free to contact us.
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
                    {faq.answer}
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
