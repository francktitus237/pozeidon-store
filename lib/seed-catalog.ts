// Catalogue de démarrage : produits réels extraits de Glotelho (images
// téléchargées dans public/images/products/ — elles persistent avec le code).
// Les prix sont des estimations du marché à ajuster dans /gestion/articles.

export interface SeedProduct {
  name: string;
  reference: string;
  description: string;
  price: number; // FCFA
  promoPrice?: number;
  stock: number;
  categoryId: string; // slug de la catégorie (= id)
  image: string;
}

const P = "/images/products/";

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: "ASUS Vivobook 15 X1504VA",
    reference: "GLT-001",
    description:
      "Ordinateur portable 15,6\" FHD pour le bureau et les études.\n\nCaractéristiques :\n- Processeur Intel Core i3/i5 13e génération\n- RAM 8 Go DDR4 (extensible)\n- SSD 512 Go NVMe\n- Écran 15,6\" Full HD antireflet\n- Windows 11\n- Garantie 6 mois",
    price: 350000,
    stock: 6,
    categoryId: "ordinateurs-neufs",
    image: `${P}asus_vivobook_15_x1504va_5.jpg`,
  },
  {
    name: "Lenovo IdeaPad Slim 3",
    reference: "GLT-002",
    description:
      "Portable léger et fin, idéal pour un usage quotidien.\n\nCaractéristiques :\n- Écran 15,6\" Full HD\n- Processeur Intel/AMD récent\n- RAM 8 Go\n- SSD 256/512 Go\n- Châssis fin, autonomie longue durée\n- Garantie 6 mois",
    price: 285000,
    stock: 8,
    categoryId: "ordinateurs-neufs",
    image: `${P}gloin0311032025cm.jpg`,
  },
  {
    name: "Acer Nitro Lite NL16-71G-56JH (Gaming)",
    reference: "GLT-003",
    description:
      "Portable gaming 16\" performant.\n\nCaractéristiques :\n- Intel Core i5 / i7 13e génération\n- Carte graphique NVIDIA GeForce RTX\n- RAM 16 Go DDR5\n- SSD 512 Go NVMe\n- Écran 16\" haute fréquence\n- Garantie 6 mois",
    price: 750000,
    stock: 4,
    categoryId: "ordinateurs-neufs",
    image: `${P}gloin1209042026cm1.jpg`,
  },
  {
    name: "HP OmniBook X Flip 2-en-1",
    reference: "GLT-004",
    description:
      "Portable convertible 2-en-1 avec écran tactile rotatif.\n\nCaractéristiques :\n- Écran tactile 14\" convertible tablette\n- Processeur Intel Core Ultra\n- RAM 16 Go\n- SSD 512 Go\n- Idéal présentations et mobilité\n- Garantie 6 mois",
    price: 850000,
    stock: 3,
    categoryId: "ordinateurs-neufs",
    image: `${P}hp_omnibook_x_flip_2-en-1_2_.jpg`,
  },
  {
    name: "HP ProBook 440 G11",
    reference: "GLT-005",
    description:
      "Portable professionnel 14\" robuste et sécurisé.\n\nCaractéristiques :\n- Écran 14\" WUXGA\n- Intel Core Ultra 5/7\n- RAM 16 Go DDR5\n- SSD 512 Go\n- Sécurité HP Wolf, châssis aluminium\n- Garantie 6 mois",
    price: 620000,
    stock: 5,
    categoryId: "ordinateurs-neufs",
    image: `${P}hp_probook_440_g11_1_1.jpg`,
  },
  {
    name: "HP ProBook 460 G11",
    reference: "GLT-006",
    description:
      "Portable professionnel 16\" grand écran.\n\nCaractéristiques :\n- Écran 16\" WUXGA\n- Intel Core Ultra\n- RAM 16 Go DDR5\n- SSD 512 Go\n- Pavé numérique, webcam HD\n- Garantie 6 mois",
    price: 650000,
    stock: 4,
    categoryId: "ordinateurs-neufs",
    image: `${P}hp_probook_460_g11_2.jpg`,
  },
  {
    name: "Lenovo IdeaPad Slim 3 — Intel Core i5-13420H",
    reference: "GLT-007",
    description:
      "Version musclée de l'IdeaPad Slim 3.\n\nCaractéristiques :\n- Intel Core i5-13420H (8 cœurs)\n- RAM 8/16 Go\n- SSD 512 Go\n- Écran 15,6\" FHD\n- Garantie 6 mois",
    price: 340000,
    stock: 6,
    categoryId: "ordinateurs-neufs",
    image: `${P}lenovo_ideapad_slim_3_-_intel_core_i5-13420h_1.jpg`,
  },
  {
    name: "Lenovo Legion 5 15IRX10 (Gaming)",
    reference: "GLT-008",
    description:
      "Machine gaming haut de gamme.\n\nCaractéristiques :\n- Intel Core i7/i9 HX\n- NVIDIA GeForce RTX 50xx\n- RAM 16/32 Go DDR5\n- SSD 1 To\n- Écran 15,6\" 165 Hz\n- Refroidissement Legion Coldfront\n- Garantie 6 mois",
    price: 1100000,
    stock: 2,
    categoryId: "ordinateurs-neufs",
    image: `${P}lenovo_legion_5_15irx10_1.jpg`,
  },
  {
    name: "Lenovo ThinkBook 16 G8 IAL — Core Ultra 7 + sac offert",
    reference: "GLT-009",
    description:
      "Portable pro 16\" livré avec sac Lenovo.\n\nCaractéristiques :\n- Intel Core Ultra 7\n- RAM 16 Go\n- SSD 512 Go\n- Écran 16\" WUXGA\n- Sac pour laptop Lenovo inclus\n- Garantie 6 mois",
    price: 780000,
    stock: 3,
    categoryId: "ordinateurs-neufs",
    image: `${P}lenovo_thinkbook_16_g8_ial_-_intel_core_ultra_7_sac_pour_laptop_lenovo_inclus_2_.jpg`,
  },
  {
    name: "Lenovo ThinkPad E14 Gen 7 — Core Ultra 7",
    reference: "GLT-010",
    description:
      "Le ThinkPad compact pour les pros.\n\nCaractéristiques :\n- Écran 14\" WUXGA\n- Intel Core Ultra 7\n- RAM 16 Go\n- SSD 512 Go\n- Clavier ThinkPad rétroéclairé, noir\n- Garantie 6 mois",
    price: 720000,
    stock: 4,
    categoryId: "ordinateurs-neufs",
    image: `${P}lenovo_thinkpad_e14_gen_7_-_cran_14_wuxga_-_intel_core_ultra_7_2_.jpg`,
  },
  {
    name: "Microsoft Surface Laptop",
    reference: "GLT-011",
    description:
      "Portable premium fin et élégant.\n\nCaractéristiques :\n- Écran tactile PixelSense\n- Processeur récent, grande autonomie\n- RAM 16 Go\n- SSD 256/512 Go\n- Châssis aluminium\n- Garantie 6 mois",
    price: 650000,
    stock: 3,
    categoryId: "ordinateurs-neufs",
    image: `${P}microsoft_surface_laptop_1.jpg`,
  },
  {
    name: "Microsoft Surface Laptop 7th Edition (2024)",
    reference: "GLT-012",
    description:
      "Dernière génération Surface, puce Copilot+.\n\nCaractéristiques :\n- Snapdragon X Elite / Intel récent\n- Écran tactile 13,8\" ou 15\"\n- RAM 16/32 Go\n- SSD 512 Go/1 To\n- Jusqu'à 20 h d'autonomie\n- Garantie 6 mois",
    price: 950000,
    stock: 2,
    categoryId: "ordinateurs-neufs",
    image: `${P}microsoft_surface_laptop_7th_edition_2024_1__1.jpg`,
  },
  {
    name: "Microsoft Surface Pro 11 (2024) — 2-en-1",
    reference: "GLT-013",
    description:
      "Tablette + PC : le plus polyvalent.\n\nCaractéristiques :\n- Écran tactile 13\" amovible\n- Snapdragon X / Intel Core Ultra\n- RAM 16 Go\n- SSD 512 Go\n- Compatible clavier Type Cover et stylet\n- Garantie 6 mois",
    price: 1050000,
    stock: 2,
    categoryId: "ordinateurs-neufs",
    image: `${P}microsoft_surface_pro_11th_edition_2024_2_en_1_2_.jpg`,
  },
  {
    name: "Lenovo LOQ 15IRX9 (Gaming)",
    reference: "GLT-014",
    description:
      "Gaming accessible sans compromis.\n\nCaractéristiques :\n- Intel Core i5/i7 HX\n- NVIDIA GeForce RTX\n- RAM 16 Go DDR5\n- SSD 512 Go\n- Écran 15,6\" 144 Hz\n- Garantie 6 mois",
    price: 800000,
    stock: 4,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_gaming_-_lenovo_loq_15irx9_1.jpg`,
  },
  {
    name: "HP Victus 15 (Gaming)",
    reference: "GLT-015",
    description:
      "Portable gaming au design épuré.\n\nCaractéristiques :\n- Intel Core i5 / AMD Ryzen 5\n- NVIDIA GeForce RTX\n- RAM 16 Go\n- SSD 512 Go\n- Écran 15,6\" 144 Hz\n- Garantie 6 mois",
    price: 780000,
    stock: 3,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_gaming_hp_victus_15_1_.jpg`,
  },
  {
    name: "ASUS Vivobook 14",
    reference: "GLT-016",
    description:
      "Portable 14\" compact et abordable.\n\nCaractéristiques :\n- Écran 14\" FHD\n- Intel Core i3/i5\n- RAM 8 Go\n- SSD 512 Go\n- 1,4 kg seulement\n- Garantie 6 mois",
    price: 320000,
    stock: 7,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_-_asus_vivobook_14_10.jpg`,
  },
  {
    name: "HP 15-FD — 15,6\" tactile, Core 5 120U, 8/512 Go",
    reference: "GLT-017",
    description:
      "Portable tactile grand écran, gris.\n\nCaractéristiques :\n- Écran tactile 15,6\"\n- Intel Core 5 120U\n- RAM 8 Go DDR5\n- SSD 512 Go\n- Garantie 6 mois",
    price: 420000,
    stock: 5,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_-_hp_-_15_fd_-_15.6_tactile_-_intel_core_5_120u_-_8_go_ddr5_ram_2_.jpg`,
  },
  {
    name: "HP 15-FD — Écran tactile",
    reference: "GLT-018",
    description:
      "Version tactile du best-seller HP 15.\n\nCaractéristiques :\n- Écran tactile 15,6\"\n- Processeur Intel récent\n- RAM 8 Go\n- SSD 256/512 Go\n- Garantie 6 mois",
    price: 395000,
    stock: 4,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_-_hp_-_15_fd_-_cran_tactile2.jpg`,
  },
  {
    name: "HP 15-FD",
    reference: "GLT-019",
    description:
      "Le portable polyvalent le plus vendu.\n\nCaractéristiques :\n- Écran 15,6\" FHD\n- Intel Core i3/i5\n- RAM 8 Go\n- SSD 256/512 Go\n- Garantie 6 mois",
    price: 385000,
    stock: 6,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_-_hp_-_15_fd_1_1.jpg`,
  },
  {
    name: "HP 15-FD — 512 Go SSD, 8 Go DDR5",
    reference: "GLT-020",
    description:
      "Configuration équilibrée du HP 15.\n\nCaractéristiques :\n- Écran 15,6\" FHD\n- Processeur Intel récent\n- RAM 8 Go DDR5\n- SSD 512 Go\n- Garantie 6 mois",
    price: 395000,
    stock: 5,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_-_hp_15-fd_-_512_go_ssd_-_8_go_ram_ddr5_1.jpg`,
  },
  {
    name: "HP ProBook 460 G11 — Ultra 7 155U, 1 To SSD, 16 Go",
    reference: "GLT-021",
    description:
      "Configuration musclée : gros stockage, grosse RAM.\n\nCaractéristiques :\n- Écran 16\"\n- Intel Core Ultra 7 155U\n- RAM 16 Go DDR5\n- SSD 1 To\n- Garantie 6 mois",
    price: 690000,
    stock: 3,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_-_hp_probook_460_g11_7.jpg`,
  },
  {
    name: "HP ProBook Fortis 14 G10",
    reference: "GLT-022",
    description:
      "Portable robuste pensé pour l'éducation et le terrain.\n\nCaractéristiques :\n- Écran 14\"\n- Châssis renforcé anti-choc\n- Processeur Intel économique\n- RAM 8 Go\n- SSD 256 Go\n- Garantie 6 mois",
    price: 280000,
    stock: 8,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_-_hp_probook_fortis_14_g10_1.jpg`,
  },
  {
    name: "Lenovo Legion Go",
    reference: "GLT-023",
    description:
      "Console portable gaming sous Windows.\n\nCaractéristiques :\n- Écran 8,8\" QHD+ 144 Hz tactile\n- AMD Ryzen Z1 Extreme\n- RAM 16 Go\n- SSD 512 Go\n- Manettes détachables\n- Garantie 6 mois",
    price: 750000,
    stock: 2,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_-_lenovo_legion_go_3_.jpg`,
  },
  {
    name: "Lenovo V15 G5",
    reference: "GLT-024",
    description:
      "Portable 15,6\" fiable pour le bureau.\n\nCaractéristiques :\n- Écran 15,6\" FHD\n- Intel Core i3/i5 ou AMD\n- RAM 8 Go\n- SSD 256/512 Go\n- Garantie 6 mois",
    price: 360000,
    stock: 6,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_-_lenovo_v15_g5_1.jpg`,
  },
  {
    name: "Dell Pro 15 Essential PV15250",
    reference: "GLT-025",
    description:
      "Portable Dell 15\" série Essential.\n\nCaractéristiques :\n- Écran 15,6\" FHD\n- Intel Core i5\n- RAM 8/16 Go\n- SSD 512 Go\n- Fiabilité Dell Pro\n- Garantie 6 mois",
    price: 450000,
    stock: 4,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_dell_pro_15_essential_pv15250_1.jpg`,
  },
  {
    name: "Acer Nitro Lite 16 (Gaming)",
    reference: "GLT-026",
    description:
      "Gaming 16\" au meilleur prix.\n\nCaractéristiques :\n- Intel Core i5 13e génération\n- NVIDIA GeForce RTX\n- RAM 16 Go DDR5\n- SSD 512 Go\n- Écran 16\" fluide\n- Garantie 6 mois",
    price: 780000,
    stock: 3,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_gaming_-_acer_-_nitro_lite_16.jpg`,
  },
  {
    name: "HP 15-FD — 512 Go SSD, 16 Go DDR5",
    reference: "GLT-027",
    description:
      "Configuration confort : 16 Go de RAM.\n\nCaractéristiques :\n- Écran 15,6\"\n- Processeur Intel récent\n- RAM 16 Go DDR5\n- SSD 512 Go\n- Garantie 6 mois",
    price: 425000,
    stock: 4,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_hp_15-fd_5.jpg`,
  },
  {
    name: "HP ProBook 460 G11 — Core Ultra 5",
    reference: "GLT-028",
    description:
      "ProBook 16\" en version Ultra 5.\n\nCaractéristiques :\n- Écran 16\"\n- Intel Core Ultra 5\n- RAM 16 Go\n- SSD 512 Go\n- Garantie 6 mois",
    price: 640000,
    stock: 3,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_hp_probook_460_g11_intel_core_ultra_5_2_.jpg`,
  },
  {
    name: "Lenovo IdeaPad 1 14IJL7",
    reference: "GLT-029",
    description:
      "Le plus abordable : bureautique et web.\n\nCaractéristiques :\n- Écran 14\" HD\n- Intel Celeron / Pentium\n- RAM 4/8 Go\n- SSD 128/256 Go\n- Ultra léger\n- Garantie 6 mois",
    price: 210000,
    stock: 9,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_lenovo_ideapad_1_14ijl75.jpg`,
  },
  {
    name: "Lenovo Yoga 7 2-en-1 — Écran 16\"",
    reference: "GLT-030",
    description:
      "Grand convertible haut de gamme.\n\nCaractéristiques :\n- Écran tactile 16\" convertible\n- Intel Core Ultra / Ryzen\n- RAM 16 Go\n- SSD 512 Go/1 To\n- Stylet compatible\n- Garantie 6 mois",
    price: 880000,
    stock: 2,
    categoryId: "ordinateurs-neufs",
    image: `${P}ordinateur_portable_lenovo_yoga_7_2-en-1_06.jpg`,
  },
  {
    name: "Pack ASUS Vivobook 14 + sac à dos + souris + clé USB 128 Go",
    reference: "GLT-031",
    description:
      "Pack complet prêt à l'emploi.\n\nContenu :\n- ASUS Vivobook 14 (FHD, 8 Go, 512 Go SSD)\n- Sac à dos pour laptop\n- Souris sans fil rechargeable\n- Clé USB 128 Go\n- Garantie 6 mois",
    price: 360000,
    promoPrice: 335000,
    stock: 3,
    categoryId: "ordinateurs-neufs",
    image: `${P}pack_ordinateur_portable_asus_14_sac_souris_cl_usb.jpg`,
  },
  {
    name: "Pack Dell 15 Pro Essential + sac + souris + clé USB 128 Go",
    reference: "GLT-032",
    description:
      "Pack Dell complet en promotion.\n\nContenu :\n- Dell Pro 15 Essential (15,6\" FHD)\n- Sac à dos\n- Souris sans fil\n- Clé USB 128 Go\n- Garantie 6 mois",
    price: 480000,
    promoPrice: 445000,
    stock: 2,
    categoryId: "ordinateurs-neufs",
    image: `${P}pack_ordinateur_portable_dell_sac_souris_cl_usb.jpg`,
  },
  {
    name: "Pack Lenovo LOQ 15IRX9 Gaming — 15,6\"",
    reference: "GLT-033",
    description:
      "Pack gaming Lenovo LOQ.\n\nContenu :\n- Lenovo LOQ 15IRX9 (RTX, 16 Go, 512 Go)\n- Accessoires gaming inclus\n- Garantie 6 mois",
    price: 830000,
    promoPrice: 790000,
    stock: 2,
    categoryId: "ordinateurs-neufs",
    image: `${P}pack_ordinateur_portable_gaming_-_lenovo.jpg`,
  },
  {
    name: "Support pliable pour laptop et tablette — universel",
    reference: "GLT-034",
    description:
      "Support ergonomique pliable, livré avec pochette.\n\nCaractéristiques :\n- Compatible laptops et tablettes\n- Pliable, transportable\n- Améliore la posture et le refroidissement\n- Pochette de transport incluse\n- Garantie 6 mois",
    price: 15000,
    stock: 20,
    categoryId: "accessoires-informatique",
    image: `${P}support_pliable_pour_laptop_et_tablette_5_.jpg`,
  },
];
