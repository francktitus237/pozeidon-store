import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

// POST /api/upload — upload d'images (dev local : public/images)
// TODO prod : basculer vers Cloudinary (clés dans .env.local :
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
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

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "images");

  await mkdir(dir, { recursive: true });
  await writeFile(dir + "/" + safeName, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ path: `/images/${safeName}` });
}
