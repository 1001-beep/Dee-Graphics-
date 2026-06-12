import { C } from "@/lib/theme";

export default function GoldDivider() {
  return (
    <div
      style={{
        width: 48,
        height: 1,
        background: `linear-gradient(90deg, ${C.gold}, transparent)`,
        margin: "16px auto 0",
      }}
    />
  );
}
