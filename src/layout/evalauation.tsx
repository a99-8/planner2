import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// تعريف الـ Props لتطابق البيانات المرسلة من الصفحة الأب
interface EvaluationProps {
  projectId: string;
  reference: {
    settlementsTable: any;
  };
  summary: {
    frsCol: number;
    secCol: any;
    frsHeader: string;
    secHeader: string[];
    weighted: {
      singleORall: boolean;
      priceAfterSettlements: number;
      priceAfterWeighted: number;
      total: number;
    };
  };
}

const Evalauation = ({ projectId, summary }: EvaluationProps) => {
  return (
    <AccordionItem value={"Evalauation"}>
      <AccordionTrigger className="text-xl font-bold">
        التقييم والخلاصة
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* بطاقة عرض سريعة لإجمالي القيمة المرجحة */}
            <div className="p-4 border rounded-2xl bg-primary/5">
              <p className="text-sm text-muted-foreground">
                إجمالي القيمة المرجحة
              </p>
              <p className="text-2xl font-black text-primary">
                {summary.weighted.total.toLocaleString()} ر.س
              </p>
            </div>
          </div>

          <div className="mt-6 text-muted-foreground text-sm">
            معرف المشروع: <span className="font-mono">{projectId}</span>
          </div>

          {/* هنا ستضع جداول الخلاصة النهائية لاحقاً */}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Evalauation;
