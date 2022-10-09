const cloudinary = require("cloudinary").v2;

export default function handler(req, res) {
  const timestamp = Math.round(Date.now() / 1000);
  //authentication signatures
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_SECRET
  );
  res.status(200).json({ signature, timestamp });
}
