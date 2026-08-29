import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FacilitatorForm } from "@/components/admin/forms/FacilitatorForm";
import { updateFacilitatorAction } from "@/lib/actions/facilitators";

export default async function EditFacilitatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const facilitator = await prisma.facilitator.findUnique({
    where: { id },
    include: { socialLinks: { orderBy: { order: "asc" } } },
  });
  if (!facilitator) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl">Edit Facilitator</h1>
      <div className="mt-6">
        <FacilitatorForm facilitator={facilitator} action={updateFacilitatorAction.bind(null, id)} />
      </div>
    </div>
  );
}
