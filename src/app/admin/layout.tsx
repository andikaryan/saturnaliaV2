import RootLayout from "@/components/Layout/Root";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
