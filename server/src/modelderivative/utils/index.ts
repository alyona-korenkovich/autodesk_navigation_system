import { nameRoom, nameRooms, ETypeElement } from '../consts';

const checkExistedItem = (element, array): boolean =>
  array.some(
    (item) => item.objectid === element.objectid && item.name === element.name,
  );

export const createTypeItem = (elementName: string) =>
  elementName.startsWith(nameRoom) || elementName.startsWith(nameRooms)
    ? ETypeElement.Room
    : ETypeElement.Element;

export const formItems = (obj, projectId) => {
  const array = Array.isArray(obj) ? obj : [obj];
  return array.reduce((acc, value) => {
    if (Object.keys(value).length > 0) {
      if (!checkExistedItem(value, acc)) {
        acc.push({
          project_id: projectId,
          id_in_project: value.objectid,
          name: value.name,
          type: createTypeItem(value.name.toLowerCase()),
        });
      }
      if (value.objects) {
        acc = acc.concat(formItems(value.objects, projectId));
        delete value.objects;
      }
    }
    return acc;
  }, []);
};
