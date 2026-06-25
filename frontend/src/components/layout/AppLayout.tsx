import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChecklistIcon from "@mui/icons-material/Checklist";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BuildIcon from "@mui/icons-material/Build";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../contexts/AuthContext";
import InactivityDialog from "../common/InactivityDialog";

// ─── Constants ───────────────────────────────────────────────────────────────
const DRAWER_WIDTH = 256;

const ROLE_LABELS: Record<string, string> = {
  ADMIN_HSEE: "Admin HSEE",
  AUDITEUR: "Auditeur",
  PILOTE_ACTION: "Pilote d'Action",
};

const ROLE_COLORS: Record<string, "primary" | "success" | "warning"> = {
  ADMIN_HSEE: "primary",
  AUDITEUR: "success",
  PILOTE_ACTION: "warning",
};

// ─── Navigation structure ─────────────────────────────────────────────────────
// type: 'item' | 'group' | 'divider'
// roles: qui peut voir cet élément
const NAV_STRUCTURE: any[] = [
  {
    type: "item",
    label: "Tableau de bord",
    Icon: DashboardIcon,
    path: "/dashboard",
    roles: ["ADMIN_HSEE", "AUDITEUR", "PILOTE_ACTION"],
  },

  // ── SURVEILLANCE ──────────────────────────────────────────────────────────
  {
    type: "divider",
    label: "SURVEILLANCE",
    roles: ["ADMIN_HSEE", "AUDITEUR"],
  },
  {
    type: "item",
    label: "Inspections",
    Icon: AssignmentIcon,
    path: "/inspections",
    roles: ["ADMIN_HSEE", "AUDITEUR"],
  },
  {
    type: "group",
    label: "Planning",
    Icon: CalendarMonthIcon,
    roles: ["ADMIN_HSEE"],
    children: [
      { label: "Calendrier 52 sem.", Icon: EventRepeatIcon, path: "/planning" },
      {
        label: "Nouveau plan",
        Icon: AddCircleOutlineIcon,
        path: "/planning/new",
      },
    ],
  },
  {
    type: "item",
    label: "Checklists",
    Icon: ChecklistIcon,
    path: "/checklists",
    roles: ["ADMIN_HSEE", "AUDITEUR"],
  },
  {
    type: "item",
    label: "Anomalies",
    Icon: WarningAmberIcon,
    path: "/anomalies",
    roles: ["ADMIN_HSEE", "AUDITEUR"],
  },

  // ── ACTIONS ───────────────────────────────────────────────────────────────
  {
    type: "divider",
    label: "ACTIONS",
    roles: ["ADMIN_HSEE", "AUDITEUR", "PILOTE_ACTION"],
  },
  {
    type: "item",
    label: "Actions correctives",
    Icon: BuildIcon,
    path: "/actions",
    roles: ["ADMIN_HSEE", "AUDITEUR", "PILOTE_ACTION"],
  },

  // ── ADMINISTRATION ────────────────────────────────────────────────────────
  {
    type: "divider",
    label: "ADMINISTRATION",
    roles: ["ADMIN_HSEE"],
  },
  {
    type: "item",
    label: "Utilisateurs",
    Icon: PeopleIcon,
    path: "/admin/users",
    roles: ["ADMIN_HSEE"],
  },
  {
    type: "item",
    label: "KPI / Rapports",
    Icon: BarChartIcon,
    path: "/dashboard/kpi",
    roles: ["ADMIN_HSEE"],
  },

  // ── SYSTÈME ───────────────────────────────────────────────────────────────
  {
    type: "divider",
    label: "SYSTÈME",
    roles: ["ADMIN_HSEE", "AUDITEUR", "PILOTE_ACTION"],
  },
  {
    type: "item",
    label: "Notifications",
    Icon: NotificationsIcon,
    path: "/notifications",
    roles: ["ADMIN_HSEE", "AUDITEUR", "PILOTE_ACTION"],
  },
];

