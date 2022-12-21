import { useParams } from "react-router-dom";
import { AdminTable } from "../admin/AdminTable";

export function Rooms() {
  const { rommId } = useParams();

  

  return <AdminTable tableName="rooms" />
}