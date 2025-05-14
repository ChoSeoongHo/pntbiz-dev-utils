/* eslint-disable @typescript-eslint/no-explicit-any */
export const generateHtmlTable = (json: any): string => {
  const rows = analyzeJsonStructure(json);
  return `
    <table border="1" cellpadding="1" cellspacing="1" width="800px">
      <thead>
        <tr>
          <th width="150px">Name</th>
          <th width="60px">Type</th>
          <th width="60px">Nullable</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${rows.join("\n")}
      </tbody>
    </table>
  `.trim();
};

const analyzeJsonStructure = (obj: any, depth = 0): string[] => {
  const rows: string[] = [];
  const indent = "ㄴ".repeat(depth);

  if (Array.isArray(obj)) {
    if (obj.length > 0) return analyzeJsonStructure(obj[0], depth);
    return [];
  }

  for (const key in obj) {
    const value = obj[key];
    const type = Array.isArray(value)
      ? "Array"
      : typeof value === "object" && value !== null
        ? "Object"
        : typeof value;
    const nullable = value === null ? "Y" : "N";
    rows.push(
      `<tr><td>${indent} ${key}</td><td>${capitalize(type)}</td><td>${nullable}</td><td>-</td></tr>`,
    );

    if (typeof value === "object" && value !== null) {
      rows.push(...analyzeJsonStructure(value, depth + 1));
    }
  }

  return rows;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
