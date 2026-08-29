import { PartnerForm } from "@/components/admin/forms/PartnerForm";
import { createPartnerAction } from "@/lib/actions/partners";

export default function NewPartnerPage() {
  return (
    <div>
      <h1 className="font-display text-2xl">New Partner</h1>
      <div className="mt-6">
        <PartnerForm action={createPartnerAction} />
      </div>
    </div>
  );
}
