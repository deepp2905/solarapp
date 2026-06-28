import type { ItemStatus } from "../data";
import { statusClass } from "../data";
import { IconCheck, IconDashed, IconError, IconWarning } from "./Icon";

export default function StatusIcon({ status }: { status: ItemStatus }) {
  const cls = `status-icon ${statusClass(status)}`;
  switch (status) {
    case "captured":
      return <IconCheck className={cls} />;
    case "warning":
      return <IconWarning className={cls} />;
    case "error":
      return <IconError className={cls} />;
    default:
      return <IconDashed className={cls} />;
  }
}
