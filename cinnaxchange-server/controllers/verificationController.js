import User from "../models/User.js";

export const uploadVerification = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.verification.nicFront = req.body.nicFront;
  user.verification.nicBack = req.body.nicBack;
  user.verification.selfie = req.body.selfie;

  user.verification.status = "pending";

  await user.save();

  res.json({ message: "Verification submitted" });
};