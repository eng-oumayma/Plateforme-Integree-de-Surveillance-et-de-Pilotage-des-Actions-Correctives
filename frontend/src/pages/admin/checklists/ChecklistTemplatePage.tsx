// src/pages/checklists/ChecklistTemplatePage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { checklistService } from "../../../services/checklistService";

const COTATION_LABELS: Record<string, string> = {
  "0_1": "0 / 1",
  "0_1_2": "0 / 1 / 2",
  "0_1_2_NA": "0 / 1 / 2 / NA",
  "0_1_2_3": "0 / 1 / 2 / 3",
  "0_4_6_8_10": "0 / 4 / 6 / 8 / 10",
  TARGET: "Variable par item",
};

export default function ChecklistTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSects, setOpenSects] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    checklistService
      .getById(id)
      .then((t) => {
        setTemplate(t);
        // Ouvrir la première section par défaut
        const sects = Array.from(
          new Set(t.items.map((i: any) => i.section || "Général")),
        );
        if (sects[0]) setOpenSects({ [sects[0] as string]: true });
      })
      .catch(() => setError("Template introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  // Grouper les items par section
  const sections: Record<string, any[]> = {};
  template.items.forEach((item: any) => {
    const s = item.section || "Général";
    if (!sections[s]) sections[s] = [];
    sections[s].push(item);
  });

  const toggle = (s: string) =>
    setOpenSects((prev) => ({ ...prev, [s]: !prev[s] }));

  return (
    <Box maxWidth={760} mx="auto">
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/checklists")}
          color="inherit"
        >
          Retour
        </Button>
        <Box flex={1}>
          <Typography variant="h5" fontWeight={700}>
            {template.titre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aperçu read-only · {template.items.length} items
          </Typography>
        </Box>
        {/* Badges */}
        <Chip label={template.domaine} variant="outlined" />
        <Chip label={`v${template.version}`} size="small" variant="outlined" />
        <Chip
          label={template.actif ? "Actif" : "Inactif"}
          size="small"
          color={template.actif ? "success" : "default"}
        />
      </Box>

      {/* Infos template */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box display="flex" gap={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Cotation
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {COTATION_LABELS[template.cotationType] ??
                  template.cotationType}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Sections
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {Object.keys(sections).length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Items actifs
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {template.items.filter((i: any) => i.actif).length}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Items par section — READ ONLY */}
      {Object.entries(sections).map(([section, items]) => (
        <Card
          key={section}
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            mb: 1.5,
            overflow: "hidden",
          }}
        >
          {/* Header section cliquable */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={2}
            py={1.5}
            sx={{
              bgcolor: "grey.50",
              cursor: "pointer",
              "&:hover": { bgcolor: "grey.100" },
            }}
            onClick={() => toggle(section)}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" fontWeight={600}>
                {section}
              </Typography>
              <Chip
                label={`${items.length} items`}
                size="small"
                variant="outlined"
                sx={{ height: 18, fontSize: 10 }}
              />
            </Box>
            {openSects[section] ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </Box>

          <Collapse in={!!openSects[section]}>
            <Divider />
            {items.map((item: any, idx: number) => (
              <Box
                key={item.id}
                display="grid"
                gridTemplateColumns="24px 1fr auto"
                gap={1.5}
                alignItems="flex-start"
                sx={{
                  px: 2,
                  py: 1.25,
                  borderBottom: idx < items.length - 1 ? "0.5px solid" : "none",
                  borderColor: "divider",
                  opacity: item.actif ? 1 : 0.4,
                }}
              >
                {/* Numéro */}
                <Typography variant="caption" color="text.disabled" pt={0.25}>
                  {idx + 1}
                </Typography>

                {/* Libellé + target */}
                <Box>
                  <Typography variant="body2">{item.libelle}</Typography>
                  {item.target && (
                    <Typography variant="caption" color="text.secondary">
                      Cible : {item.target}
                    </Typography>
                  )}
                </Box>

                {/* Cotation attendue — juste visuelle, pas cliquable */}
                <Box display="flex" gap={0.5}>
                  {COTATION_LABELS[template.cotationType]
                    ?.split(" / ")
                    .map((v: string) => (
                      <Chip
                        key={v}
                        label={v}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          color: "text.disabled",
                          borderColor: "divider",
                        }}
                      />
                    ))}
                </Box>
              </Box>
            ))}
          </Collapse>
        </Card>
      ))}
    </Box>
  );
}
