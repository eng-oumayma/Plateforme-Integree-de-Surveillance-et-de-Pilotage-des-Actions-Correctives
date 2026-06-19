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
import { userService } from "../../services/userService";
import type {
  User,
  UserRole,
  CreateUserPayload,
  UpdateUserPayload,
} from "../../types";
import { useAuth } from "../../contexts/AuthContext";

const ROLES = [
  { value: "ADMIN_HSEE" as UserRole, label: "Admin HSEE" },
  { value: "AUDITEUR" as UserRole, label: "Auditeur" },
  { value: "PILOTE" as UserRole, label: "Pilote d'Action" },
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

const ROLE_COLORS: Record<UserRole, "primary" | "success" | "warning"> = {
  ADMIN_HSEE: "primary",
  AUDITEUR: "success",
  PILOTE: "warning",
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserPayload>(defaultCreate);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<User | null>(null);

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

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesStatus =
      !statusFilter || (statusFilter === "active" ? u.isActive : !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const openCreate = () => {
    setEditingUser(null);
    setFormData(defaultCreate);
    setFormError("");
    setDialogOpen(true);
  };

  const openEdit = (u: User) => {
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
    try {
      if (editingUser) {
        const payload: UpdateUserPayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          department: formData.department,
        };
        if (editingUser.id !== currentUser?.id) payload.role = formData.role;
        await userService.update(editingUser.id, payload);
      } else {
        await userService.create(formData);
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setFormError(msg || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!toggleTarget) return;
    try {
      await userService.toggleActive(toggleTarget.id, !toggleTarget.isActive);
      setToggleTarget(null);
      fetchUsers();
    } catch {
      /* ignore */
    }
  };

  const handleExport = async () => {
    const blob = await userService.exportCsv();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utilisateurs-hsee-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Columns typed as any[] to avoid version-specific GridColDef import issues
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
            color={ROLE_COLORS[params.row.role as UserRole] || "default"}
          />
        );
      },
    },
    {
      field: "department",
      headerName: "Département",
      width: 140,
    },
    {
      field: "isActive",
      headerName: "Statut",
      width: 110,
      renderCell: (params: any) => (
        <Chip
          label={params.row.isActive ? "Actif" : "Inactif"}
          size="small"
          color={params.row.isActive ? "success" : "default"}
          variant={params.row.isActive ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "lastLogin",
      headerName: "Dernière connexion",
      width: 170,
      renderCell: (params: any) => (
        <Typography variant="caption" color="text.secondary">
          {params.row.lastLogin
            ? new Date(params.row.lastLogin).toLocaleString("fr-FR")
            : "—"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: (params: any) => {
        const isSelf = params.row.id === currentUser?.id;
        return (
          <Box display="flex" gap={0.5} height="100%" alignItems="center">
            <Tooltip title="Modifier">
              <IconButton
                size="small"
                onClick={() => openEdit(params.row as User)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {!isSelf && (
              <Tooltip title={params.row.isActive ? "Désactiver" : "Activer"}>
                <IconButton
                  size="small"
                  onClick={() => setToggleTarget(params.row as User)}
                  color={params.row.isActive ? "error" : "success"}
                >
                  {params.row.isActive ? (
                    <PersonOffIcon fontSize="small" />
                  ) : (
                    <PersonIcon fontSize="small" />
                  )}
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
            {users.filter((u) => u.isActive).length} actif(s) · {users.length}{" "}
            total
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

      {/* Filters */}
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
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={statusFilter}
            label="Statut"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="active">Actifs</MenuItem>
            <MenuItem value="inactive">Inactifs</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* DataGrid — v5 syntax */}
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          autoHeight
          sx={{ border: "none" }}
        />
      </Paper>

      {/* Create/Edit Dialog */}
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
              de passe (valable 24h).
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

      {/* Toggle Active Confirm */}
      <Dialog
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {toggleTarget?.isActive
            ? "Désactiver le compte"
            : "Activer le compte"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {toggleTarget?.isActive
              ? `Désactiver le compte de ${toggleTarget.firstName} ${toggleTarget.lastName} ? Toutes les sessions actives seront révoquées. L'historique sera conservé.`
              : `Réactiver le compte de ${toggleTarget?.firstName} ${toggleTarget?.lastName} ?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToggleTarget(null)}>Annuler</Button>
          <Button
            onClick={handleToggle}
            variant="contained"
            color={toggleTarget?.isActive ? "error" : "success"}
          >
            {toggleTarget?.isActive ? "Désactiver" : "Activer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
