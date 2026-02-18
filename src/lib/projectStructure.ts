export interface ProjectStructure {
  id: string;
  name: string;
  hasData: boolean;
  updatedAt: Date;
  dis: {
    [key: string]: any;
  };
  landsTable: {
    fileName: string;
    header: string[];
    dataRow: Record<string, any[]>;
  };
  settlements: string[];
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
          isAuto: boolean;
          isInterpolated: boolean;
          baseGroup: number;
          minValue: number;
          maxValue: number;
          groupCount: number;
          baseSettlement: number;
          increment: number;
        };
      }
    >;
  };
  summary: {
    rowNum: {
      comparisonsinfo: {
        number: number;
        pricePerMeter: number;
        Weight: number;
        totleSettlements: number;
        priceAfterSettlements: number;
        priceAfterWeighted: number;
      };
      totlePrice: number;
    };
  };
}
