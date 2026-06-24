import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChecklistIcon from "@mui/icons-material/Checklist";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BuildIcon from "@mui/icons-material/Build";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../contexts/AuthContext";
import InactivityDialog from "../common/InactivityDialog";

const DRAWER_WIDTH = 248;

const ROLE_LABELS = {
  ADMIN_HSEE: "Admin HSEE",
  AUDITEUR: "Auditeur",
  PILOTE_ACTION: "Pilote d'Action",
};

const ROLE_COLORS = {
  ADMIN_HSEE: "primary",
  AUDITEUR: "success",
  PILOTE_ACTION: "warning",
};

// Store icon components (not JSX) to avoid rendering outside React tree
const NAV_ITEMS = [
  {
    label: "Tableau de bord",
    Icon: DashboardIcon,
    path: "/dashboard",
    roles: ["ADMIN_HSEE", "AUDITEUR", "PILOTE_ACTION"],
  },
  {
    label: "Utilisateurs",
    Icon: PeopleIcon,
    path: "/admin/users",
    roles: ["ADMIN_HSEE"],
  },
  {
    label: "Inspections",
    Icon: AssignmentIcon,
    path: "/inspections",
    roles: ["ADMIN_HSEE"],
  },
  {
    label: "Checklists",
    Icon: ChecklistIcon,
    path: "/checklists",
    roles: ["ADMIN_HSEE", "AUDITEUR"],
  },
  {
    label: "Anomalies",
    Icon: WarningAmberIcon,
    path: "/anomalies",
    roles: ["ADMIN_HSEE", "AUDITEUR"],
  },
  {
    label: "Actions correctives",
    Icon: BuildIcon,
    path: "/actions",
    roles: ["ADMIN_HSEE", "AUDITEUR", "PILOTE_ACTION"],
  },
  {
    label: "KPI / Rapports",
    Icon: BarChartIcon,
    path: "/dashboard/kpi",
    roles: ["ADMIN_HSEE"],
  },
  {
    label: "Notifications",
    Icon: NotificationsIcon,
    path: "/notifications",
    roles: ["ADMIN_HSEE", "AUDITEUR", "PILOTE_ACTION"],
  },
  {
    label: "Calendrier",
    Icon: CalendarMonthIcon,
    path: "/calendar",
    roles: ["ADMIN_HSEE", "AUDITEUR"],
  },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const visibleItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role),
  );

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "?";

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
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
          Surveillance & Conformité
        </Typography>
      </Box>

      {/* Nav */}
      <List sx={{ flex: 1, pt: 1, px: 1 }}>
        {visibleItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          const { Icon } = item;
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

      {/* User card */}
      {user && (
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                label={ROLE_LABELS[user.role] || user.role}
                size="small"
                // color={ROLE_COLORS[user.role] || 'default'}
                sx={{ height: 18, fontSize: 10 }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

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
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Toolbar>
            <IconButton
              sx={{ display: { md: "none" }, mr: 1 }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Box flex={1} />
            <Tooltip title="Mon profil">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
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
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  setAnchorEl(null);
                }}
              >
                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                Mon profil
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  logout();
                  navigate("/login");
                  setAnchorEl(null);
                }}
              >
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Se déconnecter
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: 3, bgcolor: "grey.50" }}>
          <Outlet />
        </Box>
      </Box>

      <InactivityDialog />
    </Box>
  );
}
