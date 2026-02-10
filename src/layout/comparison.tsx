import { SettlementsPopover } from "@/components/main/settlementsTable";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// تعريف الـ Props لتطابق ما يتم تمريره من صفحة ProjectPage
interface ComparisonProps {
  projectId: string;
  settlements: string[];
  comparisons: {
    number: number;
    pricePerMeter: number;
    header: string[];
    dataRow: Record<string, any[]>;
  };
}

const Comparison = ({ projectId }: ComparisonProps) => {
  return (
    <AccordionItem value={"Comparison"}>
      <AccordionTrigger className="text-xl font-bold">
        المقارنات والتسويات
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-6 space-y-6">
          {/* هذا المكون داخلياً يستخدم useSettlements الذي عدلناه سابقاً */}
          <SettlementsPopover projectId={projectId} />

          {/* هنا يمكنك مستقبلاً إضافة جدول المقارنات الرئيسي */}
          <div className="mt-4">
            {/* Component لجدول المقارنات سيوضع هنا */}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Comparison;
