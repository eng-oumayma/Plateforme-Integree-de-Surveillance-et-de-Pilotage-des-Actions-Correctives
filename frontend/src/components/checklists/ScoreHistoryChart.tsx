// src/components/checklists/ScoreHistoryChart.tsx
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { checklistResponseService } from "../../services/checklistResponseService";

const DOMAINES = [
  "Plant",
  "Magasin",
  "Sanitaires",
  "Cantine",
  "Chimique",
  "Locaux techniques",
  "Déchets",
  "Transport",
  "Infirmerie",
  "Recycleurs",
  "Incendie",
];

// Couleur selon le score
function dotColor(score: number): string {
  if (score >= 85) return "#4CAF50";
  if (score >= 75) return "#FFC107";
  return "#F44336";
}

// Tooltip personnalisé
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 1.5,
        boxShadow: 3,
        minWidth: 160,
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={700} color={dotColor(d.score)}>
        {d.score}%
      </Typography>
      <Chip
        label={d.status}
        size="small"
        color={
          d.status === "VERT"
            ? "success"
            : d.status === "JAUNE"
              ? "warning"
              : "error"
        }
        sx={{ mt: 0.5, fontWeight: 600, height: 20, fontSize: 11 }}
      />
    </Box>
  );
}

export default function ScoreHistoryChart() {
  const [domaine, setDomaine] = useState("Cantine");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await checklistResponseService.getScoreHistory(domaine);
        // Formater pour recharts
        const formatted = result.history.map((h: any) => ({
          date: new Date(h.date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
          }),
          score: h.score,
          status: h.status,
          inspectionId: h.inspectionId,
          dotColor: dotColor(h.score),
        }));
        setData(formatted);
      } catch {
        setError("Impossible de charger l'historique.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domaine]);

  // Stats résumé
  const avg = data.length
    ? Math.round(data.reduce((s, d) => s + d.score, 0) / data.length)
    : 0;
  const latest = data[data.length - 1]?.score ?? null;
  const trend =
    data.length >= 2
      ? data[data.length - 1].score - data[data.length - 2].score
      : null;

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Évolution du score
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Historique des inspections par domaine
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Domaine</InputLabel>
          <Select
            value={domaine}
            label="Domaine"
            onChange={(e) => setDomaine(e.target.value)}
          >
            {DOMAINES.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Stats rapides */}
      {data.length > 0 && (
        <Box display="flex" gap={2} mb={2}>
          <Box
            sx={{
              flex: 1,
              bgcolor: "grey.50",
              borderRadius: 2,
              p: 1.5,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Dernier score
            </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              color={dotColor(latest ?? 0)}
            >
              {latest}%
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: "grey.50",
              borderRadius: 2,
              p: 1.5,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Moyenne
            </Typography>
            <Typography variant="h6" fontWeight={700} color={dotColor(avg)}>
              {avg}%
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: "grey.50",
              borderRadius: 2,
              p: 1.5,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Tendance
            </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              color={
                trend === null
                  ? "text.secondary"
                  : trend >= 0
                    ? "success.main"
                    : "error.main"
              }
            >
              {trend === null ? "—" : trend >= 0 ? `+${trend}%` : `${trend}%`}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: "grey.50",
              borderRadius: 2,
              p: 1.5,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Inspections
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {data.length}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Graphique */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : data.length === 0 ? (
        <Box
          sx={{
            height: 200,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Aucune inspection pour le domaine {domaine}
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#999" }}
              tickLine={false}
              axisLine={{ stroke: "#eee" }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 85, 100]}
              tick={{ fontSize: 11, fill: "#999" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Seuils de conformité */}
            <ReferenceLine
              y={85}
              stroke="#4CAF50"
              strokeDasharray="4 3"
              label={{
                value: "VERT 85%",
                position: "right",
                fontSize: 10,
                fill: "#4CAF50",
              }}
            />
            <ReferenceLine
              y={75}
              stroke="#FFC107"
              strokeDasharray="4 3"
              label={{
                value: "JAUNE 75%",
                position: "right",
                fontSize: 10,
                fill: "#FFC107",
              }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#378ADD"
              strokeWidth={2.5}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <Dot
                    key={`dot-${payload.date}`}
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={dotColor(payload.score)}
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 7, stroke: "white", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Légende */}
      <Box display="flex" gap={2} mt={1.5} justifyContent="center">
        {[
          { color: "#4CAF50", label: "VERT ≥85%" },
          { color: "#FFC107", label: "JAUNE ≥75%" },
          { color: "#F44336", label: "ROUGE <75%" },
        ].map(({ color, label }) => (
          <Box key={label} display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: color,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
