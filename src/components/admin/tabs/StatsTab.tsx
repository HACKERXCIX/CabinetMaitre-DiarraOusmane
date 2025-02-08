
import VisitsChart from "@/components/admin/VisitsChart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VisitStat {
  visited_at: string;
}

interface PropertySearchStat {
  id: string;
  property_id: string;
  search_date: string;
  search_type: string;
  architecture_preference: string | null;
  location_preference: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
}

const StatsTab = () => {
  const { data: visitStats } = useQuery({
    queryKey: ["visitStats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_visits").select("*");
      if (error) throw error;
      return data as VisitStat[];
    },
  });

  const { data: propertySearchStats } = useQuery({
    queryKey: ["propertySearchStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_search_stats")
        .select(`
          *,
          property:properties(title, location, price)
        `);
      if (error) throw error;
      return data;
    },
  });

  const formatVisitData = (visits: VisitStat[] = []) => {
    return visits.reduce((acc: { name: string; visits: number }[], visit) => {
      const date = new Date(visit.visited_at).toLocaleDateString();
      const existing = acc.find((item) => item.name === date);
      if (existing) {
        existing.visits += 1;
      } else {
        acc.push({ name: date, visits: 1 });
      }
      return acc;
    }, []);
  };

  const formatPropertySearchData = () => {
    if (!propertySearchStats) return [];

    const locationStats = propertySearchStats.reduce((acc: any, stat) => {
      if (stat.location_preference) {
        acc[stat.location_preference] = (acc[stat.location_preference] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(locationStats).map(([name, count]) => ({
      name,
      count,
    }));
  };

  return (
    <div className="space-y-6">
      <VisitsChart data={formatVisitData(visitStats)} title="Visites du site" />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Statistiques des recherches immobilières
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Localisations les plus recherchées</h3>
            <div className="space-y-2">
              {formatPropertySearchData().map((stat: any) => (
                <div key={stat.name} className="flex justify-between items-center">
                  <span>{stat.name}</span>
                  <span className="font-semibold">{stat.count} recherches</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Types de recherche</h3>
            <div className="space-y-2">
              {propertySearchStats?.reduce((acc: any, stat) => {
                acc[stat.search_type] = (acc[stat.search_type] || 0) + 1;
                return acc;
              }, {}) &&
                Object.entries(
                  propertySearchStats?.reduce((acc: any, stat) => {
                    acc[stat.search_type] = (acc[stat.search_type] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="capitalize">{type}</span>
                    <span className="font-semibold">
                      {String(count)} recherches
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
