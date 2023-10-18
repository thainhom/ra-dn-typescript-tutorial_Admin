function ResourceNotFound({ resourceName }: { resourceName: string }) {
  return <div className="text-danger">Không tìm thấy {resourceName}</div>;
}
export default ResourceNotFound;
