const createOptimisedImgUrl = (url: string) => {
  const sliceAtStr = "/upload/";
  const sliceIndex = url.indexOf(sliceAtStr) + sliceAtStr.length;

  const sectionA = url.slice(0, sliceIndex);
  const sectionB = url.slice(sliceIndex);

  const newUrl = sectionA + "f_auto,q_auto/" + sectionB;

  return newUrl;
};

export { createOptimisedImgUrl }