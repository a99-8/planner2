import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// تعريف الـ Props بناءً على الهيكل الموحد
interface MatrixProps {
  projectId: string;
  areaControl: (string | number)[];
}

const Martix = ({ projectId, areaControl }: MatrixProps) => {
  return (
    <AccordionItem value={"Martix"}>
      <AccordionTrigger className="text-xl font-bold">
        مصفوفة التحكم (Matrix)
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* عرض محددات المساحة كبطاقات صغيرة */}
            {areaControl.length > 0 ? (
              areaControl.map((control, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-secondary rounded-lg border text-sm font-medium"
                >
                  {control}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm italic">
                لا توجد محددات مساحة مضافة حالياً لهذا المشروع.
              </p>
            )}
          </div>

          <div className="pt-4 border-t text-xs text-muted-foreground">
            ID المشروع المرجعي: <span className="font-mono">{projectId}</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Martix;
