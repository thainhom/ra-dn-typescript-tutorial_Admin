const getStaticResourceUrl = (path: string | undefined): string => {
  return path ? `http://localhost:8000/assets/${path}` : "";
};

export { getStaticResourceUrl };
