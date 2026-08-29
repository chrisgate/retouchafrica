import { WorkshopForm } from "@/components/admin/forms/WorkshopForm";
import { createWorkshopAction } from "@/lib/actions/workshops";

export default function NewWorkshopPage() {
  return (
    <div>
      <h1 className="font-display text-2xl">New Workshop</h1>
      <div className="mt-6">
        <WorkshopForm action={createWorkshopAction} />
      </div>
    </div>
  );
}
