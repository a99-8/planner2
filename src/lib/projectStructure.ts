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
  areaControl: (string | number)[];
  reference: {
    settlementsTable: {
      name: string[];
      header: any;
      frsCol: any;
      dataRow: any;
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
