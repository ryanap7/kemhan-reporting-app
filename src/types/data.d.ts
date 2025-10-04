import { News } from "../api/types/news.types";

export type ListItem =
  | { type: "header"; date: string }
  | { type: "news"; data: News }
  | { type: "match"; data: FixturesData };

export type MenuItem = {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export type Option = {
  label: string;
  value: string;
};
