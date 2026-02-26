exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.render('auth/login', { error: 'Usuario no encontrado' });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.render('auth/login', { error: 'Contraseña incorrecta' });
  }

  req.session.user = {
    id: user.id,
    role: user.role,
    name: user.name
  };

  res.redirect('/dashboard');
};