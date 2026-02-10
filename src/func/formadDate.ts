export const formadDate = (date: Date) => {
  // استخراج الوقت بتنسيق 12 ساعة
  const timeStr = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase()
    .replace(/\s(?=[AP]M)/i, "");

  // استخراج التاريخ بتنسيق اليوم-الشهر-السنة
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day} ${timeStr}`;
};
