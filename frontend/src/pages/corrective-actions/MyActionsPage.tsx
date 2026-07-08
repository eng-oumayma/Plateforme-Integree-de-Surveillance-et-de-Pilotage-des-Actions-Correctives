// src/pages/corrective-actions/MyActionsPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DeadlineIndicator from "../../components/corrective-actions/DeadlineIndicator";
import { correctiveActionService } from "../../services/correctiveActionService";
import { useAuth } from "../../contexts/AuthContext";

const STATUS_CONFIG: Record<string, { label: string; color: any; bg: string }> =
  {
    A_FAIRE: { label: "À faire", color: "default", bg: "#F5F5F5" },
    EN_COURS: { label: "En cours", color: "info", bg: "#E3F2FD" },
    TERMINEE: { label: "Terminée", color: "warning", bg: "#FFF8E1" },
    VALIDEE: { label: "Validée", color: "success", bg: "#E8F5E9" },
    REJETEE: { label: "Rejetée", color: "error", bg: "#FFEBEE" },
  };

const CRIT_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  FAIBLE: { label: "Faible", color: "#2E7D32", bg: "#E8F5E9" },
  MODERE: { label: "Modéré", color: "#F57F17", bg: "#FFF8E1" },
  CRITIQUE: { label: "Critique", color: "#E65100", bg: "#FFF3E0" },
  BLOQUANT: { label: "Bloquant", color: "#C62828", bg: "#FFEBEE" },
};

export default function MyActionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPilote = user?.role === "PILOTE_ACTION";

  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatut, setFilterStatut] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = isPilote
        ? await correctiveActionService.getMyActions()
        : await correctiveActionService.getAll(
            filterStatut ? { statut: filterStatut } : undefined,
          );
      setActions(data);
    } catch {
      setError("Impossible de charger les actions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterStatut]);

  const filtered = filterStatut
    ? actions.filter((a) => a.statut === filterStatut)
    : actions;

  const urgentes = actions.filter((a) => {
    const d = new Date(a.deadline).getTime() - Date.now();
    return d <= 3 * 86400000 && !["VALIDEE", "TERMINEE"].includes(a.statut);
  }).length;

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {isPilote ? "Mes actions correctives" : "Actions correctives"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} action(s)
            {urgentes > 0 && (
              <Box
                component="span"
                sx={{ color: "error.main", fontWeight: 600, ml: 1 }}
              >
                · {urgentes} urgente(s) ⚠️
              </Box>
            )}
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={filterStatut}
            label="Statut"
            onChange={(e) => setFilterStatut(e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
              <MenuItem key={val} value={val}>
                {cfg.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={1.5} mb={3} flexWrap="wrap">
        {[
          {
            label: "Total",
            value: actions.length,
            color: "#1F3864",
            bg: "#EBF3FB",
          },
          {
            label: "À faire",
            value: actions.filter((a) => a.statut === "A_FAIRE").length,
            color: "#666",
            bg: "#F5F5F5",
          },
          {
            label: "En cours",
            value: actions.filter((a) => a.statut === "EN_COURS").length,
            color: "#1565C0",
            bg: "#E3F2FD",
          },
          {
            label: "Terminée",
            value: actions.filter((a) => a.statut === "TERMINEE").length,
            color: "#F57F17",
            bg: "#FFF8E1",
          },
          {
            label: "Validée",
            value: actions.filter((a) => a.statut === "VALIDEE").length,
            color: "#2E7D32",
            bg: "#E8F5E9",
          },
        ].map((s) => (
          <Paper
            key={s.label}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              p: 1.5,
              flex: 1,
              minWidth: 90,
              textAlign: "center",
              bgcolor: s.bg,
              cursor: "pointer",
            }}
            onClick={() =>
              setFilterStatut(
                s.label === "Total"
                  ? ""
                  : (Object.entries(STATUS_CONFIG).find(
                      ([, c]) => c.label === s.label,
                    )?.[0] ?? ""),
              )
            }
          >
            <Typography variant="h5" fontWeight={700} color={s.color}>
              {s.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {s.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            p: 6,
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary">Aucune action trouvée.</Typography>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={1.5}>
          {filtered.map((action) => {
            const crit = CRIT_CONFIG[action.criticite] ?? CRIT_CONFIG.MODERE;
            const status =
              STATUS_CONFIG[action.statut] ?? STATUS_CONFIG.A_FAIRE;
            const isUrgent = (() => {
              const d = new Date(action.deadline).getTime() - Date.now();
              return (
                d <= 3 * 86400000 &&
                !["VALIDEE", "TERMINEE"].includes(action.statut)
              );
            })();

            return (
              <Paper
                key={action.id}
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: isUrgent ? "error.light" : "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                  "&:hover": { boxShadow: 2 },
                }}
              >
                {/* Barre couleur criticité */}
                <Box sx={{ height: 4, bgcolor: crit.color }} />

                <Box p={2}>
                  {/* Titre + badges */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1.5}
                  >
                    <Box flex={1} mr={2}>
                      <Typography variant="body1" fontWeight={600} mb={0.5}>
                        {action.description}
                      </Typography>
                      {action.anomaly && (
                        <Typography variant="caption" color="text.secondary">
                          Anomalie : {action.anomaly.description}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" gap={0.75} flexShrink={0}>
                      <Chip
                        label={crit.label}
                        size="small"
                        sx={{
                          bgcolor: crit.bg,
                          color: crit.color,
                          fontWeight: 700,
                          height: 22,
                        }}
                      />
                      <Chip
                        label={status.label}
                        size="small"
                        color={status.color}
                        variant="outlined"
                        sx={{ height: 22 }}
                      />
                    </Box>
                  </Box>

                  {/* Progression — barre HTML native, pas Slider MUI */}
                  <Box mb={1.5}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Progression
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {action.progression}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "grey.200",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${action.progression}%`,
                          borderRadius: 3,
                          bgcolor:
                            action.progression === 100
                              ? "#4CAF50"
                              : action.progression >= 50
                                ? "#FFC107"
                                : "#378ADD",
                          transition: "width .3s",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Footer */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <DeadlineIndicator
                      deadline={action.deadline}
                      statut={action.statut}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/actions/${action.id}`)}
                    >
                      {isPilote ? "Mettre à jour" : "Détails"}
                    </Button>
                  </Box>

                  {!isPilote && action.pilote && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1}
                    >
                      Pilote : {action.pilote.firstName}{" "}
                      {action.pilote.lastName}
                    </Typography>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
