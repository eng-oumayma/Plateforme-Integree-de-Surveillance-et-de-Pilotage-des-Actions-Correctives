// src/components/checklists/DeviationForm.tsx
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

type Props = {
  observation: string;
  analyseCauses: string;
  responsable: string;
  delai: string;
  onChange: (field: string, val: string) => void;
  disabled?: boolean;
};

export default function DeviationForm({
  observation,
  analyseCauses,
  responsable,
  delai,
  onChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(
    !!(observation || analyseCauses || responsable || delai),
  );

  return (
    <Box>
      {/* Toggle */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        onClick={() => setOpen((p) => !p)}
        sx={{ cursor: "pointer", py: 0.5, userSelect: "none" }}
      >
        <WarningAmberIcon
          fontSize="small"
          color={open ? "warning" : "disabled"}
        />
        <Typography
          variant="body2"
          color={open ? "warning.main" : "text.secondary"}
        >
          {open
            ? "Masquer la déviation"
            : "Ajouter une déviation / observation"}
        </Typography>
      </Box>

      <Collapse in={open}>
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            border: "1px solid",
            borderColor: "warning.light",
            borderRadius: 2,
            bgcolor: "warning.lighter",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <TextField
            label="Observation / Déviation"
            value={observation}
            onChange={(e) => onChange("observation", e.target.value)}
            multiline
            rows={2}
            fullWidth
            size="small"
            disabled={disabled}
            placeholder="Décrivez la non-conformité observée..."
          />
          <TextField
            label="Analyse des causes"
            value={analyseCauses}
            onChange={(e) => onChange("analyseCauses", e.target.value)}
            multiline
            rows={2}
            fullWidth
            size="small"
            disabled={disabled}
            placeholder="Quelles sont les causes de cette déviation ?"
          />
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
            <TextField
              label="Responsable"
              value={responsable}
              onChange={(e) => onChange("responsable", e.target.value)}
              fullWidth
              size="small"
              disabled={disabled}
              placeholder="Nom du responsable"
            />
            <TextField
              label="Délai"
              type="date"
              value={delai}
              onChange={(e) => onChange("delai", e.target.value)}
              fullWidth
              size="small"
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
