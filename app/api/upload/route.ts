import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

// POST /api/upload — upload d'images
// Prod : Cloudinary si CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET sont définies
// Dev  : disque local dans public/images
const HAS_CLOUDINARY = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Seules les images sont acceptées" },
      { status: 400 }
    );
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image trop lourde (max 5 Mo)" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (HAS_CLOUDINARY) {
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "pozeidon" }, (err, res) => {
            if (err || !res) reject(err ?? new Error("Upload Cloudinary échoué"));
            else resolve(res as { secure_url: string });
          })
          .end(buffer);
      }
    );
    return NextResponse.json({ path: result.secure_url });
  }

  // Fallback local (dev uniquement — ne survit pas aux déploiements)
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "images");
  await mkdir(dir, { recursive: true });
  await writeFile(dir + "/" + safeName, buffer);
  return NextResponse.json({ path: `/images/${safeName}` });
}
