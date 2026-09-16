// src/components/chat/HseeChat.tsx
import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import { ragService } from "../../services/ragService";
import { useAuth } from "../../contexts/AuthContext";

type Msg = {
  role: "user" | "bot";
  text: string;
  sources?: any[];
  rewritten?: string;
};

const SUGGESTIONS = [
  "Anomalies ouvertes ?",
  "Actions en retard ?",
  "Anomalies bloquantes ?",
  "Score conformité ?",
];

export default function HseeChat() {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: `👋 Bonjour ${user?.firstName ?? ""} !\nJe suis votre assistant HSE LEONI.\nPosez-moi des questions sur vos anomalies et actions.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [showSrc, setShowSrc] = useState<number | null>(null);

  // Vérifier si Colab est actif
  useEffect(() => {
    ragService
      .health()
      .then((r) => setOnline(r.online))
      .catch(() => setOnline(false));
  }, []);

  // Scroll automatique vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);
  // Dans HseeChat.tsx — useEffect health check
  useEffect(() => {
    ragService
      .health()
      .then((r) => {
        console.log("RAG health:", r); // ← voir dans F12 Console
        setOnline(r.online);
      })
      .catch((err) => {
        console.error("RAG health error:", err);
        setOnline(false);
      });
  }, []);
  const send = async (question?: string) => {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMsgs((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const result = await ragService.chat(q);
      setMsgs((prev) => [
        ...prev,
        {
          role: "bot",
          text: result.answer,
          sources: result.sources,
          rewritten:
            result.query_rewritten !== q ? result.query_rewritten : undefined,
        },
      ]);
    } catch {
      setMsgs((prev) => [
        ...prev,
        {
          role: "bot",
          text: online
            ? "❌ Erreur lors de la réponse. Réessayez."
            : "⚠️ Service IA hors ligne.\nLancez le notebook Google Colab.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await ragService.reset();
    setMsgs([
      {
        role: "bot",
        text: "🔄 Nouvelle conversation démarrée.",
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* ── Bulle flottante en bas à droite ── */}
      <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1200 }}>
        {/* Bouton principal */}
        <Button
          variant="contained"
          onClick={() => setOpen((p) => !p)}
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            minWidth: 0,
            fontSize: 22,
            boxShadow: "0 4px 20px rgba(55,138,221,0.5)",
            transition: "transform .2s",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          {open ? "✕" : "🤖"}
        </Button>

        {/* Indicateur online/offline */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor:
              online === true
                ? "success.main"
                : online === false
                  ? "error.main"
                  : "grey.400",
            border: "2px solid white",
          }}
        />

        {/* Tooltip si hors ligne */}
        {!open && online === false && (
          <Box
            sx={{
              position: "absolute",
              bottom: 64,
              right: 0,
              bgcolor: "error.main",
              color: "white",
              px: 1.5,
              py: 0.75,
              borderRadius: 1.5,
              fontSize: 11,
              whiteSpace: "nowrap",
              boxShadow: 2,
            }}
          >
            ⚠️ Colab hors ligne
          </Box>
        )}
      </Box>

      {/* ── Fenêtre de chat ── */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            bottom: 90,
            right: 24,
            zIndex: 1200,
            width: 380,
            height: 540,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1.25,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexShrink: 0,
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.dark",
                fontSize: 16,
              }}
            >
              🤖
            </Avatar>
            <Box flex={1}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="white"
                lineHeight={1.2}
              >
                Assistant HSE LEONI
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                {online === true
                  ? "🟢 En ligne"
                  : online === false
                    ? "🔴 Hors ligne"
                    : "⏳ Vérification..."}
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={handleReset}
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 10,
                minWidth: 0,
                px: 0.5,
              }}
            >
              Nouveau
            </Button>
          </Box>

          {/* Zone messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              bgcolor: "#F7F8FA",
            }}
          >
            {msgs.map((m, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                {/* Query réécrite par l'IA */}
                {m.rewritten && (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    display="block"
                    mb={0.25}
                    ml={0.5}
                    sx={{ fontStyle: "italic" }}
                  >
                    🔄 {m.rewritten}
                  </Typography>
                )}

                {/* Bulle message */}
                <Box
                  sx={{
                    bgcolor: m.role === "user" ? "primary.main" : "white",
                    color: m.role === "user" ? "white" : "text.primary",
                    border: m.role === "user" ? "none" : "1px solid",
                    borderColor: "divider",
                    borderRadius:
                      m.role === "user"
                        ? "16px 16px 2px 16px"
                        : "16px 16px 16px 2px",
                    px: 1.5,
                    py: 1,
                    fontSize: 13,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  {m.text}
                </Box>

                {/* Sources */}
                {m.sources && m.sources.length > 0 && (
                  <Box mt={0.5} ml={0.5}>
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{ cursor: "pointer" }}
                      onClick={() => setShowSrc(showSrc === i ? null : i)}
                    >
                      📎 {m.sources.length} source(s) consultée(s)
                    </Typography>
                    {showSrc === i && (
                      <Box
                        sx={{
                          bgcolor: "white",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1.5,
                          p: 1,
                          mt: 0.5,
                        }}
                      >
                        {m.sources.slice(0, 3).map((s: any, j: number) => (
                          <Box key={j} sx={{ mb: j < 2 ? 0.75 : 0 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              [{j + 1}] {s.text?.slice(0, 120)}...
                            </Typography>
                            {s.rerank_score && (
                              <Typography
                                variant="caption"
                                color="text.disabled"
                              >
                                Score : {s.rerank_score.toFixed(3)}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ))}

            {/* Indicateur de chargement */}
            {loading && (
              <Box
                alignSelf="flex-start"
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "16px 16px 16px 2px",
                  px: 1.5,
                  py: 1,
                }}
              >
                <CircularProgress size={12} />
                <Typography variant="caption" color="text.secondary">
                  Analyse en cours...
                </Typography>
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>

          {/* Suggestions rapides */}
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              display: "flex",
              gap: 0.5,
              flexWrap: "wrap",
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "white",
              flexShrink: 0,
            }}
          >
            {SUGGESTIONS.map((s) => (
              <Box
                key={s}
                onClick={() => send(s)}
                sx={{
                  fontSize: 10,
                  px: 1,
                  py: 0.25,
                  border: "1px solid",
                  borderColor: "primary.light",
                  borderRadius: 9999,
                  color: "primary.main",
                  cursor: "pointer",
                  userSelect: "none",
                  "&:hover": { bgcolor: "primary.lighter" },
                }}
              >
                {s}
              </Box>
            ))}
          </Box>

          {/* Zone de saisie */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "white",
              flexShrink: 0,
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Votre question HSE... (Entrée pour envoyer)"
              disabled={loading || online === false}
              rows={2}
              style={{
                flex: 1,
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: "8px 12px",
                fontSize: 13,
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
                background: online === false ? "#f5f5f5" : "white",
              }}
            />
            <Button
              variant="contained"
              onClick={() => send()}
              disabled={loading || !input.trim() || online === false}
              sx={{
                minWidth: 40,
                width: 40,
                height: 40,
                borderRadius: "50%",
                p: 0,
                alignSelf: "flex-end",
              }}
            >
              {loading ? <CircularProgress size={16} color="inherit" /> : "→"}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
