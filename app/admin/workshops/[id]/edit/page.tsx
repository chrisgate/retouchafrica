import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WorkshopForm } from "@/components/admin/forms/WorkshopForm";
import { updateWorkshopAction } from "@/lib/actions/workshops";

export default async function EditWorkshopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workshop = await prisma.workshop.findUnique({ where: { id } });
  if (!workshop) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl">Edit Workshop</h1>
      <div className="mt-6">
        <WorkshopForm workshop={workshop} action={updateWorkshopAction.bind(null, id)} />
      </div>
    </div>
  );
}
