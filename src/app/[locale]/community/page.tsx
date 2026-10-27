import CommunityHero from "@/components/CommunityHero";
import CommunityAbout from "@/components/CommunityAbout";
import CommunityWho from "@/components/CommunityWho";
import CommunityBenefits from "@/components/CommunityBenefits";
import CommunityActivities from "@/components/CommunityActivities";
import CommunityJoin from "@/components/CommunityJoin";
import CommunityWhy from "@/components/CommunityWhy";
import CommunityCTA from "@/components/CommunityCTA";

export default function CommunityPage() {
  return (
    <div className="pb-20 md:pb-28">
      <CommunityHero />
      <CommunityAbout />
      <CommunityWho />
      <CommunityBenefits />
      <CommunityActivities />
      <CommunityWhy />
      <CommunityJoin />
      <CommunityCTA />
    </div>
  );
}
