import { JSX } from "react";
import DataList from "@/components/ui/custom/DataList";
import UniversalCard from "@/components/ui/custom/UniversalCard";
import {
  useGetEducationCoursesQuery,
  useGetEducationEventsQuery,
  useGetEducationTestsQuery,
  useGetEducationWebinarsQuery,
} from "@/services/store/features/education.ts";
import {
  useGetEdoCoursesQuery,
  useGetEdoEventsQuery,
  useGetEdoTestsQuery,
} from "@/services/store/features/edo.ts";

type Domain = "education" | "edo";
type Resource = "courses" | "events" | "tests" | "webinars";
type CardType = "course" | "event" | "test" | "webinar";

const CONFIG = {
  education: {
    courses: { useQuery: useGetEducationCoursesQuery, cardType: "course" },
    events: { useQuery: useGetEducationEventsQuery, cardType: "event" },
    tests: { useQuery: useGetEducationTestsQuery, cardType: "test" },
    webinars: { useQuery: useGetEducationWebinarsQuery, cardType: "webinar" },
  },
  edo: {
    courses: { useQuery: useGetEdoCoursesQuery, cardType: "course" },
    events: { useQuery: useGetEdoEventsQuery, cardType: "event" },
    tests: { useQuery: useGetEdoTestsQuery, cardType: "test" },
  },
} as const;

interface HomeResourceListProps {
  domain: Domain;
  resource: Resource;
}

function HomeResourceList({
  domain,
  resource,
}: HomeResourceListProps): JSX.Element {
  const domainConfig = CONFIG[domain];
  if (!(resource in domainConfig)) {
    throw new Error(
      `Resource "${resource}" is not available for domain "${domain}"`,
    );
  }

  const { useQuery, cardType } =
    domainConfig[resource as keyof typeof domainConfig];
  const { data, error, isLoading } = useQuery("");

  return (
    <DataList
      data={data}
      error={!!error}
      isLoading={isLoading}
      renderItem={(item) => (
        <UniversalCard
          type={cardType as CardType}
          item={item as Parameters<typeof UniversalCard>[0]["item"]}
          className="mt-4"
        />
      )}
    />
  );
}

export default HomeResourceList;
