import React from "react";

interface ClientLogo {
  id: number;
  name: string;
  imageUrl: string;
}

interface ClientLogosProps {
  logos: ClientLogo[];
}

const ClientLogos: React.FC<ClientLogosProps> = ({ logos }) => {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6 text-center">Trusted by</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-center">
          {logos?.map((logo) => (
            <div key={logo.id} className="flex items-center justify-center">
              <img
                src={logo.imageUrl}
                alt={logo.name}
                className="h-12 object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
