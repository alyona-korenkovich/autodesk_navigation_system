import PropertyResult = Autodesk.Viewing.PropertyResult;

/**
 * Сопоставление этажа его номеру (ручное)
 * @param neighbor - Название этажа
 */
export const detectNumberDisplayValue = (neighbor: string) => {
  // @ts-ignore
  return nameNumberCorr[neighbor];
};

export const searchPromise = (
  viewer: Autodesk.Viewing.Viewer3D,
  text: string,
  attributeNames: string[],
) => {
  return new Promise((resolve) => {
    viewer.search(text, (res: any) => resolve(res), null, attributeNames);
  });
};

export const getBulkPropsPromise = (
  viewer: Autodesk.Viewing.Viewer3D,
  dbIds: number[],
  propFilters?: string[],
) => {
  return new Promise((resolve) => {
    viewer.model.getBulkProperties(dbIds, { propFilter: propFilters }, (res) => resolve(res), null);
  });
};

export const getPropPromise = (viewer: Autodesk.Viewing.Viewer3D, dbId: number) => {
  return new Promise((resolve) => {
    viewer.getProperties(dbId, (res) => resolve(res), null);
  });
};

export const filterProps = (props: PropertyResult[], filterParam: string) => {
  const res: number[] = [];
  let filteredProps: PropertyResult[];

  filteredProps = props.filter((prop) => {
    const category = prop.properties[0].displayValue;
    if (category == filterParam) {
      return prop.dbId;
    }
  });

  for (let prop of filteredProps) {
    res.push(prop.dbId);
  }

  return res;
};