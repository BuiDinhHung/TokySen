"use client";
/* eslint-disable @next/next/no-img-element -- native images used for art-directed sizing */

import { ChevronDown, ChevronLeft, ChevronRight, Clock, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── types ───────────────────────────────────────────────────────────────────

interface PriceOption {
  label: string;
  price: string;
}

interface MenuItem {
  id?: string;
  name: string;
  description?: string;
  allergens?: string;
  price?: string;
  options?: PriceOption[];
  note?: string;
}

interface MenuSubSection {
  title: string;
  sectionNote?: string;
  items: MenuItem[];
}

// ─── menu data ────────────────────────────────────────────────────────────────

const MAIN_OPTIONS: PriceOption[] = [
  { label: "Tofu (A)", price: "10,90 €" },
  { label: "Hähnchen (B)", price: "11,90 €" },
  { label: "Rindfleisch (C)", price: "12,90 €" },
  { label: "Garnelen (D)", price: "12,90 €" },
  { label: "Geb. Hähnchen (E)", price: "12,90 €" },
  { label: "Geb. Ente (F)", price: "13,90 €" },
  { label: "Lachs (G)", price: "13,90 €" },
];

const VORSPEISEN_SECTIONS: MenuSubSection[] = [
  {
    title: "Suppen",
    items: [
      {
        id: "1", name: "Tom Kha", allergens: "A, D, F, G",
        description: "Kokossuppe nach thailändischer Art mit Champignons und Cherrytomaten, verfeinert mit Koriander.",
        options: [
          { label: "Tofu (A)", price: "4,50 €" },
          { label: "Hähnchen (B)", price: "4,90 €" },
          { label: "Garnelen (D)", price: "5,50 €" },
        ],
      },
      {
        id: "2", name: "Tom Yam", allergens: "A, D, F",
        description: "Scharf-saure Suppe nach thailändischer Art mit Champignons und Cherrytomaten, verfeinert mit Koriander.",
        options: [
          { label: "Tofu (A)", price: "4,50 €" },
          { label: "Hähnchen (B)", price: "4,90 €" },
          { label: "Garnelen (D)", price: "5,50 €" },
        ],
      },
      {
        id: "3", name: "Sauer-Scharf Suppe", allergens: "A, D, F, C",
        description: "Hausgemachte Suppe mit Gemüse.",
        price: "4,50 €",
      },
      {
        id: "4", name: "Miso Suppe", allergens: "F",
        description: "Japanische Suppe aus fermentierter Sojabohnenpaste mit Seetang und Lachs, verfeinert mit Frühlingszwiebeln.",
        price: "4,90 €",
      },
      {
        id: "5", name: "Wan Tan Suppe", allergens: "A, C, D, F",
        description: "Klare Brühe mit hausgemachten Teigtaschen, gefüllt mit Hähnchen und Garnelen.",
        price: "5,90 €",
      },
    ],
  },
  {
    title: "Salate",
    items: [
      {
        id: "6", name: "Mango Salat", allergens: "A, D, E, F",
        description: "Salat mit Mango, Kräutern und hausgemachtem Dressing.",
        options: [
          { label: "Tofu (A)", price: "5,50 €" },
          { label: "Hähnchen (B)", price: "5,50 €" },
          { label: "Garnelen (D)", price: "5,90 €" },
        ],
      },
      {
        id: "7", name: "Avocado Salat", allergens: "A, D, E, F, K",
        description: "Salat mit Avocado, Kräutern und hausgemachtem Dressing.",
        options: [
          { label: "Tofu (A)", price: "5,50 €" },
          { label: "Hähnchen (B)", price: "5,50 €" },
          { label: "Garnelen (D)", price: "5,90 €" },
        ],
      },
      {
        id: "8", name: "Glasnudelsalat", allergens: "A, D, E, F, K",
        description: "Salat mit Glasnudeln, Kräutern und hausgemachtem Dressing.",
        options: [
          { label: "Tofu (A)", price: "5,50 €" },
          { label: "Hähnchen (B)", price: "5,90 €" },
          { label: "Garnelen (D)", price: "6,50 €" },
        ],
      },
      {
        id: "9", name: "Wakame Salat", allergens: "K",
        description: "Marinierter Seetang, verfeinert mit Sesam.",
        price: "4,90 €",
      },
    ],
  },
  {
    title: "Kleine Gerichte",
    items: [
      { id: "10", name: "Edamame", allergens: "F", description: "Gekochte und leicht gesalzene Sojabohnen.", price: "4,90 €" },
      {
        id: "11", name: "Sommerrollen", allergens: "D, E, K", note: "2 Stück",
        description: "Kalte Reispapierrollen mit Salat und Reisnudeln, serviert mit Erdnuss-Soße.",
        options: [
          { label: "Tofu (A)", price: "4,90 €" },
          { label: "Hähnchen (B)", price: "4,90 €" },
          { label: "Garnelen (D)", price: "5,50 €" },
        ],
      },
      { id: "12", name: "Mini Frühlingsrollen", allergens: "A", note: "7 Stück", description: "Knusprig frittierte Frühlingsrollen mit Gemüse, serviert mit süß-sauer Soße.", price: "4,50 €" },
      { id: "13", name: "Dim Sum", allergens: "A, B, K", note: "4 Stück", description: "Gedämpfte Teigtaschen mit Garnelenfüllung.", price: "4,90 €" },
      { id: "14", name: "Gyoza", allergens: "A, F, K", note: "5 Stück", description: "Gebratene Teigtaschen mit Hähnchenfüllung.", price: "4,90 €" },
      { id: "15", name: "Yakitori", allergens: "A, F, K", note: "3 Stück", description: "Gegrillte Hähnchenspieße, mit Sesam verfeinert, serviert mit Yakitori-Soße.", price: "5,50 €" },
      { id: "16", name: "Ebi Tempura", allergens: "A, B, C", note: "3 Stück", description: "Tigergarnelen in einem leichten, knusprig frittierten Teigmantel nach japanischer Art.", price: "5,90 €" },
      { id: "17", name: "Tôm Cốm", allergens: "B, C", note: "3 Stück", description: "Tigergarnelen in knuspriger Panade aus grünem Reis.", price: "5,90 €" },
    ],
  },
];

const HAUPTGERICHTE_SECTIONS: MenuSubSection[] = [
  {
    title: "Nudelgerichte",
    items: [
      { id: "20", name: "Bún Trộn", allergens: "A, D, E, K", description: "Reisnudeln mit Salat und Limettendressing, verfeinert mit Erdnüssen und Röstzwiebeln.", options: MAIN_OPTIONS },
      { id: "21", name: "Udon Trộn", allergens: "A, D, E, F, K", description: "Dicke japanische Weizennudeln mit Gemüse und hausgemachter Teriyaki Soße, verfeinert mit Erdnüssen und Röstzwiebeln.", options: MAIN_OPTIONS },
      { id: "22", name: "Sesamy", allergens: "A, D, E, F, K", description: "Dicke japanische Weizennudeln mit Gemüse und cremiger Sesam-Chili-Soße, verfeinert mit Erdnüssen und Röstzwiebeln.", options: MAIN_OPTIONS },
      {
        id: "23", name: "Phở", allergens: "D",
        description: "Vietnamesische Reisbandnudelsuppe mit aromatischer Brühe und Sojasprossen, verfeinert mit Koriander und Frühlingszwiebeln.",
        options: [
          { label: "Tofu (A)", price: "11,50 €" },
          { label: "Hähnchen (B)", price: "11,90 €" },
          { label: "Rindfleisch (C)", price: "12,90 €" },
        ],
      },
    ],
  },
  {
    title: "Reisgerichte",
    items: [
      { id: "25", name: "Rotes Curry", allergens: "D, G, E", description: "Kokos-Curry mit Gemüse, leicht scharf, serviert mit Jasminreis.", options: MAIN_OPTIONS },
      { id: "26", name: "Mango Curry", allergens: "D, G, E", description: "Fruchtiges Curry mit Mango, Gemüse und Kokosmilch, serviert mit Jasminreis.", options: MAIN_OPTIONS },
      { id: "27", name: "Erdnuss-Soße", allergens: "D, G, E", description: "Cremige Erdnuss-Soße mit Kokosmilch und Gemüse, serviert mit Jasminreis.", options: MAIN_OPTIONS },
      { id: "28", name: "Toky Bowl", allergens: "A, C, E, F, K", description: "Bowl mit Avocado, Gurke und Salat, serviert mit Jasminreis.", options: MAIN_OPTIONS },
      {
        id: "29", name: "Tokysen Spezial", allergens: "A, F, K",
        description: "Gebratenes Gemüse in Pfeffersoße, serviert mit Jasminreis.",
        options: [
          { label: "Hähnchenschenkel (B)", price: "14,50 €" },
          { label: "Rinderfilet (C)", price: "15,50 €" },
          { label: "Lachsfilet (G)", price: "15,50 €" },
        ],
      },
    ],
  },
  {
    title: "Wok-Gerichte",
    items: [
      { id: "30", name: "Sen Wok", allergens: "A, D, F, K", description: "Gebratenes Gemüse in hausgemachter Soße, serviert mit Jasminreis.", options: MAIN_OPTIONS },
      { id: "31", name: "Reis Wok", allergens: "A, C, D, F", description: "Gebratener Reis mit Gemüse und Ei, verfeinert mit Kräutern.", options: MAIN_OPTIONS },
      { id: "32", name: "Pho Wok", allergens: "A, C, D, E, F, K", description: "Gebratene Reisbandnudeln mit Gemüse und Ei, verfeinert mit Kräutern.", options: MAIN_OPTIONS },
      { id: "33", name: "Udon Wok", allergens: "A, D, E, F, K", description: "Gebratene Udon-Nudeln mit Gemüse und hausgemachter Soße.", options: MAIN_OPTIONS },
      { id: "34", name: "Eiernudel Wok", allergens: "A, C, D, E, F, K", description: "Gebratene Eiernudeln mit Gemüse und Ei, verfeinert mit Kräutern.", options: MAIN_OPTIONS },
    ],
  },
];

const SUSHI_SECTIONS: MenuSubSection[] = [
  {
    title: "Nigiri",
    sectionNote: "2 Stück – Handgeformter Sushi-Reis, belegt mit einer ausgewählten Zutat",
    items: [
      { id: "N1", name: "Avocado Nigiri", description: "Avocado", price: "3,90 €" },
      { id: "N2", name: "Inari Nigiri", allergens: "1, A, F", description: "Süßlich marinierte Tofutasche", price: "3,90 €" },
      { id: "N3", name: "Tamago Nigiri", allergens: "C", description: "Japanisches Omelett", price: "3,90 €" },
      { id: "N4", name: "Ebi Nigiri", allergens: "B", description: "Großgarnelen", price: "4,50 €" },
      { id: "N5", name: "Sake Nigiri", allergens: "D", description: "Lachs (opt. flambiert)", price: "4,50 €" },
      { id: "N6", name: "Maguro Nigiri", allergens: "D", description: "Thunfisch (opt. flambiert)", price: "4,90 €" },
      { id: "N7", name: "Spicy Tuna Nigiri", allergens: "A, D, F", description: "Thunfisch Tatar · scharfe Soße", price: "4,90 €" },
      { id: "N8", name: "Unagi Nigiri", allergens: "A, D, F", description: "Gegrillter Süßwasseraal · würzige Soße", price: "5,50 €" },
      { id: "N9", name: "Ikura Nigiri", allergens: "D", description: "Lachskaviar", price: "5,50 €" },
      { id: "N10", name: "Hotategai Nigiri", allergens: "N", description: "Flambierte Jakobsmuschel", price: "5,50 €" },
    ],
  },
  {
    title: "Maki",
    sectionNote: "8 Stück – Sushi-Rolle mit Reis und Nori umwickelt",
    items: [
      { id: "M1", name: "Avocado Maki", description: "Avocado", price: "4,50 €" },
      { id: "M2", name: "Kappa Maki", allergens: "K", description: "Gurke", price: "4,50 €" },
      { id: "M3", name: "Spargel Maki", allergens: "K", description: "Spargel", price: "4,50 €" },
      { id: "M4", name: "Oshinko Maki", allergens: "1, 4, 6, F, K", description: "Eingelegter Rettich", price: "4,50 €" },
      { id: "M5", name: "Inari Maki", allergens: "1, A, F, K", description: "Süßlich marinierte Tofutasche", price: "4,50 €" },
      { id: "M6", name: "Tamago Maki", allergens: "C", description: "Japanisches Omelett", price: "4,50 €" },
      { id: "M7", name: "Ebi Maki", allergens: "B", description: "Großgarnelen", price: "4,90 €" },
      { id: "M8", name: "Sake Maki", allergens: "D", description: "Lachs", price: "4,90 €" },
      { id: "M9", name: "Sake Avocado Maki", allergens: "D", description: "Lachs · Avocado", price: "4,90 €" },
      { id: "M10", name: "Tekka Maki", allergens: "D", description: "Thunfisch", price: "5,50 €" },
      { id: "M11", name: "Tekka Avocado Maki", allergens: "D", description: "Thunfisch · Avocado", price: "5,50 €" },
      { id: "M12", name: "Tuna Maki (gegart)", allergens: "C, D, K", description: "Gegarter Thunfisch · Lauch · japanische Mayonnaise", price: "4,90 €" },
      { id: "M13", name: "Unagi Kappa Maki", allergens: "A, D, F", description: "Süßwasseraal · Gurke", price: "5,50 €" },
      { id: "M14", name: "California Maki", allergens: "1, 2, 4, 5, D, A, C, F, K", description: "Surimi · Avocado · Gurke", price: "4,90 €" },
    ],
  },
  {
    title: "Inside-Out Rolls",
    sectionNote: "8 Stück – Sushi-Rolle mit Reis außen und Sesam",
    items: [
      { id: "S1", name: "California Inside-Out Roll", allergens: "1, 2, 4, 5, A, B, C, D, F, K", description: "Surimi · Avocado · japanische Mayonnaise", price: "7,90 €" },
      { id: "S2", name: "Ebi Inside-Out Roll", allergens: "B, K", description: "Großgarnelen · Gurke · Avocado", price: "8,50 €" },
      { id: "S3", name: "Unagi Inside-Out Roll", allergens: "A, D, F, K", description: "Gegrillter Süßwasseraal · Gurke · Avocado", price: "8,90 €" },
      { id: "S4", name: "Salmon Inside-Out Roll", allergens: "D, G, K", description: "Lachs · Avocado · Frischkäse", price: "8,50 €" },
      { id: "S5", name: "Gegartes Salmon Inside-Out Roll", allergens: "D, G, K", description: "Gegarter Lachs · Avocado · Frischkäse", price: "7,90 €" },
      { id: "S6", name: "Spicy Salmon Inside-Out Roll", allergens: "D, K", description: "Lachs · Gurke · scharfe Soße", price: "8,50 €" },
      { id: "S7", name: "Rucola Salmon Inside-Out Roll", allergens: "D, G, K", description: "Rucola · Lachs · Frischkäse", price: "8,50 €" },
      { id: "S8", name: "Tuna Inside-Out Roll", allergens: "D, K", description: "Thunfisch · Avocado", price: "8,90 €" },
      { id: "S9", name: "Gegartes Tuna Inside-Out Roll", allergens: "C, D, K", description: "Gegarter Thunfisch · Avocado · japanische Mayonnaise", price: "7,90 €" },
      { id: "S10", name: "Spicy Tuna Inside-Out Roll", allergens: "D, K", description: "Thunfisch Tatar · Lauchzwiebeln · Gurke · scharfe Soße", price: "8,90 €" },
    ],
  },
  {
    title: "Vegetarische Inside-Out Rolls",
    sectionNote: "8 Stück",
    items: [
      { id: "S15", name: "Avocado Inside-Out Roll", allergens: "G, K", description: "Avocado · Gurke · Frischkäse", price: "6,90 €" },
      { id: "S16", name: "Rucola Inside-Out Roll", allergens: "G, K", description: "Rucola · Gurke · Frischkäse", price: "6,90 €" },
      { id: "S17", name: "Spargel Inside-Out Roll", allergens: "G, K", description: "Spargel · Gurke · Frischkäse", price: "6,90 €" },
      { id: "S18", name: "Tamago Inside-Out Roll", allergens: "C, K", description: "Japanisches Omelett · Avocado · Gurke", price: "6,90 €" },
    ],
  },
  {
    title: "Temaki",
    sectionNote: "1 Stück – Nori-Blatt Tüte mit Sushi-Reis, Zutat und Sesam",
    items: [
      { id: "S20", name: "Ebi Temaki", allergens: "B, K", description: "Großgarnelen · Avocado", price: "4,90 €" },
      { id: "S21", name: "Salmon Temaki", allergens: "D, K", description: "Lachs · Avocado · Flugfischrogen", price: "4,90 €" },
      { id: "S22", name: "Tuna Temaki", allergens: "D, K", description: "Thunfisch · Avocado · Flugfischrogen", price: "5,50 €" },
    ],
  },
  {
    title: "Tokysen Spezial Rolls",
    sectionNote: "8 Stück – Auf Wunsch flambiert",
    items: [
      { id: "S30", name: "Green Roll", allergens: "G, K", description: "Rucola · Gurke · Frischkäse | umhüllt mit Avocado", price: "9,90 €" },
      { id: "S31", name: "Golden Roll", allergens: "D, G, K", description: "Avocado · Gurke · Rucola · Frischkäse | umhüllt mit Lachs", price: "10,90 €" },
      { id: "S32", name: "Red Tuna Roll", allergens: "D, G, K", description: "Spargel · Gurke · Frischkäse | umhüllt mit Thunfisch · Koriandersalat", price: "10,90 €" },
      { id: "S33", name: "Yakitori Roll", allergens: "A, F, K", description: "Japanischer Hähnchenspieß · Gurke | umhüllt mit Avocado", price: "10,90 €" },
      { id: "S34", name: "Black Tiger Roll", allergens: "B, D, G, K", description: "Knusprig frittierte Großgarnelen · Frischkäse | umhüllt mit Süßwasseraal", price: "11,90 €" },
      { id: "S35", name: "Lachs Tempura Roll", allergens: "B, D, G, K", description: "Knusprig frittierter Lachs · Frischkäse | umhüllt mit Großgarnele", price: "10,90 €" },
      { id: "S36", name: "Beef Sweet Potato Roll", allergens: "A, F, K", description: "Süßkartoffel · Avocado | umhüllt mit Rindfleisch · Koriandersalat", price: "11,90 €" },
      { id: "S37a", name: "Rainbow Roll", allergens: "1, 2, 4, 5, A, B, C, D, F, K", description: "Surimi · Gurke · Avocado | umhüllt mit Lachs · Thunfisch · Avocado", price: "11,90 €" },
      { id: "S37b", name: "My Best Roll", allergens: "D, G, K", description: "Lachs · Avocado · Frischkäse | umhüllt mit Lachs · Thunfisch · Großgarnelen", price: "11,90 €" },
    ],
  },
  {
    title: "Big Crispy Rolls",
    sectionNote: "8 Stück – Große Sushi-Rolle, paniert und knusprig frittiert",
    items: [
      { id: "S40", name: "Crispy Veggie Roll", allergens: "1, 3, 4, 6, A, C, F, K", description: "Gurke · Avocado · eingelegter Rettich · Japanisches Omelett", price: "8,00 €" },
      { id: "S41", name: "Crispy Salmon Roll", allergens: "1, 2, 4, 5, D, A, C, F, G, K", description: "Lachs · Surimi · Avocado · Gurke · Frischkäse", price: "8,50 €" },
      { id: "S42", name: "Crispy Tuna Roll", allergens: "A, C, F, G, K", description: "Gegarter Thunfisch · Gurke · Frischkäse · Lauchzwiebeln", price: "8,50 €" },
      { id: "S43", name: "Crispy Chicken Roll", allergens: "A, C, F, K", description: "Hühnchen Tempura · Gurke · Lauchzwiebeln", price: "8,90 €" },
      { id: "S44", name: "Crispy Duck Roll", allergens: "A, C, F, K", description: "Enten Tempura · Gurke · Lauchzwiebeln", price: "8,90 €" },
      { id: "S45", name: "Mini Crispy Roll", allergens: "A, C, F, K", note: "8 Stück", description: "Maki-Rolle, paniert und knusprig frittiert, verfeinert mit Sesam, Unagi- und Cocktailsoße.", price: "5,50 €" },
    ],
  },
  {
    title: "Sashimi",
    sectionNote: "Biofrisches Fischfilet, pur serviert",
    items: [
      { id: "S50", name: "Sake Sashimi", allergens: "D", note: "8 Stück", description: "Frisches Lachsfilet, pur serviert", price: "11,90 €" },
      { id: "S51", name: "Tuna Sashimi", allergens: "D", note: "8 Stück", description: "Frisches Thunfischfilet, pur serviert", price: "13,90 €" },
      { id: "S52", name: "Sake & Tuna Sashimi", allergens: "D", note: "8 Stück", description: "Lachs · Thunfisch, frisch und pur serviert", price: "12,90 €" },
      { id: "S53", name: "Mix Sashimi", allergens: "D, B", note: "8 Stück", description: "Lachs · Thunfisch · Großgarnelen, frisch und pur serviert", price: "13,90 €" },
      { id: "S54", name: "Aburi Sashimi", allergens: "D", note: "9 Stück", description: "Flambierter Lachs · Flambierter Thunfisch, leicht angeflammt und aromatisch serviert", price: "14,90 €" },
    ],
  },
  {
    title: "Sushi Sets",
    items: [
      { name: "I Love Veggie", allergens: "A, C, F, K", description: "8 Avocado Maki · 8 Kappa Maki · 4 Veggie Crispy Big Roll", price: "11,90 €" },
      { name: "I Love Maki", allergens: "B, D", description: "8 Avocado Maki · 8 Ebi Maki · 8 Sake Maki", price: "11,90 €" },
      { name: "I Love Salmon", allergens: "D, G, K", description: "2 Sake Nigiri · 8 Sake Maki · 8 Salmon Inside-Out", price: "14,90 €" },
      { name: "Spring Set", allergens: "B, D, G, K", description: "1 Ebi Nigiri · 1 Sake Nigiri · 1 Maguro Nigiri · 4 Avocado Maki · 4 Kappa Maki · 4 Salmon Inside-Out", price: "12,90 €" },
      { name: "Salmon Set (gekocht)", allergens: "A, C, D, G, F, K", description: "8 Sake Maki · 8 Salmon Inside-Out · 8 Crispy Salmon Roll", price: "14,90 €" },
      { name: "Tuna Set (gekocht)", allergens: "A, C, D, G, F, K", description: "8 Tuna Maki · 8 Tuna Inside-Out · 8 Crispy Tuna Roll", price: "14,90 €" },
      { name: "Kizuna Set", allergens: "A, C, F, K", note: "für 2 Personen", description: "8 Avocado Maki · 8 Sake Maki · 2 Ebi Nigiri · 2 Sake Nigiri · 2 Maguro Nigiri · 8 Black Tiger Roll · 8 Crispy Chicken Roll", price: "34,90 €" },
      { name: "Tomodachi Set", allergens: "A, C, D, F, G, K", note: "für 3 Personen", description: "1 Tamago Nigiri · 1 Ebi Nigiri · 1 Sake Nigiri · 1 Maguro Nigiri · 4 Avocado Maki · 4 Kappa Maki · 4 Sake Maki · 4 Tekka Maki · 4 Avocado Inside-Out · 4 Salmon Inside-Out · 8 My Best Roll · 16 Crispy Veggie Roll · 16 Crispy Salmon Roll", price: "49,90 €" },
      { name: "Kazoku Set", allergens: "A, C, D, F, G, K", note: "für 4 Personen", description: "8 Avocado Maki · 8 Kappa Maki · 8 Sake Maki · 8 Tekka Maki · 2 Ebi Nigiri · 2 Sake Nigiri · 2 Maguro Nigiri · 8 Salmon Inside-Out · 8 Rainbow Roll · 8 Crispy Chicken Roll · 8 Crispy Duck Roll · 8 Sake Sashimi", price: "64,90 €" },
    ],
  },
];

const DESSERT_SECTIONS: MenuSubSection[] = [
  {
    title: "Desserts",
    items: [
      { id: "D1", name: "Chuối Chiên", allergens: "A, K", description: "Frittierte Banane im knusprigen Teigmantel, verfeinert mit Honig und Sesam.", price: "4,00 €" },
      { id: "D2", name: "Mochi", description: "Japanischer Klebreiskuchen mit weicher Füllung.", price: "4,50 €" },
      { id: "D3", name: "Matcha Eis", allergens: "C, G", description: "Japanisches Grüntee-Eis.", price: "4,50 €" },
      { id: "D4", name: "Lava Cake", allergens: "A, C, F, G", description: "Warmer Schokoladenkuchen mit flüssigem Schokoladenkern.", price: "4,50 €" },
      { id: "D5", name: "Bánh Chuối", allergens: "E, K", description: "Gedämpfter vietnamesischer Bananen-Klebreiskuchen mit Kokosmilch, garniert mit Sesam und Erdnüssen.", price: "4,50 €" },
      { id: "D6", name: "Xôi Xoài", allergens: "E, K", description: "Vietnamesischer Klebreis mit frischer Mango, Kokosmilch, garniert mit Sesam und Erdnüssen.", price: "5,00 €" },
    ],
  },
  {
    title: "Beilagen",
    items: [
      { name: "Jasminreis", price: "2,00 €" },
      { name: "Sushi-Reis", price: "2,00 €" },
      { name: "Bún (Reisnudeln)", price: "2,00 €" },
      { name: "Phở (Reisbandnudeln)", price: "2,00 €" },
      { name: "Udon (Weizennudeln)", price: "2,00 €" },
      { name: "Gemüse", price: "2,00 €" },
      { name: "Tofu", price: "2,00 €" },
      { name: "Hähnchen", price: "3,00 €" },
      { name: "Rindfleisch", price: "4,00 €" },
      { name: "Garnelen", price: "4,00 €" },
      { name: "Gebackenes Hähnchen", price: "4,00 €" },
      { name: "Gebackene Ente", price: "5,00 €" },
      { name: "Lachs", price: "6,00 €" },
    ],
  },
];

const GETRAENKE_SECTIONS: MenuSubSection[] = [
  {
    title: "Softdrinks",
    items: [
      { name: "Cola", allergens: "1, 4, 7", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Cola Zero", allergens: "1, 4, 6, 7, 10", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Fanta", allergens: "1, 4", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Sprite", allergens: "1", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Ginger Ale", allergens: "1, 4", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Bitter Lemon", allergens: "8", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Tonic Water", allergens: "8", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Stilles Wasser", price: "0,30 l – 2,90 € | 0,75 l – 5,90 €" },
      { name: "Sprudelwasser", price: "0,30 l – 2,90 € | 0,75 l – 5,90 €" },
    ],
  },
  {
    title: "Säfte & Schorlen",
    items: [
      { name: "Apfel", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Orange", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Rhabarber", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Ananas", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Mango", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Maracuja", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
      { name: "Litschi", price: "0,25 l – 2,90 € | 0,40 l – 4,50 €" },
    ],
  },
  {
    title: "Kaffee",
    items: [
      { name: "Cà phê phin", description: "Vietnamesischer Filterkaffee mit Kondensmilch", price: "4,90 €" },
      { name: "Cà phê sữa đá", description: "Vietnamesischer Eiskaffee mit Kondensmilch und Eis", price: "5,50 €" },
    ],
  },
  {
    title: "Tees",
    items: [
      { name: "Jasmintee", price: "3,50 €" },
      { name: "Grüntee", price: "3,50 €" },
      { name: "Ginger Zest", description: "Ingwer · Kumquat · Limette · Minze · Honig", price: "4,50 €" },
      { name: "Amber Spice", description: "Ingwer · Orange · Zimt · Minze · Honig", price: "4,50 €" },
      { name: "Golden Elixir", description: "Ingwer · Kumquat · Jujube · Zimt · Minze · Honig", price: "5,00 €" },
    ],
  },
  {
    title: "Hausgemachte Getränke",
    items: [
      { name: "Blossom Fizz", allergens: "1", description: "Holunderblüte · Minze", price: "4,50 €" },
      { name: "Ginger Sparkle", description: "Ingwer · Zitronengras", price: "4,50 €" },
      { name: "Lychee Pop", allergens: "1", description: "Lychee · Limette", price: "4,90 €" },
      { name: "Blush Spritz", description: "Rhabarber · Pfirsich", price: "4,90 €" },
      { name: "Fresh Drop", description: "Limette · Kumquat · Minze", price: "5,50 €" },
      { name: "Spicy Rush", allergens: "1, 4", description: "Ingwer · Limette · Minze", price: "5,50 €" },
      { name: "Golden Glam", allergens: "1, 4", description: "Holunderblüte · Ingwer", price: "5,50 €" },
      { name: "Tropical Coco", allergens: "1", description: "Lychee · Maracuja · Kokos", price: "5,50 €" },
      { name: "Vanilla Passion", allergens: "1", description: "Mango · Maracuja · Vanille", price: "5,50 €" },
      { name: "Butterfly Breeze", description: "Maracuja · Limette · Schmetterlingserbsenblume", price: "5,50 €" },
    ],
  },
  {
    title: "Lassi",
    sectionNote: "Cremiger Joghurt-Drink aus frischen Früchten",
    items: [
      { name: "Mango Lassi", allergens: "G", price: "4,90 €" },
      { name: "Banana Lassi", allergens: "G", price: "4,90 €" },
      { name: "Avocado Lassi", allergens: "G", price: "4,90 €" },
      { name: "Mango-Banana Lassi", allergens: "G", price: "4,90 €" },
    ],
  },
  {
    title: "Cocktails",
    items: [
      { name: "Mojito", description: "Weißer Rum · Minze · Limette · brauner Zucker · Soda", price: "6,90 €" },
      { name: "Rum Tonic", allergens: "8", description: "Weißer Rum · Tonic Water", price: "6,90 €" },
      { name: "Island Flow", description: "Weißer Rum · Maracuja · Orange · Ananas", price: "6,90 €" },
      { name: "Double Passion", description: "Brauner Rum · Weißer Rum · Zuckersirup · Zitrone · Maracuja", price: "6,90 €" },
      { name: "Almond Sunset", allergens: "H, 1", description: "Havana Club · Orange · Maracuja · Limette · Mandelsirup", price: "6,90 €" },
    ],
  },
  {
    title: "Biere",
    items: [
      { name: "Asahi", allergens: "A", description: "Flasche 0,33 l", price: "4,50 €" },
      { name: "Kirin", allergens: "A", description: "Flasche 0,33 l", price: "4,50 €" },
      { name: "Saigon", allergens: "A", description: "Flasche 0,33 l", price: "4,50 €" },
      { name: "Warsteiner (vom Fass)", allergens: "A", price: "0,33 l – 3,90 € | 0,50 l – 4,90 €" },
      { name: "Warsteiner alkoholfrei", allergens: "A", price: "0,33 l – 3,90 € | 0,50 l – 4,90 €" },
      { name: "Erdinger alkoholfrei", allergens: "A", description: "Flasche 0,50 l", price: "4,90 €" },
      { name: "Erdinger Dunkel", allergens: "A", description: "Flasche 0,50 l", price: "4,90 €" },
      { name: "Erdinger Kristall", allergens: "A", description: "Flasche 0,50 l", price: "4,90 €" },
      { name: "Erdinger Weißbier", allergens: "A", description: "Flasche 0,50 l", price: "4,90 €" },
    ],
  },
  {
    title: "Aperitifs",
    items: [
      { name: "Prosecco", allergens: "O", price: "0,10 l – 4,50 €" },
      { name: "Hugo", allergens: "O, 1", description: "Prosecco · Holunderblüte · Minze", price: "6,90 €" },
      { name: "Aperol Spritz", allergens: "O, 1, 4", description: "Aperol · Prosecco · Soda", price: "6,90 €" },
      { name: "Mango Spritz", allergens: "O", description: "Prosecco · Mango", price: "6,90 €" },
      { name: "Rum Tonic", allergens: "8", price: "6,90 €" },
      { name: "Gin Tonic", allergens: "8", price: "6,90 €" },
      { name: "Campari", allergens: "1, 4", price: "4 cl – 4,50 €" },
      { name: "Campari Orange", allergens: "1, 4", price: "6,90 €" },
      { name: "Gin", price: "4 cl – 4,50 €" },
      { name: "Rum", price: "4 cl – 4,50 €" },
    ],
  },
  {
    title: "Weißweine",
    items: [
      { name: "Riesling", allergens: "O", price: "0,10 l – 3,90 € | 0,20 l – 5,90 € | 0,50 l – 14,90 €" },
      { name: "Weißburgunder", allergens: "O", price: "0,10 l – 3,90 € | 0,20 l – 5,90 € | 0,50 l – 14,90 €" },
      { name: "Sauvignon Blanc", allergens: "O", price: "0,10 l – 3,90 € | 0,20 l – 5,90 € | 0,50 l – 14,90 €" },
      { name: "Chardonnay", allergens: "O", price: "0,10 l – 3,90 € | 0,20 l – 5,90 € | 0,50 l – 14,90 €" },
    ],
  },
  {
    title: "Rotweine",
    items: [
      { name: "Cabernet Sauvignon", allergens: "O", price: "0,10 l – 3,90 € | 0,20 l – 5,90 € | 0,50 l – 14,90 €" },
      { name: "Merlot", allergens: "O", price: "0,10 l – 3,90 € | 0,20 l – 5,90 € | 0,50 l – 14,90 €" },
    ],
  },
];

// ─── static data ──────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Speisekarte", href: "#speisekarte" },
  { label: "Über uns", href: "#ueber-uns" },
  { label: "Öffnungszeiten", href: "#kontakt" },
  { label: "Kontakt", href: "#kontakt" },
];

const FOOTER_NAV = ["Speisekarte", "Über uns", "Öffnungszeiten", "Kontakt", "Impressum", "Datenschutz"];

const MENU_TABS = [
  { id: "vorspeisen", label: "Vorspeisen", sections: VORSPEISEN_SECTIONS },
  { id: "hauptgerichte", label: "Hauptgerichte", sections: HAUPTGERICHTE_SECTIONS },
  { id: "sushi", label: "Sushi", sections: SUSHI_SECTIONS },
  { id: "desserts", label: "Desserts", sections: DESSERT_SECTIONS },
  { id: "getraenke", label: "Getränke", sections: GETRAENKE_SECTIONS },
];

const FOOD_IMAGES = [
  { src: "/images/món ăn thực tế 1.png",  alt: "Hausgemachtes Sushi – TokySen",    pos: "center 32%" },
  { src: "/images/món ăn thực tế 2.png",  alt: "Asiatisches Gericht – TokySen",    pos: "center 42%" },
  { src: "/images/món ăn thực tế 3.png",  alt: "Frische Zutaten – TokySen",        pos: "center 44%" },
  { src: "/images/món ăn thực tế 4.png",  alt: "Wok-Gericht – TokySen",            pos: "center 44%" },
  { src: "/images/món ăn thực tế 5.png",  alt: "Sushi Auswahl – TokySen",          pos: "center 42%" },
  { src: "/images/món ăn thực tế 6.png",  alt: "Vietnamesische Küche – TokySen",   pos: "center 42%" },
  { src: "/images/món ăn thực tế 7.png",  alt: "Japanische Spezialität – TokySen", pos: "center 44%" },
  { src: "/images/món ăn thực tế 8.png",  alt: "Frisches Gericht – TokySen",       pos: "center 44%" },
  { src: "/images/món ăn thực tế 9.png",  alt: "Spezialrolle – TokySen",           pos: "center 40%" },
  { src: "/images/món ăn thực tế 10.png", alt: "Asiatische Küche – TokySen",       pos: "center 38%" },
  ...Array.from({ length: 39 }, (_, i) => ({
    src: `/images/món ăn mới ${i + 1}.jpeg`,
    alt: "Gericht – TokySen",
    pos: "center 42%",
  })),
];

const INTERIOR_IMAGES = [
  { src: "/images/không gian trong quán 1.png", alt: "Gemütliche Atmosphäre im TokySen Restaurant" },
  { src: "/images/không gian trong quán.png",   alt: "Innenraum des TokySen Restaurants" },
  { src: "/images/không gian trong quán 2.png", alt: "Weiterer Innenbereich des TokySen Restaurants" },
  { src: "/images/mặt trước nhà hàng.png",       alt: "TokySen Restaurant – Außenansicht Hönower Str. 100" },
  ...Array.from({ length: 7 }, (_, i) => ({
    src: `/images/không gian mới ${i + 1}.jpeg`,
    alt: "Innenbereich des TokySen Restaurants",
  })),
];

// ─── crane decoration ─────────────────────────────────────────────────────────

function CraneIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 100 72" xmlns="http://www.w3.org/2000/svg">
      {/* left wing */}
      <polygon points="50,36 0,10 46,34" />
      <polygon points="50,36 0,52 44,38" />
      {/* right wing */}
      <polygon points="50,36 100,10 54,34" />
      <polygon points="50,36 100,52 56,38" />
      {/* neck + head */}
      <polygon points="50,34 46,12 56,6 58,16" />
      {/* tail */}
      <polygon points="50,38 45,66 55,66" />
    </svg>
  );
}

