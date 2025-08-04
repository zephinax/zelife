import TopNavigation from "../../navigation/topNavigation/TopNavigation";

export default function PageLayout({
  hasNavbar = true,
}: {
  hasNavbar?: boolean;
}) {
  return <div className="p-4">{hasNavbar && <TopNavigation />}</div>;
}
