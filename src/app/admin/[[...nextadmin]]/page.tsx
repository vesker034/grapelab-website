import { PageProps } from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";
import { NextAdmin } from "@premieroctet/next-admin/adapters/next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { options } from "../options";
import { authOptions } from "@/lib/auth";
import ImageUploadInput from "@/components/admin/ImageUploadInput";
import AdminDashboard from "@/components/admin/AdminDashboard";
import JsonbEditor from "@/components/admin/JsonbEditor";
import TechStackEditor from "@/components/admin/TechStackEditor";
import AspectsListEditor from "@/components/admin/AspectsListEditor";
import ContentFieldRouter from "@/components/admin/ContentFieldRouter";
import LocalizedFieldsInput from "@/components/admin/LocalizedFieldsInput";

const customInputs = {
  imagePath:        <ImageUploadInput />,
  bannerImagePath:  <ImageUploadInput />,

  aspectsList: <AspectsListEditor />,
  galleryImages:    <JsonbEditor />,
  projectTechStack: <TechStackEditor />,

  content: <ContentFieldRouter />,

  rawName:          <LocalizedFieldsInput />,
  nickname:         <LocalizedFieldsInput />,
};

export default async function AdminPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const props = await getNextAdminProps({
    params: params.nextadmin,
    searchParams,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma,
    options,
  });

  if ("redirect" in props) redirect(props.redirect as string);
  const generatedCustomInputs =
    "customInputs" in props ? props.customInputs ?? {} : {};

  return (
    <NextAdmin
      {...props}
      customInputs={{
        ...customInputs,
        ...generatedCustomInputs,
      }}
      dashboard={<AdminDashboard />}
      title={<Image src="/favicon.ico" alt="GrapeLab" width={32} height={32} style={{ objectFit: "contain", borderRadius: 6 }} />}
      user={{
        data: {
          name: session.user?.name ?? "Admin",
        },
        logout: "/api/auth/signout",
      }}
    />
  );
}
