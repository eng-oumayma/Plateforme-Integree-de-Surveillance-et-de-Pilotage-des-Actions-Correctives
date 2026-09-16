
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { userService } from "../../services/userService";
import type {
  User,
  UserRole,
  CreateUserPayload,
  UpdateUserPayload,
} from "../../types";
import { useAuth } from "../../contexts/AuthContext";

// ── AccountStatus (doit correspondre exactement à votre backend) ────────────
type AccountStatus = "PENDING" | "ACTIVE" | "INACTIVE";

const ROLES = [
  { value: "ADMIN_HSEE" as UserRole, label: "Admin HSEE" },
  { value: "AUDITEUR" as UserRole, label: "Auditeur" },
  { value: "PILOTE_ACTION" as UserRole, label: "Pilote d'Action" },
];

const DEPARTMENTS = [
  "HSE",
  "Production",
  "Maintenance",
  "Qualité",
  "Logistique",
  "RH",
  "Direction",
];

const ROLE_COLORS: Record<string, "primary" | "success" | "warning"> = {
  ADMIN_HSEE: "primary",
  AUDITEUR: "success",
  PILOTE_ACTION: "warning",
};

// ── Couleur et label selon AccountStatus ────────────────────────────────────
const STATUS_CHIP: Record<
  AccountStatus,
  {
    label: string;
    color: "success" | "default" | "warning";
    variant: "filled" | "outlined";
  }
> = {
  ACTIVE: { label: "Actif", color: "success", variant: "filled" },
  INACTIVE: { label: "Inactif", color: "default", variant: "outlined" },
  PENDING: { label: "En attente", color: "warning", variant: "outlined" },
};

