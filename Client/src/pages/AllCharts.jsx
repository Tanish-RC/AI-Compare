import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientCharts } from "@/services/api";
import { Button } from "@/components/ui/button";

const AllCharts = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    fetchCharts();
  }, [clientId]);

  const fetchCharts = async () => {
    const data = await getClientCharts(clientId);
    setCharts(data);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="h-12 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/client/${clientId}`)}>
            ← Back to Client
          </Button>
          <h1 className="text-lg font-semibold">All Charts for Client</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-white">
        {charts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {charts.map((chart) => (
              <li
                key={chart._id}
                className="p-4 hover:bg-accent cursor-pointer rounded-md transition-colors"
                onClick={() => navigate(`/run/${chart._id}`)}
              >
                <div className="flex justify-between">
                  <h2 className="font-medium text-indigo-700">{chart.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {new Date(chart.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No charts found for this client.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllCharts;