// Breadcrumb map path → label
const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/inspections": "Inspections",
  "/planning": "Planning 52 semaines",
  "/checklists": "Checklists",
  "/anomalies": "Anomalies",
  "/actions": "Actions correctives",
  "/admin/users": "Gestion des utilisateurs",
  "/dashboard/kpi": "KPI / Rapports",
  "/notifications": "Notifications",
  "/profile": "Mon profil",
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Planning: false,
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const roleLabel = ROLE_LABELS[user?.role ?? ""] ?? user?.role ?? "";
  const roleColor = ROLE_COLORS[user?.role ?? ""] ?? "default";

  const currentBreadcrumb =
    Object.entries(BREADCRUMB_MAP).find(([path]) =>
      location.pathname.startsWith(path),
    )?.[1] ?? "";

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  // ── Drawer content ─────────────────────────────────────────────────────────
  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          color="primary"
          letterSpacing={-0.5}
        >
          HSEE
          <Typography
            component="span"
            variant="h6"
            fontWeight={400}
            color="text.secondary"
          >
            {" "}
            Platform
          </Typography>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          LEONI · Surveillance & Conformité
        </Typography>
      </Box>

      {/* Nav items */}
      <List sx={{ flex: 1, pt: 1, px: 1, overflowY: "auto" }}>
        {NAV_STRUCTURE.map((item: any, idx: number) => {
          // Masquer si rôle non autorisé
          if (!user || !item.roles?.includes(user.role)) return null;

          // ── Séparateur de section ──────────────────────────────────────
          if (item.type === "divider") {
            return (
              <Box
                key={`div-${idx}`}
                sx={{ px: 1.5, pt: idx === 0 ? 0.5 : 1.5, pb: 0.5 }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.disabled"
                  sx={{ fontSize: 10, letterSpacing: "0.08em" }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          }

          // ── Groupe dépliable ───────────────────────────────────────────
          if (item.type === "group") {
            const { Icon } = item;
            const isOpen = openGroups[item.label] ?? false;
            const anyChildActive = item.children?.some((c: any) =>
              isActive(c.path),
            );
            return (
              <Box key={`group-${idx}`}>
                <ListItemButton
                  onClick={() => toggleGroup(item.label)}
                  selected={anyChildActive}
                  sx={{ borderRadius: 1.5, mb: 0.25 }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: anyChildActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: anyChildActive ? 600 : 400,
                    }}
                  />
                  {isOpen ? (
                    <ExpandLessIcon fontSize="small" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" />
                  )}
                </ListItemButton>

                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 1.5 }}>
                    {item.children?.map((child: any) => {
                      const { Icon: ChildIcon } = child;
                      const active = isActive(child.path);
                      return (
                        <ListItemButton
                          key={child.path}
                          selected={active}
                          onClick={() => {
                            navigate(child.path);
                            setMobileOpen(false);
                          }}
                          sx={{ borderRadius: 1.5, mb: 0.25, py: 0.75 }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 30,
                              color: active ? "primary.main" : "text.secondary",
                            }}
                          >
                            <ChildIcon sx={{ fontSize: 18 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontSize: 13,
                              fontWeight: active ? 600 : 400,
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          // ── Item simple ────────────────────────────────────────────────
          const { Icon } = item;
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{ borderRadius: 1.5, mb: 0.25 }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: active ? "primary.main" : "text.secondary",
                }}
              >
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* User card en bas — clique pour ouvrir le dialog profil */}
      {user && (
        <Box
          onClick={() => setProfileOpen(true)}
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            cursor: "pointer",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              src={user.avatarUrl}
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                fontSize: 13,
              }}
            >
              {initials}
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label={roleLabel}
                size="small"
                color={roleColor as any}
                sx={{ height: 18, fontSize: 10 }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Sidebar Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Zone principale */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ml: { md: `${DRAWER_WIDTH}px` },
          minWidth: 0,
        }}
      >
        {/* AppBar */}
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Toolbar>
            {/* Burger mobile */}
            <IconButton
              sx={{ display: { md: "none" }, mr: 1 }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Breadcrumb */}
            {currentBreadcrumb && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {currentBreadcrumb}
              </Typography>
            )}

            <Box flex={1} />

            {/* Bouton notifications (badge) */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={() => navigate("/notifications")}
                sx={{ mr: 0.5 }}
              >
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Avatar → ouvre dialog profil */}
            <Tooltip title="Mon profil">
              <IconButton onClick={() => setProfileOpen(true)} size="small">
                <Avatar
                  src={user?.avatarUrl}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    fontSize: 12,
                  }}
                >
                  {initials}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Page */}
        <Box component="main" sx={{ flex: 1, p: 3, bgcolor: "grey.50" }}>
          <Outlet />
        </Box>
      </Box>

      {/* ── Dialog profil ── */}
      <Dialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={user?.avatarUrl}
              sx={{
                width: 48,
                height: 48,
                bgcolor: "primary.main",
                fontSize: 18,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
              <Box mt={0.5}>
                <Chip
                  label={roleLabel}
                  size="small"
                  color={roleColor as any}
                  sx={{ height: 18, fontSize: 10 }}
                />
              </Box>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 1, px: 2 }}>
          <ListItemButton
            sx={{ borderRadius: 1.5 }}
            onClick={() => {
              setProfileOpen(false);
              navigate("/profile");
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Mon profil" />
          </ListItemButton>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={() => setProfileOpen(false)} color="inherit">
            Fermer
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
          >
            Se déconnecter
          </Button>
        </DialogActions>
      </Dialog>

      <InactivityDialog />
    </Box>
  );
}