const defaultCreate: CreateUserPayload = {
  firstName: "",
  lastName: "",
  email: "",
  role: "AUDITEUR",
  department: "",
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formData, setFormData] = useState<CreateUserPayload>(defaultCreate);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [toggleTarget, setToggleTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Filtrage — utilise "status" (backend TypeORM) ─────────────────────────
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && u.status === "ACTIVE") ||
      (statusFilter === "inactive" && u.status === "INACTIVE") ||
      (statusFilter === "pending" && u.status === "PENDING");
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ── Create / Edit ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingUser(null);
    setFormData(defaultCreate);
    setFormError("");
    setDialogOpen(true);
  };

  const openEdit = (u: any) => {
    setEditingUser(u);
    setFormData({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      department: u.department,
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setFormError("");
    setSaving(true);

    // 🔥 AJOUTE CE LOG ICI :
    console.log("=== PAYLOAD ENVOYÉ AU BACKEND ===", {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role, // 👈 Regarde ce qui s'affiche ici dans ta console !
      department: formData.department,
    });
    try {
      if (editingUser) {
        const payload: UpdateUserPayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          department: formData.department,
          role: formData.role, // 👈 Assurez-vous que le rôle est inclus dans le payload
        };
        if (editingUser.id !== currentUser?.id) payload.role = formData.role;
        await userService.update(editingUser.id, payload);
      } else {
        await userService.create(formData);
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message;
      setFormError(msg || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle ACTIVE ↔ INACTIVE ──────────────────────────────────────────────
  const handleToggle = async () => {
    if (!toggleTarget) return;
    const makeActive = toggleTarget.status !== "ACTIVE";
    try {
      await userService.toggleActive(toggleTarget.id, makeActive);
      setToggleTarget(null);
      // Mise à jour optimiste immédiate
      setUsers((prev) =>
        prev.map((u) =>
          u.id === toggleTarget.id
            ? { ...u, status: makeActive ? "ACTIVE" : "INACTIVE" }
            : u,
        ),
      );
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message;
      alert(msg || "Erreur lors du changement de statut.");
    }
  };

  // ── Suppression ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userService.remove(deleteTarget.id);
      setDeleteTarget(null);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message;
      alert(msg || "Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    const blob = await userService.exportCsv();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utilisateurs-hsee-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // ── Colonnes ──────────────────────────────────────────────────────────────
  const columns: any[] = [
    {
      field: "name",
      headerName: "Utilisateur",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params: any) => (
        <Box display="flex" alignItems="center" gap={1.5} height="100%">
          <Avatar
            src={params.row.avatarUrl}
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: 12,
            }}
          >
            {params.row.firstName?.[0]}
            {params.row.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {params.row.firstName} {params.row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Rôle",
      width: 150,
      renderCell: (params: any) => {
        const label =
          ROLES.find((r) => r.value === params.row.role)?.label ||
          params.row.role;
        return (
          <Chip
            label={label}
            size="small"
            color={ROLE_COLORS[params.row.role] || "default"}
          />
        );
      },
    },
    { field: "department", headerName: "Département", width: 140 },
    {
      field: "status",
      headerName: "Statut",
      width: 130,
      renderCell: (params: any) => {
        // Lit directement "status" retourné par le backend TypeORM
        const s = (params.row.status || "PENDING") as AccountStatus;
        const cfg = STATUS_CHIP[s] || STATUS_CHIP.PENDING;
        return (
          <Chip
            label={cfg.label}
            size="small"
            color={cfg.color}
            variant={cfg.variant}
          />
        );
      },
    },
    {
      field: "crée en",
      headerName: "Date de création",
      width: 170,
      renderCell: (params: any) => (
        <Typography variant="caption" color="text.secondary">
          {params.row.createdAt
            ? new Date(params.row.createdAt).toLocaleString("fr-FR")
            : "—"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      renderCell: (params: any) => {
        const isSelf = params.row.id === currentUser?.id;
        const isActive = params.row.status === "ACTIVE";
        const isPending = params.row.status === "PENDING";
        return (
          <Box display="flex" gap={0.5} height="100%" alignItems="center">
            {/* Modifier */}
            <Tooltip title="Modifier">
              <IconButton size="small" onClick={() => openEdit(params.row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Activer / Désactiver — pas sur soi-même ni PENDING */}
            {!isSelf && !isPending && (
              <Tooltip title={isActive ? "Désactiver" : "Activer"}>
                <IconButton
                  size="small"
                  onClick={() => setToggleTarget(params.row)}
                  color={isActive ? "warning" : "success"}
                >
                  {isActive ? (
                    <PersonOffIcon fontSize="small" />
                  ) : (
                    <PersonIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}

            {/* Supprimer — pas sur soi-même */}
            {!isSelf && (
              <Tooltip title="Supprimer">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setDeleteTarget(params.row)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

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
          <Typography variant="h5" fontWeight={600}>
            Gestion des utilisateurs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {users.filter((u) => u.status === "ACTIVE").length} actif(s) ·{" "}
            {users.length} total
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Exporter CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Nouvel utilisateur
          </Button>
        </Box>
      </Box>

      {/* Filtres */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Rôle</InputLabel>
          <Select
            value={roleFilter}
            label="Rôle"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">Tous les rôles</MenuItem>
            {ROLES.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={statusFilter}
            label="Statut"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="active">Actifs</MenuItem>
            <MenuItem value="inactive">Inactifs</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* DataGrid */}
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
          sx={{ border: "none" }}
        />
      </Paper>

      {/* Dialog Créer/Modifier */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
            <TextField
              label="Prénom"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <TextField
              label="Nom"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </Box>
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            fullWidth
            required
            disabled={!!editingUser}
            sx={{ mt: 2 }}
            helperText={editingUser ? "L'email ne peut pas être modifié" : ""}
          />
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={2}>
            <FormControl required>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={formData.role}
                label="Rôle"
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
                disabled={!!editingUser && editingUser.id === currentUser?.id}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl required>
              <InputLabel>Département</InputLabel>
              <Select
                value={formData.department}
                label="Département"
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {!editingUser && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Un email de bienvenue sera envoyé avec un lien pour définir le mot
              de passe (valable 48h).
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              saving ||
              !formData.firstName ||
              !formData.lastName ||
              !formData.email ||
              !formData.department
            }
          >
            {saving ? (
              <CircularProgress size={20} />
            ) : editingUser ? (
              "Enregistrer"
            ) : (
              "Créer"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Toggle statut */}
      <Dialog
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {toggleTarget?.status === "ACTIVE"
            ? "Désactiver le compte"
            : "Activer le compte"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {toggleTarget?.status === "ACTIVE"
              ? `Désactiver le compte de ${toggleTarget.firstName} ${toggleTarget.lastName} ? Toutes les sessions actives seront révoquées.`
              : `Réactiver le compte de ${toggleTarget?.firstName} ${toggleTarget?.lastName} ?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToggleTarget(null)}>Annuler</Button>
          <Button
            onClick={handleToggle}
            variant="contained"
            color={toggleTarget?.status === "ACTIVE" ? "warning" : "success"}
          >
            {toggleTarget?.status === "ACTIVE" ? "Désactiver" : "Activer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Supprimer */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: "error.main" }}>
          Supprimer le compte
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Cette action est <strong>irréversible</strong>.
          </Alert>
          <Typography variant="body2">
            Supprimer définitivement le compte de{" "}
            <strong>
              {deleteTarget?.firstName} {deleteTarget?.lastName}
            </strong>{" "}
            ({deleteTarget?.email}) ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Annuler</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
          >
            {deleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Supprimer définitivement"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
