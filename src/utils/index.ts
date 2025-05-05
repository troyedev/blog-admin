export const formatFuncs = (items: any[], id: number = 0): any[] =>
  items
    .filter((v: any) => v.parent_id === id)
    .map((v: any) => {
      const children = formatFuncs(items, v.id);
      if (children.length) {
        v.children = children;
      }
      return v;
    });
