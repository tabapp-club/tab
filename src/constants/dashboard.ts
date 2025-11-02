export interface StaticCardStructure {
  id: number;
  title: string;
  legendLabel: string;
  unit: string;
  bgColor: string;
}

export const STATIC_CARD_STRUCTURE: StaticCardStructure[] = [
  {
    id: 1,
    title: "Total Sales",
    legendLabel: "Sales",
    unit: "Users",
    bgColor: "bg-[#17c653]"
  },
  {
    id: 2,
    title: "Purchase Value",
    legendLabel: "Purchase value",
    unit: "Rupees",
    bgColor: "bg-[#17c653]"
  },
  {
    id: 3,
    title: "New customers",
    legendLabel: "New customers",
    unit: "Users",
    bgColor: "bg-[#9747FF]"
  },
  {
    id: 4,
    title: "Retained customers",
    legendLabel: "Retained customers",
    unit: "Users",
    bgColor: "bg-[#9747FF]"
  },
  {
    id: 5,
    title: "Active customers",
    legendLabel: "Active customers",
    unit: "Users",
    bgColor: "bg-[#9747FF]"
  },
  {
    id: 6,
    title: "Inactive customers",
    legendLabel: "Inactive customers",
    unit: "Users",
    bgColor: "bg-[#ff6b6b]"
  },
];