function CranesLayer() {
  return (
    <div aria-hidden="true" className="crane-layer">
      <div className="crane crane-1"><CraneIcon /></div>
      <div className="crane crane-2"><CraneIcon /></div>
      <div className="crane crane-3"><CraneIcon /></div>
      <div className="crane crane-4"><CraneIcon /></div>
      <div className="crane crane-5"><CraneIcon /></div>
    </div>
  );
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect height="18" rx="5" width="18" x="3" y="3" />
      <circle cx="12" cy="12" r="4.2" />
      <circle className="icon-fill" cx="17.4" cy="6.8" r="1" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        className="icon-fill"
        d="M14.2 22v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V4.5c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.3v2.3H8.3V14H11v8h3.2Z"
      />
    </svg>
  );
}

// ─── reusable components ──────────────────────────────────────────────────────

function ButtonLink({
  children,
  href = "#",
  dark = false,
}: {
  children: React.ReactNode;
  href?: string;
  dark?: boolean;
}) {
  return (
    <a className={`outline-button${dark ? " outline-button--dark" : ""}`} href={href}>
      {children}
    </a>
  );
}

function ExpandableText({
  children,
  more,
}: {
  children: React.ReactNode;
  more: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div className="copy">
        <p>{children}</p>
        <div className={`more-copy${expanded ? " more-copy--open" : ""}`}>
          <p>{more}</p>
        </div>
      </div>
      <button
        aria-expanded={expanded}
        className="read-more"
        onClick={() => setExpanded((v) => !v)}
        type="button"
      >
        {expanded ? "Weniger anzeigen" : "Mehr lesen"}
        <ChevronDown className={expanded ? "rotate" : ""} size={17} strokeWidth={2} />
      </button>
    </>
  );
}

