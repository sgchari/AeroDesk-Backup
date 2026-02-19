import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ComplianceVerificationOutput } from "@/ai/flows/verify-compliance";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ComplianceCheckResultProps = {
  result: ComplianceVerificationOutput;
};

export function ComplianceCheckResult({ result }: ComplianceCheckResultProps) {
  const { isCompliant, complianceSummary, risks, correctiveActions } = result;

  return (
    <Alert variant={isCompliant ? "default" : "destructive"}>
      {isCompliant ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      <AlertTitle className="flex items-center gap-2">
        <span>Compliance Check Result:</span>
        <Badge variant={isCompliant ? "default" : "destructive"}>
            {isCompliant ? "Compliant" : "Risks Identified"}
        </Badge>
      </AlertTitle>
      <AlertDescription className="space-y-3 mt-2">
        <p>{complianceSummary}</p>
        {!isCompliant && risks.length > 0 && (
          <div>
            <h4 className="font-semibold mb-1">Identified Risks:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        )}
        {!isCompliant && correctiveActions.length > 0 && (
          <div>
            <h4 className="font-semibold mb-1">Suggested Corrective Actions:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {correctiveActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
