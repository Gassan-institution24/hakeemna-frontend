import * as XLSX from 'xlsx';

// Turns an imaging spreadsheet into { diagnostic_test, imagining_group, international_code,
// description } rows.
//
// A header row is recognised by its labels (English or Arabic). Without one the sheet is read in
// the template's order: A = international code, B = diagnostic test, C = imaging group,
// D = description. Each key tries its patterns in order, and keys are matched most specific first
// so a "Description" column is never taken as the test name.

export const IMAGING_TEMPLATE_HEADERS = [
  'International Code',
  'Diagnostic Test',
  'Imaging Group',
  'Description',
];

const HEADER_MATCHERS = {
  description: [/desc|note|الوصف|وصف|ملاحظ/i],
  imagining_group: [/group|modality|category|مجموع|فئة|نوع/i],
  international_code: [/international|cpt|icd|رمز دولي|الرمز الدولي/i, /code|رمز|كود/i],
  diagnostic_test: [/diagnostic|test|exam|procedure|فحص|الفحص|اختبار/i, /^name$|name|اسم|الاسم/i],
};
const MATCH_ORDER = ['description', 'imagining_group', 'international_code', 'diagnostic_test'];
const FALLBACK_COLUMNS = {
  international_code: 0,
  diagnostic_test: 1,
  imagining_group: 2,
  description: 3,
};

function findColumns(rows) {
  for (let r = 0; r < Math.min(rows.length, 10); r += 1) {
    const cells = rows[r].map((c) => String(c ?? '').trim());
    if (cells.filter(Boolean).length >= 2) {
      const cols = {};
      MATCH_ORDER.forEach((key) => {
        HEADER_MATCHERS[key].some((pattern) => {
          const idx = cells.findIndex(
            (cell, i) => cell && pattern.test(cell) && !Object.values(cols).includes(i)
          );
          if (idx !== -1) cols[key] = idx;
          return idx !== -1;
        });
      });
      if (cols.diagnostic_test !== undefined) return { cols, headerRow: r };
    }
  }
  return { cols: FALLBACK_COLUMNS, headerRow: -1 };
}

export function parseImagingSheet(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const { cols, headerRow } = findColumns(rows);
  const cell = (row, key) => (cols[key] === undefined ? '' : String(row[cols[key]] ?? '').trim());

  const parsed = rows.slice(headerRow + 1).map((row) => ({
    international_code: cell(row, 'international_code').toUpperCase(),
    diagnostic_test: cell(row, 'diagnostic_test'),
    imagining_group: cell(row, 'imagining_group'),
    description: cell(row, 'description') === '0' ? '' : cell(row, 'description'),
  }));

  // Rows without a test name (blank lines, totals, notes) are not imaging entries.
  const named = parsed.filter((row) => row.diagnostic_test);

  // Repeated rows inside the file are imported once: by code, or by name when there is no code.
  const seen = new Set();
  const unique = named.filter((row) => {
    const key = row.international_code
      ? `code:${row.international_code}`
      : `name:${row.diagnostic_test.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    rows: unique,
    repeated: named.length - unique.length,
    skipped: parsed.filter((row) => !row.diagnostic_test && Object.values(row).some(Boolean))
      .length,
  };
}

export function downloadImagingTemplate() {
  const sheet = XLSX.utils.aoa_to_sheet([
    IMAGING_TEMPLATE_HEADERS,
    ['71045', 'Chest X-ray, single view', 'X-Ray', ''],
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Imaging');
  XLSX.writeFile(workbook, 'imaging-template.xlsx');
}
