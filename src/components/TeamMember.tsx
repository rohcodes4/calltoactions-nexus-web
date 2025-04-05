
import { Card } from "@/components/ui/card";
import { LinkedIn, Twitter, Mail } from "lucide-react";

interface SocialLink {
  platform: "linkedin" | "twitter" | "email";
  url: string;
}

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks: SocialLink[];
}

const SocialIcons = {
  linkedin: LinkedIn,
  twitter: Twitter,
  email: Mail,
};

const TeamMember = ({ name, role, bio, imageUrl, socialLinks }: TeamMemberProps) => {
  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-purple-500/20 hover:border-agency-purple/30">
      <div className="relative overflow-hidden h-60">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-agency-darker to-transparent opacity-70"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-agency-purple text-sm font-medium mb-3">{role}</p>
        <p className="text-gray-400 text-sm mb-4">{bio}</p>
        <div className="flex space-x-3">
          {socialLinks.map((link, index) => {
            const Icon = SocialIcons[link.platform];
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-agency-purple/20 flex items-center justify-center transition-colors"
              >
                <Icon size={16} className="text-white" />
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default TeamMember;
