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
        compweight: {
          [key: number]: number;
        };
        totalAftarRound: number;
      };
    };
    compweight: {
      [key: number]: number;
    };
    rowNum: Record<
      number,
      {
        [key: number]: number;
      }
    >;
  };
}
