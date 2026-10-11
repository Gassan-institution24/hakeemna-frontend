// Turns a services spreadsheet into { code, name_english, name_arabic } rows.
//
// Sheets arrive in whatever shape the clinic made them, e.g.
//   | D000 | SERVICE                       | SEPCILTY          |
//   | D001 | Comprehensive oral examination | General Dentistry |
// so columns are found by their header text, with the code column also recognised by its values
// ("D001"). A sub-speciality column like SEPCILTY is detected and ignored — the speciality is the
// one picked on the page, not the one written in the sheet.

const SERVICE_HEADER = /service|procedure|treatment|description|الخدم|الإجراء|الاجراء/i;
const NAME_HEADER = /name|اسم/i;
const ARABIC_HEADER = /arab|عربي/i;
const CODE_HEADER = /code|رمز|كود|^no\.?$|^#$/i;
const SPECIALITY_HEADER = /spec|sepc|speci|specialit|specialt|تخصص/i;
const CODE_VALUE = /^[A-Za-z]{0,5}[-\s]?\d{1,6}[A-Za-z]?$/;

const text = (value) => (value === undefined || value === null ? '' : String(value).trim());

const columnLetter = (index) => {
  let n = index + 1;
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

/** Share of non-empty values in a column that look like service codes. */
const codeLikeShare = (rows, col) => {
  const values = rows.map((row) => text(row[col])).filter(Boolean);
  if (!values.length) return 0;
  return values.filter((v) => CODE_VALUE.test(v)).length / values.length;
};

/**
 * Find the header row and guess which column is which.
 * @param {Array<Array>} aoa sheet as an array of rows (XLSX sheet_to_json with header: 1)
 */
export function analyzeSheet(aoa) {
  const rows = (aoa || []).map((row) => (Array.isArray(row) ? row : []));
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);

  // Header = first row (within the top 20) naming a service/name column.
  let headerIndex = rows
    .slice(0, 20)
    .findIndex((row) =>
      row.some((cell) => SERVICE_HEADER.test(text(cell)) || CODE_HEADER.test(text(cell)))
    );
  const hasHeader = headerIndex >= 0;
  if (!hasHeader) headerIndex = -1;

  const header = hasHeader ? rows[headerIndex].map(text) : [];
  const body = rows.slice(headerIndex + 1);

  const columns = Array.from({ length: width }, (_, index) => ({
    index,
    label: header[index] ? `${columnLetter(index)} — ${header[index]}` : `${columnLetter(index)}`,
  }));

  const pick = (test, exclude = []) =>
    header.findIndex((cell, i) => cell && !exclude.includes(i) && test(cell));

  const speciality = pick((cell) => SPECIALITY_HEADER.test(cell) && !SERVICE_HEADER.test(cell));
  const arabic = pick((cell) => ARABIC_HEADER.test(cell), [speciality]);

  let code = pick((cell) => CODE_HEADER.test(cell), [speciality, arabic]);
  if (code < 0) {
    // No "code" header (the sample sheet's code column is headed "D000"): pick the column whose
    // values look most like codes.
    let best = -1;
    let bestShare = 0.6;
    for (let i = 0; i < width; i += 1) {
      if (i !== speciality && i !== arabic) {
        const share = codeLikeShare(body, i);
        if (share > bestShare) {
          best = i;
          bestShare = share;
        }
      }
    }
    code = best;
  }

  let service = pick((cell) => SERVICE_HEADER.test(cell), [speciality, arabic, code]);
  if (service < 0) service = pick((cell) => NAME_HEADER.test(cell), [speciality, arabic, code]);
  if (service < 0) {
    // Fall back to the column with the longest text that is none of the others.
    let best = -1;
    let bestLength = 0;
    for (let i = 0; i < width; i += 1) {
      if (![speciality, arabic, code].includes(i)) {
        const length = body.reduce((sum, row) => sum + text(row[i]).length, 0);
        if (length > bestLength) {
          best = i;
          bestLength = length;
        }
      }
    }
    service = best;
  }

  return {
    headerIndex,
    columns,
    mapping: { code, service, arabic },
    ignored: speciality >= 0 ? columns[speciality].label : null,
  };
}

/** Rows under the header, read with the given column mapping. Blank lines are dropped. */
export function extractRows(aoa, headerIndex, mapping) {
  return (aoa || [])
    .slice(headerIndex + 1)
    .map((row, i) => ({
      rowNumber: headerIndex + 2 + i,
      code: mapping.code >= 0 ? text(row?.[mapping.code]).toUpperCase() : '',
      name_english: mapping.service >= 0 ? text(row?.[mapping.service]) : '',
      name_arabic: mapping.arabic >= 0 ? text(row?.[mapping.arabic]) : '',
    }))
    .filter((row) => row.code || row.name_english || row.name_arabic);
}

/**
 * Tag each row with what the import will do, given the codes already in the speciality.
 * status: 'new' | 'update' | 'duplicate' (a later row in the file has the same code) | 'invalid'
 */
export function classifyRows(rows, existingCodes) {
  const lastIndexByCode = new Map();
  rows.forEach((row, i) => {
    if (row.code) lastIndexByCode.set(row.code, i);
  });

  return rows.map((row, i) => {
    if (!row.code) return { ...row, status: 'invalid', reason: 'missing code' };
    if (!row.name_english && !row.name_arabic) {
      return { ...row, status: 'invalid', reason: 'missing service name' };
    }
    if (lastIndexByCode.get(row.code) !== i) return { ...row, status: 'duplicate' };
    return { ...row, status: existingCodes.has(row.code) ? 'update' : 'new' };
  });
}