/* Kibou-style food showcase: numbered pagination + expanding line + auto-play */
function FoodShowcase({ images }: { images: typeof FOOD_IMAGES }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCurrent((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [paused, images.length]);

  const goTo = (i: number) => { setCurrent(i); setPaused(true); };
  const goPrev = () => goTo((current - 1 + images.length) % images.length);
  const goNext = () => goTo((current + 1) % images.length);

  return (
    <section
      aria-label="Unsere Gerichte"
      className="food-showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <div className={`showcase-slide${i === current ? " is-active" : ""}`} key={img.src}>
          <div className="showcase-blur" style={{ backgroundImage: `url("${img.src}")` }} />
          <img alt={img.alt} src={img.src} style={{ objectPosition: img.pos }} />
        </div>
      ))}

      {/* Kibou-style numbered pagination – bottom-left */}
      <div className="showcase-pagination">
        {images.map((_, i) => (
          <button
            aria-label={`Bild ${i + 1}`}
            className={`showcase-page${i === current ? " is-active" : ""}`}
            key={i}
            onClick={() => goTo(i)}
            type="button"
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span className="showcase-page-line" />
          </button>
        ))}
      </div>

      {/* arrow buttons */}
      <button aria-label="Zurück" className="showcase-btn showcase-btn--prev" onClick={goPrev} type="button">
        <ChevronLeft size={20} />
      </button>
      <button aria-label="Weiter" className="showcase-btn showcase-btn--next" onClick={goNext} type="button">
        <ChevronRight size={20} />
      </button>

      {/* CTA – bottom-right */}
      <div className="showcase-cta">
        <ButtonLink href="#speisekarte">Speisekarte</ButtonLink>
        <ButtonLink href="#kontakt">Anfahrt</ButtonLink>
      </div>
    </section>
  );
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const fromPrice = item.options?.[0]?.price;
  return (
    <div className="menu-item">
      <div className="menu-item-header">
        {item.id && <span className="menu-item-id">{item.id}</span>}
        <span className="menu-item-name">
          {item.name}
          {item.note && <span className="menu-item-note"> ({item.note})</span>}
        </span>
        <span className="menu-item-price">
          {item.price ?? (fromPrice ? `ab ${fromPrice}` : "")}
        </span>
      </div>
      {item.description && <p className="menu-item-desc">{item.description}</p>}
      {item.allergens && <p className="menu-item-allergens">Allergene: {item.allergens}</p>}
      {item.options && (
        <div className="menu-item-options">
          {item.options.map((opt) => (
            <div className="menu-option" key={opt.label}>
              <span className="menu-option-label">{opt.label}</span>
              <span className="menu-option-price">{opt.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuTabContent({ sections }: { sections: MenuSubSection[] }) {
  return (
    <div className="menu-tab-content">
      {sections.map((section) => (
        <div className="menu-subsection" key={section.title}>
          <h4 className="menu-subsection-title">
            {section.title}
            {section.sectionNote && (
              <span className="menu-subsection-note"> — {section.sectionNote}</span>
            )}
          </h4>
          <div className="menu-grid">
            {section.items.map((item, i) => (
              <MenuItemCard item={item} key={item.id ?? `${section.title}-${i}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("vorspeisen");
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Kibou-style scroll-reveal: IntersectionObserver on .fade-in elements */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("item-reveal-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    const els = mainRef.current?.querySelectorAll(".fade-in") ?? [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeTabData = MENU_TABS.find((t) => t.id === activeTab);

  return (
    <main ref={mainRef}>
      {/* ── HEADER ── */}
      <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
        <a aria-label="TokySen Restaurant" className="header-logo" href="#top">
          <img alt="TokySen Restaurant Logo" src="/images/logo.png" />
        </a>

        <nav aria-label="Hauptnavigation" className="desktop-nav">
          {NAV_LINKS.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
          <a className="outline-button outline-button--dark" href="#kontakt">
            Reservieren
          </a>
        </nav>

        <a className="mobile-quick" href="#speisekarte">
          Speisekarte
        </a>

        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          className="menu-button"
          onClick={() => setMenuOpen((v) => !v)}
          type="button"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`mobile-drawer${menuOpen ? " mobile-drawer--open" : ""}`}>
          {NAV_LINKS.map((item) => (
            <a href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero" id="top">
        <video
          autoPlay
          className="hero-img"
          loop
          muted
          playsInline
          src="/videos/Ultra_cinematic_Japanese_cuisi (online-video-cutter.com).mp4"
        />
        <div className="hero-shade" />
        <CranesLayer />
        <div className="hero-content">
          <p className="hero-eyebrow">Berlin Mahlsdorf · Japanische &amp; Vietnamesische Küche</p>
          <p className="hero-title">TokySen</p>
<p className="hero-tagline">Tokyo trifft den Lotus</p>
          <a className="outline-button hero-cta" href="#kontakt">Tisch reservieren</a>
        </div>
        <div className="hero-scroll">
          <span>Entdecken</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* ── ANNOUNCEMENT ── */}
      <a className="announcement" href="#kontakt">
        <span>Täglich geöffnet</span> — Mo–Fr 11:00–22:00 Uhr · Sa, So &amp; Feiertage 11:30–22:00 Uhr
      </a>

      {/* ── PAPER SECTION ── */}
      <div className="paper">

        {/* ── WELCOME ── */}
        <section className="intro-section section-shell fade-in" id="ueber-uns">
          <h1>Herzlich willkommen bei Tokysen</h1>
          <ExpandableText
            more="Mit Tokysen möchten wir Ihnen in Mahlsdorf einen Ort bieten, an dem sorgfältig zubereitete Speisen auf eine warme und einladende Atmosphäre treffen. Als Familienunternehmen kochen wir seit über 30 Jahren mit Leidenschaft – besonders die Kunst des Sushi begleitet uns seit mehr als 20 Jahren. Ein Ort zum Ankommen, Genießen und Wohlfühlen."
          >
            Tokysen vereint Tokyo mit „Sen", der Lotusblume im Vietnamesischen – einem Symbol für
            Reinheit, Harmonie und Neubeginn. Aus dieser Verbindung entstand unsere Idee: asiatische
            Küche, die Tradition, Qualität und Gastfreundschaft miteinander vereint.
          </ExpandableText>
        </section>

        {/* ── FOOD SHOWCASE – Kibou numbered pagination ── */}
        <div className="showcase-wrapper">
          <FoodShowcase images={FOOD_IMAGES} />
        </div>

        {/* ── MENU ── */}
        <section className="menu-section fade-in" id="speisekarte">
          <div className="section-shell" style={{ paddingBottom: 0 }}>
            <h2>Unsere Speisekarte</h2>
          </div>

          <nav aria-label="Speisekarte Kategorien" className="menu-tabs-nav">
            {MENU_TABS.map((tab) => (
              <button
                className={`menu-tab-btn${activeTab === tab.id ? " menu-tab-btn--active" : ""}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTabData && <MenuTabContent sections={activeTabData.sections} />}

          <div className="allergen-legend menu-tab-content">
            <p>
              <strong>Hinweis zu Allergenen:</strong> Trotz größter Sorgfalt bei der Zubereitung
              können Kreuzkontaminationen nicht vollständig ausgeschlossen werden. Bitte informieren
              Sie uns über bestehende Allergien oder Unverträglichkeiten.
            </p>
            <div className="allergen-grid">
              <div>1 – Konservierungsstoffe</div>
              <div>2 – Geschmacksverstärker</div>
              <div>3 – Antioxidationsmittel</div>
              <div>4 – Farbstoff</div>
              <div>5 – Phosphat</div>
              <div>6 – Süßungsmittel</div>
              <div>7 – koffeinhaltig</div>
              <div>8 – chininhaltig</div>
              <div>A – Glutenhaltiges Getreide</div>
              <div>B – Krebstiere</div>
              <div>C – Eier</div>
              <div>D – Fisch</div>
              <div>E – Erdnüsse</div>
              <div>F – Soja</div>
              <div>G – Milch & Milchprodukte</div>
              <div>H – Schalenfrüchte</div>
              <div>K – Sesamsamen</div>
              <div>N – Weichtiere</div>
              <div>O – Sulfite</div>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="about section-shell fade-in" id="about">
          <h2>Über uns</h2>
          <ExpandableText
            more="Erfahrung, Handwerk und die Freude an gutem Essen stehen dabei im Mittelpunkt unseres täglichen Schaffens. Wir freuen uns, Sie bei Tokysen zu begrüßen und wünschen Ihnen eine genussvolle Zeit – ob vor Ort oder unterwegs."
          >
            Als Familienunternehmen kochen wir seit über 30 Jahren mit Leidenschaft. Besonders die
            Kunst des Sushi begleitet uns seit mehr als 20 Jahren und prägt unsere Küche bis heute.
            Mit Tokysen möchten wir Ihnen in Mahlsdorf einen Ort bieten, an dem sorgfältig
            zubereitete Speisen auf eine warme und einladende Atmosphäre treffen.
          </ExpandableText>
          <div className="section-cta">
            <ButtonLink href="#kontakt">Uns besuchen</ButtonLink>
          </div>
        </section>

        {/* ── PHOTO COLLAGE – Kibou landscape + portrait offset ── */}
        <div aria-label="TokySen Restaurant – Innenbereich" className="about-collage fade-in">
          <div className="collage-strip">
            <div className="collage-track">
              {[...INTERIOR_IMAGES, ...INTERIOR_IMAGES].map((img, i) => (
                <figure
                  aria-hidden={i >= INTERIOR_IMAGES.length}
                  className="strip-item"
                  key={i}
                >
                  <img alt={img.alt} src={img.src} />
                </figure>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTACT & HOURS ── */}
        <section className="contact-section fade-in" id="kontakt">
          <div className="section-shell" style={{ paddingBottom: "48px" }}>
            <h2>Besuchen Sie uns</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-block">
              <div className="contact-icon">
                <Clock size={32} strokeWidth={1.5} />
              </div>
              <h3>Öffnungszeiten</h3>
              <ul className="hours-list">
                <li>Mo – Fr: 11:00 – 22:00 Uhr</li>
                <li>Sa, So &amp; Feiertage: 11:30 – 22:00 Uhr</li>
              </ul>
            </div>

            <div className="contact-block">
              <div className="contact-icon">
                <MapPin size={32} strokeWidth={1.5} />
              </div>
              <h3>Adresse</h3>
              <address>
                Hönower Str. 100<br />
                12623 Berlin<br />
                (Mahlsdorf)
              </address>
            </div>

            <div className="contact-block">
              <div className="contact-icon">
                <Phone size={32} strokeWidth={1.5} />
              </div>
              <h3>Telefon</h3>
              <p>
                <a className="contact-link" href="tel:+493066508191">
                  +49 30 66508191
                </a>
              </p>
            </div>
          </div>

          {/* ── MAP ── */}
          <div className="map-wrapper">
            <iframe
              allowFullScreen
              className="map-frame"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=H%C3%B6nower+Str.+100%2C+12623+Berlin&output=embed&hl=de"
              title="TokySen Restaurant – Standort"
              width="100%"
            />
          </div>
        </section>

        {/* ── FOLLOW ── */}
        <a className="follow-link" href="#">
          <InstagramIcon />
          Folgen Sie uns
        </a>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-top-border" />
        <div className="footer-main">
          <nav aria-label="Footer Navigation">
            {FOOTER_NAV.map((item) => (
              <a href="#" key={item}>
                {item}
              </a>
            ))}
          </nav>
          <div className="socials">
            <a aria-label="Facebook" href="#">
              <FacebookIcon />
            </a>
            <a aria-label="Instagram" href="#">
              <InstagramIcon />
            </a>
          </div>
          <p className="footer-tagline">Asiatische Küche – Tradition · Qualität · Gastfreundschaft</p>
          <p className="footer-address">Hönower Str. 100 · 12623 Berlin · +49 30 66508191</p>
        </div>
        <div className="legal">
          <div>
            <a href="#">Datenschutz</a>
            <a href="#">Impressum</a>
            <a href="#">AGB</a>
          </div>
          <p>Copyright © 2026 Hoangcaster</p>
        </div>
      </footer>
    </main>
  );
}
