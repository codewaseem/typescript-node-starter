function isHonorific(word: string) {
  return word.match(/Mr\.|Mrs\./gm);
}

function splitName(name: string): string[] {
  return name.trim().split(/\s+/gm);
}

function getPostnominals(names: string[]) {
  if (names.length > 2) {
    return names.slice(2).join(" ");
  }
  return "";
}

function formatName(names: string[]) {
  if (names.length == 1) return names[0];
  return formatMultipartName(names);
}

function formatMultipartName(names: string[]) {
  let postnominal = getPostnominals(names);
  let firstName = names[0];
  let lastName = names[1];

  let formattedName = `${lastName}, ${firstName} ${postnominal}`.trim();
  return formattedName;
}

function removeHonorifics(names: readonly string[]) {
  let copy_names = [...names];
  if (copy_names.length > 1 && isHonorific(copy_names[0])) {
    copy_names.shift();
  }
  return copy_names;
}

export default function nameInverter(name: string) {
  return formatName(removeHonorifics(splitName(name)));
}
