import { useEffect, useState } from "react";
import { Input } from "../ui/input";

// مكون فرعي صغير داخل الملف أو فوق المكون الرئيسي
export const ManagedInput = ({ value, onChange, disabled, className }: any) => {
  // حالة محلية للتحكم في الكتابة السريعة
  const [localValue, setLocalValue] = useState(value);

  // تحديث الحالة المحلية إذا تغيرت القيمة القادمة من الخارج (المشروع)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <Input
      className={className}
      type="number"
      value={localValue ?? ""}
      disabled={disabled}
      onChange={(e) => {
        // نحدث الحالة المحلية فقط أثناء الكتابة (سريع جداً)
        setLocalValue(e.target.value);
      }}
      onBlur={() => {
        // الحفظ الفعلي يحدث هنا فقط عند الخروج من الحقل
        // نتحقق أولاً أن القيمة تغيرت فعلياً لتجنب تحديثات بلا داعٍ
        if (Number(localValue) !== Number(value)) {
          onChange(Number(localValue));
        }
      }}
      // اختياري: إذا أراد المستخدم الضغط على Enter للخروج والحفظ معاً
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur(); // سيؤدي هذا لاستدعاء onBlur تلقائياً
        }
      }}
    />
  );
};
