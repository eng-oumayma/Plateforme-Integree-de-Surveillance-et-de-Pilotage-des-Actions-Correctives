// src/components/corrective-actions/ActionComments.tsx
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { correctiveActionService } from "../../services/correctiveActionService";
import { useAuth } from "../../contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type Comment = {
  id: string;
  message: string;
  authorId: string;
  author: { id: string; firstName: string; lastName: string; role: string };
  createdAt: string;
  mentions: string[];
};

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

type Props = {
  actionId: string;
  piloteId: string;
  createdById: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ROLE_LABELS: Record<string, string> = {
  ADMIN_HSEE: "Admin HSEE",
  AUDITEUR: "Auditeur",
  PILOTE_ACTION: "Pilote",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN_HSEE: "#1F3864",
  AUDITEUR: "#1D9E75",
  PILOTE_ACTION: "#BA7517",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${days}j`;
}

// Rendre les mentions cliquables dans un message
function renderMessage(message: string, members: Member[]) {
  const parts = message.split(/(@\w+(?:\s\w+)?)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      const name = part.slice(1).toLowerCase();
      const mentioned = members.find(
        (m) =>
          `${m.firstName} ${m.lastName}`.toLowerCase() === name ||
          m.firstName.toLowerCase() === name,
      );
      if (mentioned) {
        return (
          <Box
            key={i}
            component="span"
            sx={{
              bgcolor: "rgba(55,138,221,0.18)",
              color: "#1565C0",
              borderRadius: 0.75,
              px: 0.5,
              fontWeight: 600,
              fontSize: "inherit",
            }}
          >
            {part}
          </Box>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ActionComments({
  actionId,
  piloteId,
  createdById,
}: Props) {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // ── State autocomplete @mention ────────────────────────────────
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(-1);
  const [selectedMentions, setSelectedMentions] = useState<Member[]>([]);

  // ── Charger commentaires ───────────────────────────────────────
  const loadComments = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await correctiveActionService.getComments(actionId);
      setComments(data);
    } catch {
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // ── Charger membres (pour @mentions) ──────────────────────────
  useEffect(() => {
    correctiveActionService
      .getActionMembers(actionId)
      .then((m) => setMembers(m.filter((m: Member) => m.id !== user?.id)))
      .catch(() => {});

    loadComments();
    pollRef.current = setInterval(() => loadComments(true), 30000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [actionId]);

  // Scroll vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // ── Détecter @mention dans le textarea ───────────────────────
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const cursor = e.target.selectionStart;
    setMessage(val);

    // Chercher le @ avant le curseur
    const textBefore = val.slice(0, cursor);
    const atIndex = textBefore.lastIndexOf("@");

    if (
      atIndex !== -1 &&
      atIndex === textBefore.length - (textBefore.length - atIndex)
    ) {
      const query = textBefore.slice(atIndex + 1);
      // Ne pas afficher si espace dans la query (fin de mention)
      if (!query.includes(" ") || query.length === 0) {
        setMentionQuery(query.toLowerCase());
        setMentionStart(atIndex);
        setShowMentions(true);
        return;
      }
    }
    setShowMentions(false);
    setMentionStart(-1);
  };

  // Membres filtrés selon la query
  const filteredMembers = members.filter(
    (m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(mentionQuery) ||
      m.firstName.toLowerCase().startsWith(mentionQuery),
  );

  // ── Sélectionner une mention dans l'autocomplete ─────────────
  const handleSelectMention = (member: Member) => {
    const before = message.slice(0, mentionStart);
    const after = message.slice(textareaRef.current?.selectionStart ?? 0);
    const newMsg = `${before}@${member.firstName} ${member.lastName} ${after}`;
    setMessage(newMsg);
    setShowMentions(false);
    setMentionStart(-1);

    // Ajouter aux mentions sélectionnées si pas déjà présent
    if (!selectedMentions.find((m) => m.id === member.id)) {
      setSelectedMentions((prev) => [...prev, member]);
    }

    textareaRef.current?.focus();
  };

  // ── Envoyer le commentaire ────────────────────────────────────
  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError("");
    try {
      const newComment = await correctiveActionService.addComment(
        actionId,
        message.trim(),
        selectedMentions.map((m) => m.id),
      );
      setComments((prev) => [...prev, newComment]);
      setMessage("");
      setSelectedMentions([]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de l'envoi.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentions && e.key === "Escape") {
      setShowMentions(false);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && !showMentions) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMe = (authorId: string) => authorId === user?.id;

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1.5}
      >
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          COMMENTAIRES ({comments.length})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          🔄 Actualisation auto · 30s
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* ── Fil de discussion ── */}
      <Box
        sx={{
          height: 340,
          overflowY: "auto",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 1.5,
          bgcolor: "#F7F8FA",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 1.5,
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress size={24} />
          </Box>
        ) : comments.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            gap={1}
          >
            <Typography fontSize={32}>💬</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Aucun commentaire.
              <br />
              Utilisez @nom pour mentionner quelqu'un.
            </Typography>
          </Box>
        ) : (
          comments.map((comment) => {
            const mine = isMe(comment.authorId);
            const roleColor = ROLE_COLORS[comment.author?.role] ?? "#666";
            const initials = `${comment.author?.firstName?.[0] ?? ""}${comment.author?.lastName?.[0] ?? ""}`;
            const fullDate = new Date(comment.createdAt).toLocaleString(
              "fr-FR",
              {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <Box
                key={comment.id}
                display="flex"
                flexDirection={mine ? "row-reverse" : "row"}
                alignItems="flex-end"
                gap={1}
              >
                {/* Avatar */}
                <Box
                  flexShrink={0}
                  title={`${comment.author?.firstName} ${comment.author?.lastName} · ${ROLE_LABELS[comment.author?.role]}`}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      fontSize: 11,
                      bgcolor: roleColor,
                      cursor: "default",
                    }}
                  >
                    {initials}
                  </Avatar>
                </Box>

                {/* Bulle + métadonnées */}
                <Box
                  maxWidth="74%"
                  display="flex"
                  flexDirection="column"
                  gap={0.25}
                  alignItems={mine ? "flex-end" : "flex-start"}
                >
                  {/* Nom auteur (messages des autres) */}
                  {!mine && (
                    <Box display="flex" alignItems="center" gap={0.75}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color={roleColor}
                      >
                        {comment.author?.firstName} {comment.author?.lastName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        fontSize={10}
                      >
                        {ROLE_LABELS[comment.author?.role]}
                      </Typography>
                    </Box>
                  )}

                  {/* Bulle message */}
                  <Box
                    sx={{
                      bgcolor: mine ? "primary.main" : "white",
                      color: mine ? "white" : "text.primary",
                      border: mine ? "none" : "1px solid",
                      borderColor: "divider",
                      borderRadius: mine
                        ? "14px 14px 2px 14px"
                        : "14px 14px 14px 2px",
                      px: 1.5,
                      py: 1,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {renderMessage(comment.message, members)}
                    </Typography>
                  </Box>

                  {/* Timestamp */}
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    fontSize={10}
                    title={fullDate}
                  >
                    {timeAgo(comment.createdAt)}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />
      </Box>

      {/* ── Mentions sélectionnées ── */}
      {selectedMentions.length > 0 && (
        <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
          {selectedMentions.map((m) => (
            <Box
              key={m.id}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                bgcolor: "#E3F2FD",
                color: "#1565C0",
                borderRadius: 9999,
                px: 1,
                py: 0.25,
                fontSize: 11,
              }}
            >
              @{m.firstName}
              <Box
                component="span"
                sx={{ cursor: "pointer", ml: 0.25, fontWeight: 700 }}
                onClick={() =>
                  setSelectedMentions((prev) =>
                    prev.filter((x) => x.id !== m.id),
                  )
                }
              >
                ×
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ── Zone saisie + autocomplete ── */}
      <Box position="relative">
        {/* Autocomplete @mention */}
        {showMentions && filteredMembers.length > 0 && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              right: 0,
              mb: 0.5,
              borderRadius: 1.5,
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            {filteredMembers.map((member) => (
              <Box
                key={member.id}
                display="flex"
                alignItems="center"
                gap={1.5}
                px={1.5}
                py={1}
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "grey.100" },
                  borderBottom: "0.5px solid",
                  borderColor: "divider",
                  "&:last-child": { borderBottom: "none" },
                }}
                onMouseDown={(e) => {
                  e.preventDefault(); // évite le blur du textarea
                  handleSelectMention(member);
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 11,
                    bgcolor: ROLE_COLORS[member.role] ?? "#666",
                  }}
                >
                  {member.firstName[0]}
                  {member.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {member.firstName} {member.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {ROLE_LABELS[member.role] ?? member.role}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        )}

        {/* Textarea + bouton envoyer */}
        <Box display="flex" gap={1} alignItems="flex-end">
          <Box
            flex={1}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "white",
            }}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setShowMentions(false), 150)}
              placeholder="Commentaire… Tapez @ pour mentionner quelqu'un"
              rows={2}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                padding: "10px 12px",
                resize: "none",
                fontFamily: "inherit",
                fontSize: 14,
                background: "transparent",
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleSend}
            disabled={sending || !message.trim()}
            sx={{ minWidth: 80, height: 58 }}
          >
            {sending ? <CircularProgress size={18} color="inherit" /> : "→"}
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={0.5}
        >
          Entrée → envoyer · Shift+Entrée → nouvelle ligne · @ → mentionner
        </Typography>
      </Box>
    </Box>
  );
}
