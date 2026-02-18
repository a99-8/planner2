import { useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useMemo } from "react";
import {
  calculateMetrics,
  formatCSVData,
  generateRangeArray,
  parseCSV,
  projectService,
} from "@/lib";

export const useSections2 = (projectId: string) => {
  // Defining variables
  const fileInputRef = useRef<HTMLInputElement>(null);
  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );
  const comps = project?.comparisons?.comparison || [];
  //====================================================
  // general update function
  const update = (data: any) =>
    projectService.updateProjectSection(projectId, {
      ...data,
      updatedAt: new Date(),
    });
  // useLands sections
  //====================================================
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { data, name, headers } = await parseCSV(file);
    const fData = formatCSVData(name, data, headers);
    await update({ hasData: true, landsTable: { ...fData } });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const clear = () =>
    update({
      hasData: false,
      landsTable: { fileName: "", header: [], dataRow: {} },
    });
  // useComparison section
  const compActions = {
    add: () =>
      update({
        comparisons: {
          ...project?.comparisons,
          comparison: [...comps, { num: comps.length + 1, dataRow: {} }],
        },
      }),
    delete: (num: number) =>
      update({
        comparisons: {
          ...project?.comparisons,
          comparison: comps
            .filter((c) => c.num !== num)
            .map((c, i) => ({ ...c, num: i + 1 })),
        },
      }),
    updateCell: (num: number, col: string, val: any) =>
      update({
        comparisons: {
          ...project?.comparisons,
          comparison: comps.map((c) =>
            c.num === num ? { ...c, dataRow: { ...c.dataRow, [col]: val } } : c,
          ),
        },
      }),
    getValue: (num: number, col: string) => {
      const val = comps.find((c) => c.num === num)?.dataRow[col];
      return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
    },
  };
  // useMartix section
  //====================================================
  const matrixdata = (settlement: string) => {
    if (!project) return;
    // Defining variables
    const currentTable = project?.matrix?.settlementsTable?.[settlement];
    const settings = currentTable?.settings || [];
    const frRow =
      currentTable?.header || project?.landsTable?.dataRow?.[settlement] || [];
    const frCol =
      project?.comparisons?.comparison?.map(
        (c: any) => c.dataRow[settlement],
      ) || [];
    const isDataValid = settings.maxValue !== 0 || settings.minValue !== 0;
    //=========================================================================
    const updateSettings = async (updatedFields: Partial<typeof settings>) => {
      const next = { ...settings, ...updatedFields };
      const { nums, min, max, count } = calculateMetrics(
        project.landsTable?.dataRow?.[settlement] || [],
        next.baseGroup,
      );

      const newHeader = next.isAuto
        ? generateRangeArray({ start: min, end: max, step: next.baseGroup })
        : nums;

      update({
        currentTable: {
          ...currentTable,
          header: newHeader,
          settings: {
            ...next,
            maxValue: max,
            minValue: min,
            groupCount: count,
          },
        },
      });
    };
    const matrixActions = {
      updateCell: (num: number, row: string, col: string, val: any) => {
        const cellKey = `${num}_${col}_${row}`;
        update({
          matrix: {
            ...project?.matrix,
            settlementsTable: {
              ...project?.matrix?.settlementsTable, // 1. انسخ كل المدن
              [settlement]: {
                // 2. عدل المدينة المطلوبة فقط
                ...currentTable,
                dataRow: {
                  ...currentTable?.dataRow,
                  [cellKey]: val, // 3. حدث الخلية
                },
              },
            },
          },
        });
      },

      getValue: (num: number, row: string, col: string) => {
        const cellKey = `${num}_${col}_${row}`;
        const val = currentTable?.dataRow?.[cellKey];

        // منطق التحقق من المصفوفة بناءً على الـ Interface الخاص بك
        if (Array.isArray(val)) {
          return val[0] ?? ""; // أو num - 1 حسب منطقك
        }
        return val ?? "";
      },
    };
    return {
      frRow,
      frCol,
      settings,
      isDataValid,
      updateSettings,
      matrixActions,
      currentTable,
    };
  };
  // useEvalauation
  //====================================================
  //=============== the end of the hooks ===============
  return {
    project,
    isLoading: project === undefined,
    hasData: project?.hasData || false,
    settlements: project?.settlements || [],
    lands: {
      ...project?.landsTable,
      handleFileChange,
      fileInputRef,
      openPicker: () => fileInputRef.current?.click(),
      clear,
    },
    comparisons: {
      data: comps,
      count: comps.length,
      headers: project?.comparisons?.header || [],
      ...compActions,
    },
    matrixdata,
  };
};

