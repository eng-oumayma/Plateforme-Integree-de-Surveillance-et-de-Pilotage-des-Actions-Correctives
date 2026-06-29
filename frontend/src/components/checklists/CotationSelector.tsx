// src/components/checklists/CotationSelector.tsx
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type Props = {
  cotationType: string;
  itemTarget?: string;
  value: string | null;
  onChange: (val: string) => void;
  disabled?: boolean;
};

// Valeurs selon le type de cotation
function getValues(cotationType: string, target?: string): string[] {
  if (cotationType === "TARGET") {
    const max = Number(target) || 3;
    return Array.from({ length: max + 1 }, (_, i) => String(i));
  }
  const map: Record<string, string[]> = {
    "0_1": ["0", "1"],
    "0_1_2": ["0", "1", "2"],
    "0_1_2_NA": ["0", "1", "2", "NA"],
    "0_1_2_3": ["0", "1", "2", "3"],
    "0_4_6_8_10": ["0", "4", "6", "8", "10"],
  };
  return map[cotationType] ?? ["0", "1", "2"];
}

// Couleur selon la valeur
function getColor(
  val: string,
  selected: boolean,
): {
  bg: string;
  color: string;
  border: string;
} {
  if (!selected) return { bg: "transparent", color: "#666", border: "#ddd" };
  if (val === "NA") return { bg: "#9E9E9E", color: "#fff", border: "#9E9E9E" };
  const n = Number(val);
  if (n === 0) return { bg: "#F44336", color: "#fff", border: "#F44336" };
  if (n <= 1) return { bg: "#FF9800", color: "#fff", border: "#FF9800" };
  if (n <= 3) return { bg: "#FFC107", color: "#fff", border: "#FFC107" };
  return { bg: "#4CAF50", color: "#fff", border: "#4CAF50" };
}

export default function CotationSelector({
  cotationType,
  itemTarget,
  value,
  onChange,
  disabled,
}: Props) {
  const values = getValues(cotationType, itemTarget);

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        mb={0.5}
        display="block"
      >
        Cotation
      </Typography>
      <Box display="flex" gap={1} flexWrap="wrap">
        {values.map((val) => {
          const selected = value === val;
          const colors = getColor(val, selected);
          return (
            <Button
              key={val}
              variant={selected ? "contained" : "outlined"}
              size="small"
              disabled={disabled}
              onClick={() => onChange(val)}
              sx={{
                minWidth: 48,
                height: 48,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: selected ? colors.bg : "transparent",
                color: selected ? colors.color : "text.secondary",
                borderColor: selected ? colors.border : "divider",
                "&:hover": {
                  bgcolor: selected ? colors.bg : "action.hover",
                },
                transition: "all .15s",
              }}
            >
              {val}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
