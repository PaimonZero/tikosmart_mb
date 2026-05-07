export const formatDateShortVN = (dateString?: string | null) => {
  if (!dateString) return "Chưa có";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Chưa có";

  return date.toLocaleDateString("vi-VN");
};

