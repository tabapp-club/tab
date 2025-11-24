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
    title: "Total Patients/Clients",
    legendLabel: "Patients/Clients",
    unit: "Users",
    bgColor: "bg-[#17c653]"
  },
  {
    id: 2,
    title: "Total Business",
    legendLabel: "Total Business",
    unit: "Rupees",
    bgColor: "bg-[#17c653]"
  },
  {
    id: 3,
    title: "New patients/clients",
    legendLabel: "New patients/clients",
    unit: "Users",
    bgColor: "bg-[#9747FF]"
  },
  {
    id: 4,
    title: "Retained patients/clients",
    legendLabel: "Retained patients/clients",
    unit: "Users",
    bgColor: "bg-[#9747FF]"
  },
  {
    id: 5,
    title: "Active patients/clients",
    legendLabel: "Active patients/clients",
    unit: "Users",
    bgColor: "bg-[#9747FF]"
  },
  {
    id: 6,
    title: "Inactive patients/clients",
    legendLabel: "Inactive patients/clients",
    unit: "Users",
    bgColor: "bg-[#ff6b6b]"
  },
];