import axios from "axios";

export const sendSms = async (to, message) => {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) throw new Error("FAST2SMS_API_KEY missing in .env");

  // Format phone number correctly
  const formattedNumber = to.replace(/\D/g, "");

  try {
    const res = await axios.get(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=v3&message=${encodeURIComponent(
        message
      )}&language=english&flash=0&numbers=${formattedNumber}`
    );

    if (res.data.return) {
      console.log("✅ SMS sent via Fast2SMS:", res.data);
    } else {
      console.error("❌ Fast2SMS failed:", res.data);
    }

    return res.data;
  } catch (err) {
    console.error("❌ Fast2SMS error:", err.message);
    throw err;
  }
};
