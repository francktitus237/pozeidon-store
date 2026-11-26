import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";

// POST /api/upload-public — photo du lieu d'installation envoyée par un
// client (formulaire /installation). Images uniquement, 3 Mo max.
// Pas d'auth : public par nature ; le volume est borné par la taille.
const MAX_SIZE = 3 * 1024 * 1024;

export async function POST(request: Request) {
  try {
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
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image trop lourde (max 3 Mo)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = `inst-${crypto.randomUUID()}.${ext}`;
    await db.insert(files).values({
      id: safeName,
      mime: file.type,
      data: buffer.toString("base64"),
    });
    return NextResponse.json({ path: `/uploads/${safeName}` });
  } catch (error) {
    console.error("[upload-public] error", error);
    return NextResponse.json(
      { error: "Envoi de la photo impossible" },
      { status: 500 }
    );
  }
}
