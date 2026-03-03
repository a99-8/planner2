import { LucideIcon } from "lucide-react";

export interface ProjectStructure {
  id: string;
  name: string;
  hasData: boolean;
  updatedAt: Date;
  control: {
    type: string;
    use: string;
    settlements: string[];
    dependences: string[];
    group: string[];
    Interpolated: string[];
    dis: {
      [key: string]: number;
    };
  };
  landsTable: {
    fileName: string;
    tableData: {
      [key: string]: any[];
    };
  };
  comparisons: {
    header: string[];
    comparison: {
      num: number;
      dataRow: Record<string, any[]>;
    }[];
  };
  matrix: {
    settlementsTable: Record<
      string,
      {
        name: string;
        header: any[];
        dataRow: Record<string, any[]>;
        settings: {
          baseGroup: number;
          minValue: number;
          average: number;
          maxValue: number;
          groupCount: number;
          baseSettlement: number;
          increment: number;
          incrementEvery: number;
        };
      }
    >;
  };
  summary: {
    isTypeSingle: boolean;
    approximation: number;
    totalfordependences: {
      [key: string]: number;
    };
    rowData: {
      [key: number]: {
        [key: string]: number;
        totalAftarRound: number;
      };
    };
    compweight: {
      [key: number]: number;
    };
  };
}

type ControlButtonsProps = {
  id: string;
  name: string;
  dis: string;
  icon: LucideIcon;
  onClick: () => void;
  className: string;
  placeholder?: string;
};

export interface Props extends Omit<ControlButtonsProps, "onClick"> {
  onClick: (inputValue?: string) => void;
  defaultValue?: string; // خاصية اختيارية للاسم القديم
}

export interface StatusHandlerProps {
  type: "loading" | "noProject" | "noData" | "error" | "projectNotFound";
  className?: string;
  message?: string;
}

export interface updateSettingsProps {
  settlement: string;
  newHeader: any;
  next: any;
  nums: any;
  step: number;
  uniqueHeader: any;
}
