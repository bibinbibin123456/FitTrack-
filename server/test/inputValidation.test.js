const test = require('node:test');
const assert = require('node:assert/strict');
const {
    sanitizeText,
    normalizeEmail,
    isValidEmail,
    isValidPhone,
    isValidIndianPhone,
    isStrongPassword,
    isValidObjectId,
    parseNumber,
    isValidOptionalMeasurement,
} = require('../Utilities/inputValidation');

test('sanitizeText removes control characters, trims, and respects the limit', () => {
    assert.equal(sanitizeText('  hello\u0000 world  ', 8), 'hello wo');
    assert.equal(sanitizeText(null, 10), '');
});

test('normalizeEmail trims whitespace and lowercases addresses', () => {
    assert.equal(normalizeEmail('  Person@Example.com '), 'person@example.com');
    assert.equal(normalizeEmail(null), '');
});

test('isValidEmail accepts a normal address and rejects malformed input', () => {
    assert.equal(isValidEmail('person@example.com'), true);
    assert.equal(isValidEmail('first..last@example.com'), false);
    assert.equal(isValidEmail('person@-example.com'), false);
    assert.equal(isValidEmail('not-an-email'), false);
    assert.equal(isValidEmail('x'.repeat(250) + '@example.com'), false);
});

test('phone validators accept their supported formats and reject invalid numbers', () => {
    assert.equal(isValidPhone('+1 (555) 123-4567'), true);
    assert.equal(isValidPhone('555-1234'), true);
    assert.equal(isValidPhone('((((((('), false);
    assert.equal(isValidPhone('123456'), false);
    assert.equal(isValidPhone('555)123-4567'), false);
    assert.equal(isValidPhone('555abc'), false);
    assert.equal(isValidIndianPhone('9876543210'), true);
    assert.equal(isValidIndianPhone('+91 9876543210'), true);
    assert.equal(isValidIndianPhone('+91-9876543210'), true);
    assert.equal(isValidIndianPhone('5876543210'), false);
    assert.equal(isValidIndianPhone('1234567890'), false);
    assert.equal(isValidIndianPhone('+1 5551234567'), false);
    assert.equal(isValidIndianPhone('987654321'), false);
});

test('isStrongPassword requires upper/lowercase letters, a number, and a symbol', () => {
    assert.equal(isStrongPassword('Fitness1!'), true);
    assert.equal(isStrongPassword('password1!'), false);
    assert.equal(isStrongPassword('Password!'), false);
    assert.equal(isStrongPassword('Password1'), false);
    assert.equal(isStrongPassword('Password1 '), false);
    assert.equal(isValidObjectId('507f1f77bcf86cd799439011'), true);
    assert.equal(isValidObjectId('not-an-object-id'), false);
});

test('parseNumber returns only finite numbers and rejects blank values', () => {
    assert.equal(parseNumber('12.5'), 12.5);
    assert.equal(parseNumber(0), 0);
    assert.equal(parseNumber('  '), null);
    assert.equal(parseNumber('Infinity'), null);
    assert.equal(parseNumber({ value: 1 }), null);
});

test('isValidOptionalMeasurement accepts blank values and checks provided ranges', () => {
    assert.equal(isValidOptionalMeasurement('', 20, 300), true);
    assert.equal(isValidOptionalMeasurement(null, 20, 300), true);
    assert.equal(isValidOptionalMeasurement('68.5', 20, 300), true);
    assert.equal(isValidOptionalMeasurement('19', 20, 300), false);
    assert.equal(isValidOptionalMeasurement('301', 20, 300), false);
    assert.equal(isValidOptionalMeasurement('unknown', 20, 300), false);
});
