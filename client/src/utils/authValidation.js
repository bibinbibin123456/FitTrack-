const getPasswordByteLength = (password) =>
  new TextEncoder().encode(password).length;

export const getEmailError = (email) => {
  const value = email.trim().toLowerCase();
  if (!value) return "Email is required.";
  if (value.length > 254) return "Email must be 254 characters or fewer.";

  const [localPart, domain, ...extraParts] = value.split("@");
  if (
    !localPart ||
    !domain ||
    extraParts.length > 0 ||
    localPart.length > 64 ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..") ||
    !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(
      localPart
    )
  ) {
    return "Enter a valid email address.";
  }

  const domainLabels = domain.split(".");
  const validDomain =
    domainLabels.length > 1 &&
    domainLabels.every(
      (label) =>
        label.length <= 63 &&
        /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)
    ) &&
    /^[A-Za-z]{2,63}$/.test(domainLabels[domainLabels.length - 1]);

  return validDomain ? "" : "Enter a valid email address.";
};

export const getPhoneError = (value) => {
  const phone = value.trim();
  if (!phone) return "Phone number is required.";
  return /^(?:\+91[ -]?)?[6-9]\d{9}$/.test(phone)
    ? ""
    : "Enter a 10-digit Indian mobile number starting with 6-9, optionally prefixed with +91.";
};

export const getLoginPasswordError = (password) => {
  if (!password) return "Please enter your password.";
  return getPasswordByteLength(password) > 72
    ? "Your password is too long. Please shorten it."
    : "";
};

export const getRegistrationPasswordError = (password) => {
  if (!password) return "Please enter a password.";
  const byteLength = getPasswordByteLength(password);
  if (byteLength < 8) return "Please use at least 8 characters.";
  if (byteLength > 72) return "Your password is too long. Please shorten it.";
  if (!/[a-z]/.test(password)) return "Please include at least one small letter.";
  if (!/[A-Z]/.test(password)) return "Please include at least one capital letter.";
  if (!/\d/.test(password)) return "Please include at least one number.";
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return "Please include at least one symbol, such as ! or #.";
  }
  return "";
};

export const getConfirmPasswordError = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password.";
  return password === confirmPassword ? "" : "Passwords do not match.";
};
