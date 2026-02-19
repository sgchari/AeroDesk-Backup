"use client";

import { summarizeAuditLog } from "@/ai/flows/summarize-audit-log";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2 } from "lucide-react";
import { useState } from "react";

type SummarizeLogButtonProps = {
  logContent: string;
};

export function SummarizeLogButton({ logContent }: SummarizeLogButtonProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);
    try {
      const result = await summarizeAuditLog({ auditLogContent: logContent });
      setSummary(result.summary);
    } catch (error) {
      console.error("Log summarization failed:", error);
      toast({
        title: "Summarization Failed",
        description: "Could not summarize the audit log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <Button onClick={handleSummarize} disabled={isSummarizing}>
        {isSummarizing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Bot className="mr-2 h-4 w-4" />
        )}
        Summarize with AI
      </Button>

      <Dialog open={!!summary} onOpenChange={() => setSummary(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Audit Log Summary</DialogTitle>
            <DialogDescription>
              An AI-generated summary of the selected audit logs.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto rounded-md border p-4">
            <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
