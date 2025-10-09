export const STATUS_CONFIG = {
  COMPLETED: {
    label: "Selesai",
    color: "#10B981",
    icon: "checkmark-circle" as const,
    bgColor: "#ECFDF5",
  },
  IN_PROGRESS: {
    label: "Sedang Berjalan",
    color: "#3B82F6",
    icon: "sync-outline" as const,
    bgColor: "#EFF6FF",
  },
  STUCK: {
    label: "Terhambat",
    color: "#EF4444",
    icon: "alert-circle" as const,
    bgColor: "#FEF2F2",
  },
  BLOCKED: {
    label: "Terhambat",
    color: "#EF4444",
    icon: "alert-circle" as const,
    bgColor: "#FEF2F2",
  },
  NOT_STARTED: {
    label: "Belum Dimulai",
    color: "#6B7280",
    icon: "time-outline" as const,
    bgColor: "#F9FAFB",
  },
  DISPOSITIONED: {
    label: "Tugas Baru",
    color: "#3B82F6",
    icon: "arrow-redo-outline" as const,
    bgColor: "#EFF6FF",
  },
  DRAFT: {
    label: "Draft",
    color: "#8B5CF6",
    icon: "document-text-outline" as const,
    bgColor: "#F5F3FF",
  },
};

export const PRIORITY_OPTIONS = [
  { value: 1, label: "Low", color: "#6B7280" },
  { value: 2, label: "Medium", color: "#F59E0B" },
  { value: 3, label: "High", color: "#EF4444" },
];
