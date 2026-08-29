import Image from "next/image";
import type { Facilitator, SocialLink } from "@prisma/client";
import { SocialIcons } from "@/components/shared/SocialIcons";

function instagramHandle(url: string): string | null {
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  return match ? match[1] : null;
}

export function FacilitatorCard({
  facilitator,
}: {
  facilitator: Facilitator & { socialLinks: SocialLink[] };
}) {
  const instagram = facilitator.socialLinks.find((l) => l.platform === "INSTAGRAM");
  const handle = instagram ? instagramHandle(instagram.url) : null;

  return (
    <div className="flex h-full border border-ink/10 bg-paper-soft">
      <div className="relative w-2/5 flex-none">
        {facilitator.photoUrl && (
          <Image src={facilitator.photoUrl} alt={facilitator.name} fill className="object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide">{facilitator.name}</h3>
        <p className="text-xs leading-snug text-ink/50">{facilitator.role}</p>
        <span className="h-px w-6 bg-gold" />
        <p className="text-xs leading-relaxed text-ink/60">{facilitator.bio}</p>
        <div className="mt-1 flex items-center gap-2">
          <SocialIcons links={facilitator.socialLinks} size="sm" />
          {handle && (
            <a
              href={instagram!.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs text-ink/50 hover:text-gold"
            >
              @{handle}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
