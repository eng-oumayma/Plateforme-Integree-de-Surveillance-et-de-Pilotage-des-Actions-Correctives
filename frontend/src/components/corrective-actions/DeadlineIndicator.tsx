// src/components/corrective-actions/DeadlineIndicator.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = { deadline: string; statut: string };

export default function DeadlineIndicator({ deadline, statut }: Props) {
  if (statut === "VALIDEE" || statut === "TERMINEE") {
    return (
      <Typography variant="caption" color="success.main" fontWeight={600}>
        ✅ Clôturée
      </Typography>
    );
  }

  const diffDays = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / 86400000,
  );
  const isExpired = diffDays < 0;
  const isUrgent = diffDays >= 0 && diffDays <= 3;

  const label = isExpired
    ? `Expiré depuis ${Math.abs(diffDays)}j`
    : diffDays === 0
      ? "Aujourd'hui !"
      : `${diffDays}j restant${diffDays > 1 ? "s" : ""}`;

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Typography variant="caption">
        {isExpired ? "🔴" : isUrgent ? "🟡" : "🕐"}
      </Typography>
      <Typography
        variant="caption"
        fontWeight={isUrgent || isExpired ? 700 : 400}
        color={
          isExpired
            ? "error.main"
            : isUrgent
              ? "warning.main"
              : "text.secondary"
        }
      >
        {new Date(deadline).toLocaleDateString("fr-FR")} · {label}
      </Typography>
    </Box>
  );
}
