import dotenv from "dotenv";
dotenv.config();

import { sendSms } from "./src/utils/sendSms.js";

(async () => {
  try {
    await sendSms("+91XXXXXXXXXX", "Hello! This is a MedRush test OTP via Fast2SMS.");
  } catch (err) {
    console.error(err.message);
  }
})();
