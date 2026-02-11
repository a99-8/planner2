// types/projectStructure.ts

export interface ProjectStructure {
  id: string;
  name: string;
  updatedAt: Date;
  dis: {
    id_sum: number;
    area_sum: number;
    [key: string]: any;
  };
  landsTable: {
    fileName: string;
    header: string[];
    dataRow: Record<string, any[]>;
  };
  settlements: string[];
  comparisons: {
    number: number;
    pricePerMeter: number;
    header: string[];
    dataRow: Record<string, any[]>;
  };
  reference: {
    settlementsTable: {
      name: string[];
      header: any;
      frsCol: any;
      dataRow: Record<string, any[]>;
      AutomaticColumns: boolean;
      ControllingValue: number;
      columnSettings: Record<
        string,
        {
          isAuto: boolean;
          isInterpolated: boolean;
          baseGroup: number;
          maxValue: number;
          minValue: number;
          baseSettlement: number;
          increment: number;
        }
      >;
    };
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
