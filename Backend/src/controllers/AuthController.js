import { authenticate, verifyToken } from "../services/AuthService.js";

const TOKEN_EXPIRATION = parseInt(process.env.TOKEN_EXPIRATION);

export const login = async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha)
      return res.status(400).json({ message: "usuario e senha são obrigatórios." });

    const token = await authenticate(usuario, senha);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: TOKEN_EXPIRATION,
    });

    res.status(200).json({
      message: "Autenticado com sucesso",
      expiresIn: `${TOKEN_EXPIRATION / 1000 / 60 / 60} hours`,
      token,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout realizado com sucesso" });
};

export const validateToken = (req, res) => {
  const token = req.cookies.token;
  const validation = verifyToken(token);
  res.status(validation.status).json(validation);
};
