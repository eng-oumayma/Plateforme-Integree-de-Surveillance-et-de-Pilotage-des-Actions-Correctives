// src/components/checklists/ScoreBar.tsx
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

type Props = {
  score: number;
  answered: number;
  total: number;
  deviations: number;
};

function getStatus(score: number): {
  label: string;
  color: "success" | "warning" | "error";
  barColor: string;
} {
  if (score >= 85)
    return { label: "VERT", color: "success", barColor: "#4CAF50" };
  if (score >= 75)
    return { label: "JAUNE", color: "warning", barColor: "#FFC107" };
  return { label: "ROUGE", color: "error", barColor: "#F44336" };
}

export default function ScoreBar({
  score,
  answered,
  total,
  deviations,
}: Props) {
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;
  const status = getStatus(score);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 2,
        py: 1.5,
      }}
    >
      {/* Score + statut */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Typography
            variant="h4"
            fontWeight={700}
            color={`${status.color}.main`}
          >
            {score}%
          </Typography>
          <Chip
            label={status.label}
            size="small"
            color={status.color}
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <Box textAlign="right">
          <Typography variant="body2" fontWeight={500}>
            {answered}/{total} items
          </Typography>
          {deviations > 0 && (
            <Typography variant="caption" color="error">
              {deviations} déviation(s)
            </Typography>
          )}
        </Box>
      </Box>

      {/* Barre progression */}
      <Box mb={0.5}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "grey.200",
            "& .MuiLinearProgress-bar": { bgcolor: status.barColor },
          }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Typography variant="caption" color="text.secondary">
          Progression : {progress}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Score conformité : {score}%
        </Typography>
      </Box>
    </Box>
  );
}
