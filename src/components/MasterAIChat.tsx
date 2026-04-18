import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  compact?: boolean;
  storageKey?: string;
  hint?: string;
}

const MASTER_AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/master-ai`;

export default function MasterAIChat({ compact = false, storageKey = "master_ai_history", hint }: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(messages.slice(-30))); } catch {}
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, storageKey]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const userMsg: ChatMsg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await fetch(MASTER_AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      });

      if (resp.status === 429) { toast.error("Rate limit reached. Slow down a bit ⚡"); setLoading(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted."); setLoading(false); return; }
      if (!resp.ok || !resp.body) { toast.error("Master AI is offline."); setLoading(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nl);
          textBuffer = textBuffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { textBuffer = ""; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantSoFar += delta;
              if (!started) {
                started = true;
                setMessages(prev => [...prev, { role: "assistant", content: assistantSoFar }]);
              } else {
                setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
              }
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") toast.error("Connection failed");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const clear = () => { setMessages([]); try { localStorage.removeItem(storageKey); } catch {} };

  return (
    <div className={`flex flex-col ${compact ? "h-[28rem]" : "h-[calc(100vh-10rem)]"} glass rounded-2xl border border-primary/30 overflow-hidden`}>
      <div className="flex items-center justify-between p-3 border-b border-border/40 bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-primary text-glow" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </div>
          <p className="font-display text-xs font-bold tracking-wider text-foreground">LOGICGUESSER MASTER AI</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clear} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Clear chat">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2 text-glow" />
            <p className="font-display text-sm font-bold text-foreground">Greetings, challenger.</p>
            <p className="font-body text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              {hint ?? "I'm the LogicGuesser Master AI. Ask me about puzzles, hints, game features, or strategy."}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
              {["How do battles work?", "Give me a hint", "How do I earn credits?"].map(s => (
                <button key={s} onClick={() => send(s)}
                  className="px-2.5 py-1 text-[11px] font-body rounded-full bg-secondary/50 hover:bg-primary/20 hover:text-primary border border-border/50 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm font-body ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-secondary/60 text-foreground rounded-bl-sm border border-border/40"
              }`}>
                {m.role === "assistant"
                  ? <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1"><ReactMarkdown>{m.content || "…"}</ReactMarkdown></div>
                  : m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start"><div className="bg-secondary/60 border border-border/40 rounded-2xl px-3 py-2"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div></div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-2 border-t border-border/40 bg-background/50 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the Master AI…"
          className="bg-secondary/40 border-border/50 font-body text-sm h-9"
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-9 w-9 flex-shrink-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
}
