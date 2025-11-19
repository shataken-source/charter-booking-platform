import { useState, useMemo } from 'react';
import { marineProducts } from '@/data/marineProducts';
import { MarineProduct } from '@/types/marineProduct';
import MarineProductCard from '@/components/MarineProductCard';
import MarineGearFilters from '@/components/MarineGearFilters';
import ProductComparisonModal from '@/components/ProductComparisonModal';
import { Button } from '@/components/ui/button';
import { ShoppingBag, GitCompare, Info } from 'lucide-react';

export default function MarineGearShop() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    retailer: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'featured'
  });
  
  const [compareList, setCompareList] = useState<MarineProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MarineProduct | null>(null);

  const filteredProducts = useMemo(() => {
    let result = [...marineProducts];

    if (filters.search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.retailer !== 'all') {
      result = result.filter(p => p.retailer === filters.retailer);
    }

    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.inStock) {
      result = result.filter(p => p.inStock);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [filters, marineProducts]);

  const addToCompare = (product: MarineProduct) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, product]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-teal-50">
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Marine Gear Shop</h1>
          </div>
          <p className="text-xl mb-4">Premium marine equipment from Amazon, Walmart & BoatUS</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-2xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Transparency Notice:</strong> Gulf Coast Charters earns a small commission when you purchase through our affiliate links. 
                This costs you nothing extra - you pay the same price, and it helps us keep this platform free for everyone!
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MarineGearFilters filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredProducts.length} products found</p>
              {compareList.length > 0 && (
                <Button onClick={() => {}}>
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare ({compareList.length})
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <MarineProductCard
                  key={product.id}
                  product={product}
                  onCompare={addToCompare}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProductComparisonModal
        products={compareList}
        onClose={() => setCompareList([])}
        onRemove={(id) => setCompareList(compareList.filter(p => p.id !== id))}
      />
    </div>
  );
}
