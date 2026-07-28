import { AppError } from "../utils/appError.js";

async function uploadToImgBB(file) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new AppError("Image hosting is not configured yet.", 503);
  }

  if (!file) {
    throw new AppError("Choose an image to upload.", 400);
  }

  const formData = new FormData();
  formData.append(
    "image",
    new Blob([file.buffer], { type: file.mimetype }),
    file.originalname
  );

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: formData
    }
  );
  const payload = await response.json();

  if (!response.ok || !payload?.data?.url) {
    throw new AppError(payload?.error?.message || "Image upload failed.", 502);
  }

  return {
    url: payload.data.display_url || payload.data.url,
    deleteUrl: payload.data.delete_url || null
  };
}

export async function uploadProfileImage(req, res) {
  const image = await uploadToImgBB(req.file);
  res.status(201).json({ image });
}

export async function uploadFacilityImage(req, res) {
  const image = await uploadToImgBB(req.file);
  res.status(201).json({ image });
}
