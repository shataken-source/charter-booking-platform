import { Anchor, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function Footer() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();


  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600/20 backdrop-blur-md rounded-full p-2">
                <Anchor className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{settings.companyName}</h3>
                <p className="text-xs text-blue-300">{settings.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Your premier destination for Gulf Coast fishing charters from Texas to Florida. Professional captains and unforgettable fishing experiences.
            </p>
            <div className="flex gap-3">
              {settings.facebook && (
                <a 
                  href={settings.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-blue-600 p-2 rounded-full transition"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.twitter && (
                <a 
                  href={settings.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-sky-500 p-2 rounded-full transition"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {settings.instagram && (
                <a 
                  href={settings.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-pink-600 p-2 rounded-full transition"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.linkedin && (
                <a 
                  href={settings.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-blue-700 p-2 rounded-full transition"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>


          <div>
            <h4 className="font-bold mb-4 text-blue-300 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#charters" className="text-gray-300 hover:text-blue-400 transition">Browse Charters</a></li>
              <li><a href="#destinations" className="text-gray-300 hover:text-blue-400 transition">Destinations</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#advertise" className="text-gray-300 hover:text-blue-400 transition">Advertise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-blue-300 text-lg">For Captains</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => navigate('/apply-captain')} 
                  className="text-gray-300 hover:text-blue-400 transition text-left"
                >
                  Become a Captain
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/captain-login')} 
                  className="text-gray-300 hover:text-blue-400 transition text-left"
                >
                  Captain Login
                </button>
              </li>
              <li><a href="#requirements" className="text-gray-300 hover:text-blue-400 transition">Requirements</a></li>
              <li><a href="#benefits" className="text-gray-300 hover:text-blue-400 transition">Benefits</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-blue-300 text-lg">Contact</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-blue-400 transition">{settings.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <a href={`tel:${settings.phone}`} className="hover:text-blue-400 transition">
                  {settings.phone.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-1" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">&copy; 2025 Gulf Coast Charters. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#terms" className="text-gray-400 hover:text-blue-400 transition">Terms of Service</a>
              <a href="#privacy" className="text-gray-400 hover:text-blue-400 transition">Privacy Policy</a>
              <a href="#cookies" className="text-gray-400 hover:text-blue-400 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
