// src/pages/checklists/ChecklistBuilderPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { checklistService } from "../../../services/checklistService";
import type {
  ChecklistItem,
  Domaine,
  CotationType,
} from "../../../types/checklist.types";

const DOMAINES: Domaine[] = [
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

const COTATION_OPTIONS = [
  { value: "0_1", label: "0 / 1  →  Locaux techniques, Chimique, Incendie" },
  { value: "0_1_2", label: "0 / 1 / 2  →  Cantine, Infirmerie, Transport" },
  { value: "0_1_2_NA", label: "0 / 1 / 2 / NA" },
  { value: "0_1_2_3", label: "0 / 1 / 2 / 3" },
  { value: "0_4_6_8_10", label: "0 / 4 / 6 / 8 / 10  →  Sanitaires" },
  {
    value: "TARGET",
    label: "Variable par item  →  Plant, Déchets (target = max)",
  },
];

const emptyItem = (): ChecklistItem => ({
  section: "",
  libelle: "",
  target: "",
  ordre: 0,
  actif: true,
});

export default function ChecklistBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  // Formulaire
  const [domaine, setDomaine] = useState<Domaine | "">("");
  const [titre, setTitre] = useState("");
  const [cotationType, setCotationType] = useState<CotationType | "">("");
  const [items, setItems] = useState<ChecklistItem[]>([emptyItem()]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Charger si mode édition
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    checklistService
      .getById(id)
      .then((t) => {
        setDomaine(t.domaine);
        setTitre(t.titre);
        setCotationType(t.cotationType);
        setItems(t.items.length > 0 ? t.items : [emptyItem()]);
      })
      .catch(() => setError("Template introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Gestion des items ────────────────────────────
  const addItem = () => {
    setItems((prev) => [...prev, { ...emptyItem(), ordre: prev.length }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof ChecklistItem,
    value: string | boolean,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  // ── Drag & drop natif HTML5 ───────────────────────
  const onDragStart = (index: number) => setDragIndex(index);
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const onDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const updated = [...items];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);
    setItems(updated.map((item, i) => ({ ...item, ordre: i })));
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const onDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // ── Grouper items par section ─────────────────────
  const sections = Array.from(
    new Set(items.map((i) => i.section || "Sans section")),
  );

  // ── Soumettre ─────────────────────────────────────
  const handleSubmit = async () => {
    if (!domaine || !titre || !cotationType) {
      setError("Remplissez le domaine, le titre et le type de cotation.");
      return;
    }
    const validItems = items.filter((i) => i.libelle.trim().length > 0);
    if (validItems.length === 0) {
      setError("Ajoutez au moins un item avec un libellé.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (isEdit && id) {
        await checklistService.update(id, {
          titre,
          cotationType,
          items: validItems,
        });
        setSuccess("Template mis à jour avec succès !");
      } else {
        await checklistService.create({
          domaine: domaine as Domaine,
          titre,
          cotationType: cotationType as CotationType,
          items: validItems,
        });
        setSuccess("Template créé avec succès !");
        setTimeout(() => navigate("/checklists"), 1500);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box maxWidth={900} mx="auto">
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/checklists")}
          color="inherit"
        >
          Retour
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {isEdit ? "Modifier le template" : "Nouveau template"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            US9 · Checklist builder
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Infos générales */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={2}
          >
            INFORMATIONS GÉNÉRALES
          </Typography>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
            <FormControl required disabled={isEdit}>
              <InputLabel>Domaine</InputLabel>
              <Select
                value={domaine}
                label="Domaine"
                onChange={(e) => setDomaine(e.target.value as Domaine)}
              >
                {DOMAINES.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl required>
              <InputLabel>Type de cotation</InputLabel>
              <Select
                value={cotationType}
                label="Type de cotation"
                onChange={(e) =>
                  setCotationType(e.target.value as CotationType)
                }
              >
                {COTATION_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Titre du template"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            fullWidth
            required
            placeholder="ex: Checklist Surveillance Cantine"
          />
        </CardContent>
      </Card>

      {/* Builder items */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
              >
                ITEMS DE LA CHECKLIST
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {items.filter((i) => i.libelle).length} item(s) ·
                Glisser-déposer pour réordonner
              </Typography>
            </Box>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              size="small"
              onClick={addItem}
            >
              Ajouter un item
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Header colonnes */}
          <Box
            display="grid"
            gridTemplateColumns="32px 1fr 1.5fr 1fr 40px"
            gap={1}
            sx={{ px: 1, mb: 1 }}
          >
            <Box />
            {["Section", "Libellé *", "Target / Critère", ""].map((h) => (
              <Typography
                key={h}
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                {h}
              </Typography>
            ))}
          </Box>

          {/* Liste items draggable */}
          {items.map((item, index) => (
            <Box
              key={index}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDrop={() => onDrop(index)}
              onDragEnd={onDragEnd}
              display="grid"
              gridTemplateColumns="32px 1fr 1.5fr 1fr 40px"
              gap={1}
              alignItems="center"
              sx={{
                p: 1,
                mb: 0.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor:
                  dragOverIndex === index ? "primary.main" : "divider",
                bgcolor:
                  dragIndex === index
                    ? "action.selected"
                    : dragOverIndex === index
                      ? "primary.lighter"
                      : "background.paper",
                cursor: "grab",
                transition: "border-color .15s, background .15s",
                "&:active": { cursor: "grabbing" },
              }}
            >
              {/* Poignée drag */}
              <DragIndicatorIcon
                fontSize="small"
                sx={{ color: "text.disabled", cursor: "grab" }}
              />

              {/* Section */}
              <TextField
                size="small"
                placeholder="Section"
                value={item.section}
                onChange={(e) => updateItem(index, "section", e.target.value)}
                fullWidth
              />

              {/* Libellé */}
              <TextField
                size="small"
                placeholder="Libellé de l'item *"
                value={item.libelle}
                onChange={(e) => updateItem(index, "libelle", e.target.value)}
                fullWidth
                required
              />

              {/* Target */}
              <TextField
                size="small"
                placeholder="Target / Critère"
                value={item.target || ""}
                onChange={(e) => updateItem(index, "target", e.target.value)}
                fullWidth
              />

              {/* Supprimer */}
              <Tooltip title="Supprimer">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}

          {/* Bouton ajouter en bas */}
          <Button
            startIcon={<AddIcon />}
            onClick={addItem}
            sx={{ mt: 1 }}
            size="small"
          >
            Ajouter un item
          </Button>
        </CardContent>
      </Card>

      {/* Preview sections */}
      {sections.some((s) => s !== "Sans section") && (
        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
              mb={2}
            >
              APERÇU PAR SECTION
            </Typography>
            {sections.map((section) => (
              <Box key={section} mb={1}>
                <Chip label={section} size="small" sx={{ mb: 0.5 }} />
                <Typography variant="caption" color="text.secondary" ml={1}>
                  {
                    items.filter(
                      (i) => (i.section || "Sans section") === section,
                    ).length
                  }{" "}
                  item(s)
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate("/checklists")}
          disabled={saving}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          startIcon={saving ? undefined : <SaveIcon />}
          onClick={handleSubmit}
          disabled={saving}
          sx={{ minWidth: 180 }}
        >
          {saving ? (
            <CircularProgress size={20} color="inherit" />
          ) : isEdit ? (
            "Enregistrer les modifications"
          ) : (
            "Créer le template"
          )}
        </Button>
      </Box>
    </Box>
  );
}
