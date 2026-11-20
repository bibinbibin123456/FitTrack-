const sanitizeText = (value, maxLength) => {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
};

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const isValidEmail = (value) => {
  if (typeof value !== "string" || value.length > 254) return false;

  const [localPart, domain, ...extraParts] = value.split("@");
  if (
    !localPart ||
    !domain ||
    extraParts.length > 0 ||
    localPart.length > 64 ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..") ||
    !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(localPart)
  ) {
    return false;
  }

  const domainLabels = domain.split(".");
  return (
    domainLabels.length > 1 &&
    domainLabels.every((label) =>
      label.length <= 63 &&
      /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)
    ) &&
    /^[A-Za-z]{2,63}$/.test(domainLabels[domainLabels.length - 1])
  );
};

const isValidPhone = (value) => {
  if (typeof value !== "string") return false;

  const phone = value.trim();
  if (!/^\+?[0-9][0-9()\s-]*[0-9]$/.test(phone)) return false;

  const digitCount = phone.replace(/\D/g, "").length;
  if (digitCount < 7 || digitCount > 15 || /\(\s*\)/.test(phone)) return false;

  let parenthesisDepth = 0;
  for (const character of phone) {
    if (character === "(") parenthesisDepth += 1;
    if (character === ")") {
      parenthesisDepth -= 1;
      if (parenthesisDepth < 0) return false;
    }
  }

  return parenthesisDepth === 0;
};

const isValidIndianPhone = (value) =>
  typeof value === "string" &&
  /^(?:\+91[ -]?)?[6-9]\d{9}$/.test(value.trim());

const isStrongPassword = (value) =>
  typeof value === "string" &&
  /[a-z]/.test(value) &&
  /[A-Z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9\s]/.test(value);

const isValidObjectId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const parseNumber = (value) => {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isValidOptionalMeasurement = (value, minimum, maximum) => {
  if (value === undefined || value === null || value === "") return true;
  const parsed = parseNumber(value);
  return parsed !== null && parsed >= minimum && parsed <= maximum;
};

module.exports = {
  sanitizeText,
  normalizeEmail,
  isValidEmail,
  isValidPhone,
  isValidIndianPhone,
  isStrongPassword,
  isValidObjectId,
  parseNumber,
  isValidOptionalMeasurement,
};
