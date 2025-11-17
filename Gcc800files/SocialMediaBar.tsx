import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function SocialMediaBar() {
  const { settings } = useSiteSettings();
  
  const socialLinks = [
    settings.facebook && { 
      icon: Facebook, 
      href: settings.facebook, 
      label: 'Facebook',
      color: 'hover:bg-blue-600'
    },
    settings.twitter && { 
      icon: Twitter, 
      href: settings.twitter, 
      label: 'Twitter',
      color: 'hover:bg-sky-500'
    },
    settings.instagram && { 
      icon: Instagram, 
      href: settings.instagram, 
      label: 'Instagram',
      color: 'hover:bg-pink-600'
    },
    settings.linkedin && { 
      icon: Linkedin, 
      href: settings.linkedin, 
      label: 'LinkedIn',
      color: 'hover:bg-blue-700'
    },
    settings.youtube && { 
      icon: Youtube, 
      href: settings.youtube, 
      label: 'YouTube',
      color: 'hover:bg-red-600'
    },
  ].filter(Boolean);


  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-2">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`bg-white/90 backdrop-blur-sm ${social.color} text-gray-700 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group`}
          aria-label={social.label}
        >
          <social.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}
