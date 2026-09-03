import { ComponentType, JSX, lazy, Suspense } from "react";
import PageTitle from "@/components/PageTitle.tsx";

type PageModule = { default: ComponentType };

/**
 * Builds a route element that is code-split and, when a title is given,
 * wrapped so the document title follows the active route.
 */
export function lazyPage(
  load: () => Promise<PageModule>,
  title?: string,
): JSX.Element {
  const Component = lazy(load);
  // No fallback spinner: the layout stays on screen and each page renders its
  // own loading state once its chunk is in.
  const element = (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );

  return title ? <PageTitle title={title} element={element} /> : element;
}
