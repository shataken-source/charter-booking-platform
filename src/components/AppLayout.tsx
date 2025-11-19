import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Anchor, MapPin, Users, Award, Globe } from 'lucide-react';
import { featuredCharters } from '@/data/featuredCharters';
import { SuggestionBox } from './SuggestionBox';

export default function AppLayout() {
  const [selectedCharter, setSelectedCharter] = useState<any>(null);
  const [showSuggestionBox, setShowSuggestionBox] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Anchor className="w-8 h-8" />
              <span className="text-xl font-bold">Gulf Coast Charters</span>
            </div>
            <div className="hidden md:flex space-x-4 items-center text-sm">
              <button onClick={() => document.getElementById('charters')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-100">Charters</button>
              <button onClick={() => setShowSuggestionBox(true)} className="hover:text-blue-100">Feedback</button>
              <Button size="sm" className="bg-white text-blue-600">Login</Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative h-[500px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-cyan-900/60 z-10"></div>
        <img src="https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763349026286_fce8a245.webp" alt="Gulf Coast" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-6xl font-bold mb-4">Gulf Coast's Premier Fishing Charters</h1>
          <p className="text-xl mb-6">From Texas to Florida</p>
          <Button size="lg" className="bg-white text-blue-600" onClick={() => document.getElementById('charters')?.scrollIntoView({ behavior: 'smooth' })}>Browse Charters</Button>
        </div>
      </section>

      <section id="charters" className="container mx-auto px-4 py-12">
        <h2 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Featured Charters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredCharters.map(charter => (
            <div key={charter.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer" onClick={() => setSelectedCharter(charter)}>
              <img src={charter.image} alt={charter.name} className="w-full h-48 object-cover rounded-t-xl" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{charter.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{charter.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">${charter.price}</span>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">Book</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          <div><Anchor className="w-12 h-12 mx-auto mb-2" /><div className="text-3xl font-bold">500+</div><div>Charters</div></div>
          <div><Globe className="w-12 h-12 mx-auto mb-2" /><div className="text-3xl font-bold">5 States</div><div>Coverage</div></div>
          <div><Users className="w-12 h-12 mx-auto mb-2" /><div className="text-3xl font-bold">15K+</div><div>Anglers</div></div>
          <div><Award className="w-12 h-12 mx-auto mb-2" /><div className="text-3xl font-bold">4.8★</div><div>Rating</div></div>
        </div>
      </section>

      {selectedCharter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCharter(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-t-4 border-t-blue-600" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-3xl font-bold mb-2">{selectedCharter.name}</h2>
              <p className="text-blue-100">Your Gulf Coast Fishing Adventure Awaits</p>
            </div>
            <div className="p-6">
              <img src={selectedCharter.image} alt={selectedCharter.name} className="w-full h-64 object-cover rounded-lg mb-4" />
              <p className="text-gray-700 mb-4 leading-relaxed">{selectedCharter.description}</p>
              <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Starting at</p>
                  <p className="text-3xl font-bold text-blue-600">${selectedCharter.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{selectedCharter.location}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Book Now</Button>
                <Button variant="outline" onClick={() => setSelectedCharter(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuggestionBox && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowSuggestionBox(false)}>
          <div className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <SuggestionBox userType="customer" />
            <Button className="w-full mt-4" variant="outline" onClick={() => setShowSuggestionBox(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
