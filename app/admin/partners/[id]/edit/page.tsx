import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PartnerForm } from "@/components/admin/forms/PartnerForm";
import { updatePartnerAction } from "@/lib/actions/partners";

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (!partner) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl">Edit Partner</h1>
      <div className="mt-6">
        <PartnerForm partner={partner} action={updatePartnerAction.bind(null, id)} />
      </div>
    </div>
  );
}
