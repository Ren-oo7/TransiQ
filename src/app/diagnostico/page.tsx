import { Suspense } from "react";
import { PublicDiagnostic } from "@/components/diagnostic/public-diagnostic";

export default function DiagnosticoPage() {
  return (
    <Suspense fallback={null}>
      <PublicDiagnostic />
    </Suspense>
  );
}
