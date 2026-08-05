import { v2 as cloudinary } from "cloudinary";

// Server-side, signed Cloudinary uploads for candidate CVs and employer JDs.
// Configured from env; api_secret makes every upload a signed server request
// (never client-direct). Files land in /cvs/{applicationId}.{ext} and
// /jds/{inquiryId}.{ext}.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const EXT_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export type UploadResult = { url: string; publicId: string; sizeBytes: number };

/** Thrown with an HTTP status so the route can map it to 413 / 415 / 500. */
export class UploadError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "UploadError";
    this.status = status;
  }
}

function validate(file: File) {
  if (file.size > MAX_BYTES) {
    throw new UploadError(`File is too large (max ${MAX_BYTES / 1024 / 1024}MB).`, 413);
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new UploadError("Unsupported file type. Upload a PDF, DOC or DOCX.", 415);
  }
}

async function upload(file: File, folder: "cvs" | "jds", id: string): Promise<UploadResult> {
  validate(file);
  const ext = EXT_BY_MIME[file.type] ?? file.name.split(".").pop() ?? "bin";
  const dataUri = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`;
  try {
    const res = await cloudinary.uploader.upload(dataUri, {
      resource_type: "raw", // pdf/doc/docx are stored verbatim + directly downloadable
      folder,
      public_id: `${id}.${ext}`,
      overwrite: true,
    });
    return { url: res.secure_url, publicId: res.public_id, sizeBytes: res.bytes };
  } catch (err) {
    throw new UploadError(`Upload failed: ${(err as Error).message}`, 500);
  }
}

export function uploadCV(file: File, applicationId: string): Promise<UploadResult> {
  return upload(file, "cvs", applicationId);
}

export function uploadJD(file: File, inquiryId: string): Promise<UploadResult> {
  return upload(file, "jds", inquiryId);
}

/** Rollback helpers — delete an uploaded file if a later step (DB insert) fails. */
async function remove(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch (err) {
    // Best-effort: a failed rollback shouldn't mask the original error.
    console.error("[cloudinary] rollback delete failed", { publicId, err });
  }
}

export const deleteCV = remove;
export const deleteJD = remove;
