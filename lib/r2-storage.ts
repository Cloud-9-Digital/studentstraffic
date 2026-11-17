import "server-only";

import { createHash } from "node:crypto";
import { AwsClient } from "aws4fetch";
import sharp from "sharp";

import { attachmentKey, attachmentUrl, type AttachmentKind } from "@/lib/attachment-links";
import { env } from "@/lib/env";

import { publicMediaHostname } from "@/lib/public-media-url";

function storage(scope: "PUBLIC" | "PRIVATE") {
  const account = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env[`R2_${scope}_ACCESS_KEY_ID`];
  const secretAccessKey = process.env[`R2_${scope}_SECRET_ACCESS_KEY`];
  const bucket = process.env[`R2_${scope}_BUCKET`];
  const allowed = scope === "PUBLIC" ? "studentstraffic-public-media" : "studentstraffic-private-files";
  if (!account || !/^[a-f0-9]{32}$/.test(account) || bucket !== allowed || !accessKeyId || !secretAccessKey) return;
  return {
    endpoint: `https://${account}.r2.cloudflarestorage.com/${bucket}/`,
    client: new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto", retries: 1 }),
  };
}

export async function uploadPublicCoverToR2(file: File): Promise<string | undefined> {
  const r2 = storage("PUBLIC");
  if (!r2) return undefined;
  if (file.size <= 0 || file.size > 5 * 1024 * 1024 || !/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
    throw new Error("Unsupported cover image or file size.");
  }
  const data = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40_000_000 })
    .rotate().resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 81 }).toBuffer();
  const hash = createHash("sha256").update(data).digest("hex");
  const key = `images/owned/v1/${hash}.webp`;
  const upload = await r2.client.fetch(r2.endpoint + key, {
    method: "PUT",
    body: new Uint8Array(data),
    headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
    signal: AbortSignal.timeout(25_000),
  });
  if (!upload.ok) throw new Error("Cover storage is unavailable.");
  return `https://${publicMediaHostname}/${key}`;
}

export async function fetchR2Brochure(key: string): Promise<Response | undefined> {
  const r2 = storage("PRIVATE");
  if (!r2 || !/^brochures\/v1\/[a-f0-9]{64}\.pdf$/.test(key)) return undefined;
  const response = await r2.client.fetch(r2.endpoint + key, {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (response.ok && response.headers.get("content-type")?.split(";")[0] === "application/pdf") return response;
  await response.body?.cancel();
  return undefined;
}

const attachmentTypes = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
} as const;

export async function uploadPrivateAttachment(file: File, kind: AttachmentKind, maxBytes: number) {
  const r2 = storage("PRIVATE");
  if (!r2) throw new Error("Private file storage is unavailable. Please try again.");
  if (file.size <= 0 || file.size > maxBytes) {
    throw new Error(`File is too large. Maximum size is ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  }
  const extension = Object.keys(attachmentTypes).find(
    (ext) => attachmentTypes[ext as keyof typeof attachmentTypes] === file.type
  );
  if (!extension) throw new Error("Unsupported file type.");
  const data = Buffer.from(await file.arrayBuffer());
  if (extension === "pdf") {
    if (data.subarray(0, 5).toString("ascii") !== "%PDF-") throw new Error("Invalid PDF.");
  } else {
    const { format } = await sharp(data, { limitInputPixels: 40_000_000 }).metadata();
    if (format !== (extension === "jpg" ? "jpeg" : extension)) throw new Error("Invalid image.");
  }
  const filename = `${createHash("sha256").update(data).digest("hex")}.${extension}`;
  const key = attachmentKey(kind, filename);
  if (!key) throw new Error("Unsupported attachment type.");
  const response = await r2.client.fetch(r2.endpoint + key, {
    method: "PUT",
    body: new Uint8Array(data),
    headers: { "Content-Type": file.type, "Cache-Control": "private, no-store" },
    signal: AbortSignal.timeout(25_000),
  });
  await response.body?.cancel();
  if (!response.ok) throw new Error("File storage is unavailable. Please try again.");
  return attachmentUrl(env.siteUrl, kind, filename);
}

export async function fetchPrivateAttachment(kind: string, file: string) {
  const r2 = storage("PRIVATE");
  const key = attachmentKey(kind, file);
  if (!r2 || !key) return;
  const response = await r2.client.fetch(r2.endpoint + key, {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  const type = attachmentTypes[file.split(".").at(-1) as keyof typeof attachmentTypes];
  if (response.ok && response.headers.get("content-type")?.split(";")[0] === type) {
    return { response, type };
  }
  await response.body?.cancel();
}