export const useSections = (projectId: string) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const project = useLiveQuery(
    () => projectService.getProject(projectId),
    [projectId],
  );

  // 1. استخدام useMemo للبيانات المشتقة لمنع إعادة الحساب
  const comps = useMemo(
    () => project?.comparisons?.comparison || [],
    [project?.comparisons?.comparison],
  );
  const settlements = useMemo(
    () => project?.settlements || [],
    [project?.settlements],
  );

  // 2. تغليف دالة التحديث بـ useCallback
  const update = useCallback(
    (data: any) =>
      projectService.updateProjectSection(projectId, {
        ...data,
        updatedAt: new Date(),
      }),
    [projectId],
  );

  // 3. تحسين معالجة الملفات
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const { data, name, headers } = await parseCSV(file);
      const fData = formatCSVData(name, data, headers);
      await update({ hasData: true, landsTable: { ...fData } });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [update],
  );

  const clear = useCallback(
    () =>
      update({
        hasData: false,
        landsTable: { fileName: "", header: [], dataRow: {} },
      }),
    [update],
  );

  // 4. استخدام useMemo لـ compActions لمنع تغيير المرجع (Reference) في كل Render
  const compActions = useMemo(
    () => ({
      add: () =>
        update({
          comparisons: {
            ...project?.comparisons,
            comparison: [...comps, { num: comps.length + 1, dataRow: {} }],
          },
        }),
      delete: (num: number) =>
        update({
          comparisons: {
            ...project?.comparisons,
            comparison: comps
              .filter((c) => c.num !== num)
              .map((c, i) => ({ ...c, num: i + 1 })),
          },
        }),
      updateCell: (num: number, col: string, val: any) =>
        update({
          comparisons: {
            ...project?.comparisons,
            comparison: comps.map((c) =>
              c.num === num
                ? { ...c, dataRow: { ...c.dataRow, [col]: val } }
                : c,
            ),
          },
        }),
      getValue: (num: number, col: string) => {
        const val = comps.find((c) => c.num === num)?.dataRow[col];
        return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
      },
      // ملاحظة: أضفنا project و comps للمعتمدات لضمان تحديث القيم
    }),
    [update, project?.comparisons, comps],
  );

  // 5. دالة matrixdata يجب أن تكون useCallback لأنها تُستدعى داخل المكونات
  const matrixdata = useCallback(
    (settlement: string) => {
      if (!project) return null;

      const currentTable = project?.matrix?.settlementsTable?.[settlement];
      const settings = currentTable?.settings || [];

      // حسابات مصفوفة معتمدة على القيم الحالية
      const frRow =
        currentTable?.header ||
        project?.landsTable?.dataRow?.[settlement] ||
        [];
      const frCol =
        project?.comparisons?.comparison?.map(
          (c: any) => c.dataRow[settlement],
        ) || [];

      return {
        frRow,
        frCol,
        settings,
        currentTable,
        isDataValid: settings.maxValue !== 0 || settings.minValue !== 0,

        updateSettings: async (updatedFields: any) => {
          // ... منطق التحديث (يفضل فصله أيضا بـ useCallback لو كان معقداً)
        },

        matrixActions: {
          updateCell: (num: number, row: string, col: string, val: any) => {
            const cellKey = `${num}_${col}_${row}`;
            update({
              matrix: {
                ...project?.matrix,
                settlementsTable: {
                  ...project?.matrix?.settlementsTable,
                  [settlement]: {
                    ...currentTable,
                    dataRow: { ...currentTable?.dataRow, [cellKey]: val },
                  },
                },
              },
            });
          },
          getValue: (num: number, row: string, col: string) => {
            const cellKey = `${num}_${col}_${row}`;
            const val = currentTable?.dataRow?.[cellKey];
            return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
          },
        },
      };
    },
    [project, update],
  );

  // النتيجة النهائية مغلفة بـ useMemo
  return useMemo(
    () => ({
      project,
      isLoading: project === undefined,
      hasData: project?.hasData || false,
      settlements,
      lands: {
        ...project?.landsTable,
        handleFileChange,
        fileInputRef,
        openPicker: () => fileInputRef.current?.click(),
        clear,
      },
      comparisons: {
        data: comps,
        count: comps.length,
        headers: project?.comparisons?.header || [],
        ...compActions,
      },
      matrixdata,
    }),
    [
      project,
      settlements,
      handleFileChange,
      clear,
      comps,
      compActions,
      matrixdata,
    ],
  );
};
