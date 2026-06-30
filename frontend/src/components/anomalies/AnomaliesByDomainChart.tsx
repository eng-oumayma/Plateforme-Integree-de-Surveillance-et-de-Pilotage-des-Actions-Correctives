// src/components/anomalies/AnomaliesByDomainChart.tsx
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { anomalyService } from "../../services/anomalyService";

const CRIT_COLORS: Record<string, string> = {
  FAIBLE: "#4CAF50",
  MODERE: "#FFC107",
  CRITIQUE: "#FF9800",
  BLOQUANT: "#F44336",
};

const CRIT_LABELS: Record<string, string> = {
  FAIBLE: "Faible",
  MODERE: "Modéré",
  CRITIQUE: "Critique",
  BLOQUANT: "Bloquant",
};

export default function AnomaliesByDomainChart({ filters }: { filters?: any }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Récupérer toutes les anomalies avec les filtres actifs
        const anomalies = await anomalyService.getAll(filters);

        // Grouper par domaine avec décompte par criticité
        const byDomaine: Record<string, Record<string, number>> = {};
        for (const a of anomalies) {
          const d = a.domaine || "Non spécifié";
          if (!byDomaine[d])
            byDomaine[d] = { FAIBLE: 0, MODERE: 0, CRITIQUE: 0, BLOQUANT: 0 };
          byDomaine[d][a.criticite] = (byDomaine[d][a.criticite] ?? 0) + 1;
        }

        const formatted = Object.entries(byDomaine)
          .map(([domaine, counts]) => ({ domaine, ...counts }))
          .sort((a: any, b: any) => {
            const totalA = a.FAIBLE + a.MODERE + a.CRITIQUE + a.BLOQUANT;
            const totalB = b.FAIBLE + b.MODERE + b.CRITIQUE + b.BLOQUANT;
            return totalB - totalA;
          });

        setData(formatted);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [JSON.stringify(filters)]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={24} />
      </Box>
    );

  if (data.length === 0)
    return (
      <Box
        sx={{
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Aucune anomalie à afficher
        </Typography>
      </Box>
    );

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Anomalies par domaine et criticité
      </Typography>
      <ResponsiveContainer
        width="100%"
        height={Math.max(200, data.length * 50)}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 20, right: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#999" }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="domaine"
            tick={{ fontSize: 12, fill: "#444" }}
            width={130}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              fontSize: 12,
              border: "1px solid #eee",
            }}
            formatter={(value: number, name: string) => [
              value,
              CRIT_LABELS[name] ?? name,
            ]}
          />
          <Legend
            formatter={(value: string) => CRIT_LABELS[value] ?? value}
            wrapperStyle={{ fontSize: 12 }}
          />
          {Object.keys(CRIT_COLORS).map((crit) => (
            <Bar
              key={crit}
              dataKey={crit}
              stackId="a"
              fill={CRIT_COLORS[crit]}
              radius={crit === "BLOQUANT" ? [0, 4, 4, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
