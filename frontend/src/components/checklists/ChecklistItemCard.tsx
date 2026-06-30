// src/components/checklists/ChecklistItemCard.tsx
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CotationSelector from "./CotationSelector";
import DeviationForm from "./DeviationForm";
import PhotoCapture from "./PhotoCapture";
import { checklistResponseService } from "../../services/checklistResponseService";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CreateAnomalyModal from "../anomalies/CreateAnomalyModal";
import { Button } from "@mui/material";
type Photo = { id: string; url: string; originalName?: string };

type ItemState = {
  cotation: string | null;
  observation: string;
  analyseCauses: string;
  responsable: string;
  delai: string;
  isDeviation: boolean;
  photos: Photo[];
};

type Props = {
  index: number;
  item: {
    id: string;
    section: string;
    libelle: string;
    target?: string;
  };
  cotationType: string;
  inspectionId: string;
  initialState?: Partial<ItemState>;
  onStateChange: (itemId: string, state: ItemState) => void;
};

const defaultState = (): ItemState => ({
  cotation: null,
  observation: "",
  analyseCauses: "",
  responsable: "",
  delai: "",
  isDeviation: false,
  photos: [],
});

// Seuil pour considérer une réponse comme déviation
function isDeviationValue(cotationType: string, val: string): boolean {
  if (val === "NA") return false;
  const n = Number(val);
  if (cotationType === "0_1") return n === 0;
  if (cotationType === "0_1_2") return n === 0;
  if (cotationType === "0_1_2_NA") return n === 0;
  if (cotationType === "0_1_2_3") return n <= 1;
  if (cotationType === "0_4_6_8_10") return n <= 4;
  if (cotationType === "TARGET") return n === 0;
  return false;
}

export default function ChecklistItemCard({
  index,
  item,
  cotationType,
  inspectionId,
  initialState,
  onStateChange,
}: Props) {
  const [state, setState] = useState<ItemState>({
    ...defaultState(),
    ...initialState,
  });
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [anomalyModalOpen, setAnomalyModalOpen] = useState(false);
  // Sauvegarder automatiquement après chaque changement
  const save = async (newState: ItemState) => {
    if (!newState.cotation) return;
    setSaving(true);
    try {
      await checklistResponseService.saveResponse({
        inspectionId,
        itemId: item.id,
        cotation: newState.cotation,
        observation: newState.observation || undefined,
        analyseCauses: newState.analyseCauses || undefined,
        responsable: newState.responsable || undefined,
        delai: newState.delai || undefined,
        isDeviation: newState.isDeviation,
      });
    } catch {
      // Silencieux — la sauvegarde auto réessaiera
    } finally {
      setSaving(false);
    }
  };

  const update = async (patch: Partial<ItemState>) => {
    const newState = { ...state, ...patch };
    setState(newState);
    onStateChange(item.id, newState);
    await save(newState);
  };

  const handleCotation = (val: string) => {
    const isDeviation = isDeviationValue(cotationType, val);
    if (isDeviation && !expanded) setExpanded(true);
    update({ cotation: val, isDeviation });
  };

  const handleDeviation = (field: string, val: string) => {
    update({ [field]: val });
  };

  const answered = !!state.cotation;
  const isDeviation = state.isDeviation;

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: isDeviation
          ? "error.light"
          : answered
            ? "success.light"
            : "divider",
        borderRadius: 2,
        mb: 1.5,
        transition: "border-color .2s",
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header item */}
        <Box
          display="flex"
          alignItems="flex-start"
          gap={1}
          mb={1.5}
          onClick={() => setExpanded((p) => !p)}
          sx={{ cursor: "pointer" }}
        >
          {/* Indicateur répondu */}
          <Box mt={0.2}>
            {saving ? (
              <CircularProgress size={18} />
            ) : answered ? (
              <CheckCircleIcon
                fontSize="small"
                color={isDeviation ? "error" : "success"}
              />
            ) : (
              <RadioButtonUncheckedIcon fontSize="small" color="disabled" />
            )}
          </Box>

          <Box flex={1}>
            <Typography variant="body2" fontWeight={500} lineHeight={1.4}>
              {index + 1}. {item.libelle}
            </Typography>
            {item.target && (
              <Typography variant="caption" color="text.secondary">
                Cible : {item.target}
              </Typography>
            )}
          </Box>

          {/* Badge cotation actuelle */}
          {state.cotation && (
            <Chip
              label={state.cotation}
              size="small"
              color={isDeviation ? "error" : "success"}
              sx={{ fontWeight: 700, minWidth: 36 }}
            />
          )}
        </Box>

        {/* Cotation — toujours visible */}
        <Box mb={1.5}>
          <CotationSelector
            cotationType={cotationType}
            itemTarget={item.target}
            value={state.cotation}
            onChange={handleCotation}
          />
        </Box>

        {/* Déviation + Photos + Anomalie — dépliable */}
        <Collapse in={expanded || isDeviation}>
          <Box display="flex" flexDirection="column" gap={1.5}>
            <DeviationForm
              observation={state.observation}
              analyseCauses={state.analyseCauses}
              responsable={state.responsable}
              delai={state.delai}
              onChange={handleDeviation}
            />
            <PhotoCapture
              inspectionId={inspectionId}
              itemId={item.id}
              photos={state.photos}
              onPhotosChange={(photos) => update({ photos })}
            />

            {/* ── Bouton signaler anomalie ── */}
            <Button
              size="small"
              variant="outlined"
              color="warning"
              startIcon={<WarningAmberIcon fontSize="small" />}
              onClick={() => setAnomalyModalOpen(true)}
              sx={{ alignSelf: "flex-start", fontSize: 12 }}
            >
              Signaler une anomalie
            </Button>
          </Box>
        </Collapse>

        {/* ── Modal création anomalie ── */}
        <CreateAnomalyModal
          open={anomalyModalOpen}
          onClose={() => setAnomalyModalOpen(false)}
          inspectionId={inspectionId}
          checklistItemId={item.id}
          itemLibelle={item.libelle}
          onCreated={() => {
            // Optionnel : afficher une confirmation ou rafraîchir
          }}
        />

        {/* Lien "voir détails" si collapsed */}
        {!expanded && !isDeviation && answered && (
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={() => setExpanded(true)}
          >
            + Ajouter observation / photo
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
