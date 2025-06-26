import { fetcher } from "@/lib/utils";

const test = `${process.env.NEXT_PUBLIC_BASE_URL}/api/excalidraw`;

export const uploadExcalidraw = async (d: any | undefined) => {
  if (!d) return;
  await fetcher(test, {
    method: "POST",
    body: JSON.stringify(d),
  });
};
