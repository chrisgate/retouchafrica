import { FacilitatorForm } from "@/components/admin/forms/FacilitatorForm";
import { createFacilitatorAction } from "@/lib/actions/facilitators";

export default function NewFacilitatorPage() {
  return (
    <div>
      <h1 className="font-display text-2xl">New Facilitator</h1>
      <div className="mt-6">
        <FacilitatorForm action={createFacilitatorAction} />
      </div>
    </div>
  );
}
