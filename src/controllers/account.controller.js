export const accountVerifyBefore = async (req, res) => {
  try {
    console.log("accountVerifyBefore");
    res.status(200).send();
  } catch (error) {
    console.error("Account verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
