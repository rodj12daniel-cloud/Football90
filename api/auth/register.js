const { registerUser, setCustomerCookie, validateCredentials } = require('./_helpers');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });

  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const validationError = validateCredentials(name, email, password);

  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const user = await registerUser({ name, email, password });
    setCustomerCookie(res, user);
    return res.status(201).json({ user });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'An account with that email already exists.' });
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Unable to create your account right now.' });
  }
};
