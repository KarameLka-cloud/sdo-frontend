export interface DeleteMessages {
  confirm: string;
  success: string;
  error: string;
}

export const TEMPLATE_DELETE_MESSAGES: DeleteMessages = {
  confirm: "Удалить шаблон адаптации?",
  success: "Шаблон адаптации удалён",
  error: "Не удалось удалить шаблон адаптации",
};

export const TEMPLATE_EDITOR_DELETE_MESSAGES = TEMPLATE_DELETE_MESSAGES;

export const PLAN_DELETE_MESSAGES: DeleteMessages = {
  confirm: "Удалить план стажера?",
  success: "План стажера удалён",
  error: "Не удалось удалить план",
};
