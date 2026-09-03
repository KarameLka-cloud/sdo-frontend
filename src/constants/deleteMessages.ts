export interface DeleteMessages {
  confirm: string;
  success: string;
  error: string;
}

/**
 * The templates list and the template editor historically use different
 * wording for the same entity ("план адаптации" vs "шаблон адаптации").
 * Kept as-is to avoid changing user-facing copy.
 */
export const TEMPLATE_DELETE_MESSAGES: DeleteMessages = {
  confirm: "Удалить план адаптации?",
  success: "План адаптации удалён",
  error: "Не удалось удалить план адаптации",
};

export const TEMPLATE_EDITOR_DELETE_MESSAGES: DeleteMessages = {
  confirm: "Удалить шаблон адаптации?",
  success: "Шаблон адаптации удалён",
  error: "Не удалось удалить шаблон",
};

export const PLAN_DELETE_MESSAGES: DeleteMessages = {
  confirm: "Удалить план стажера?",
  success: "План стажера удалён",
  error: "Не удалось удалить план",
};
