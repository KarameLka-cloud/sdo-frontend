import { useEffect, useState } from "react";

export function usePopulateEditForm<T extends { id: number }>(
  entityId: number | null,
  entity: T | undefined,
  canPopulate: boolean,
  populate: (entity: T) => void,
): boolean {
  const [isPopulated, setIsPopulated] = useState(false);

  useEffect(() => {
    setIsPopulated(false);
  }, [entityId]);

  useEffect(() => {
    if (entityId == null || !entity || entity.id !== entityId || !canPopulate) {
      return;
    }

    populate(entity);
    setIsPopulated(true);
  }, [entity, entityId, canPopulate, populate]);

  return isPopulated;
}
