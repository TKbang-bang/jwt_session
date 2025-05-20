const nameValidator = (name) => {
  if (!name) return { ok: false, message: "Name is required", status: 400 };

  if (typeof name !== "string")
    return { ok: false, message: "Name must be a string", status: 400 };

  if (name.length < 3)
    return {
      ok: false,
      message: "Name must be at least 3 characters",
      status: 400,
    };

  return { ok: true };
};

const emailValidator = (email) => {
  if (!email) return { ok: false, message: "Email is required", status: 400 };

  if (typeof email !== "string")
    return { ok: false, message: "Email must be a string", status: 400 };

  if (!email.includes("@"))
    return { ok: false, message: "Email must be a valid email", status: 400 };

  return { ok: true };
};

const passwordValidator = (password) => {
  if (!password)
    return { ok: false, message: "Password is required", status: 400 };

  if (typeof password !== "string")
    return { ok: false, message: "Password must be a string", status: 400 };

  if (password.length < 6)
    return {
      ok: false,
      message: "Password must be at least 6 characters",
      status: 400,
    };

  return { ok: true };
};

module.exports = { nameValidator, emailValidator, passwordValidator };
