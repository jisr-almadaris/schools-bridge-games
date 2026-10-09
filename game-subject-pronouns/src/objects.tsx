import type { ReactNode } from "react";
import { IMAGES } from "./media";

export type ObjectKind = "book" | "ball" | "apple" | "bird" | "car" | "books" | "cats";

export function ObjectArt({ kind, className = "" }: { kind: ObjectKind; className?: string }) {
  const wrap = (node: ReactNode) => (
    <div className={`flex items-center justify-center ${className}`}>{node}</div>
  );

  switch (kind) {
    case "book":
      return wrap(
        <svg viewBox="0 0 160 160" className="h-full w-full max-h-44">
          <rect x="28" y="30" width="104" height="108" rx="10" fill="#7C3AED" />
          <rect x="38" y="30" width="94" height="108" rx="8" fill="#FDE68A" />
          <rect x="46" y="44" width="70" height="10" rx="5" fill="#C4B5FD" />
          <rect x="46" y="64" width="54" height="8" rx="4" fill="#A7F3D0" />
          <rect x="46" y="80" width="62" height="8" rx="4" fill="#A7F3D0" />
          <rect x="32" y="30" width="10" height="108" rx="3" fill="#5B21B6" />
        </svg>,
      );
    case "books":
      return wrap(
        <svg viewBox="0 0 200 140" className="h-full w-full max-h-40">
          <g transform="rotate(-12 50 90)">
            <rect x="18" y="38" width="46" height="78" rx="6" fill="#FB7185" />
            <rect x="24" y="44" width="34" height="8" rx="3" fill="#FFE4E6" />
          </g>
          <g>
            <rect x="76" y="28" width="50" height="88" rx="6" fill="#38BDF8" />
            <rect x="84" y="40" width="34" height="8" rx="3" fill="#E0F2FE" />
            <rect x="84" y="54" width="28" height="7" rx="3" fill="#E0F2FE" />
          </g>
          <g transform="rotate(10 160 90)">
            <rect x="132" y="36" width="48" height="82" rx="6" fill="#34D399" />
            <rect x="140" y="48" width="32" height="8" rx="3" fill="#ECFDF5" />
          </g>
        </svg>,
      );
    case "ball":
      return wrap(
        <svg viewBox="0 0 160 160" className="h-full w-full max-h-44">
          <circle cx="80" cy="80" r="52" fill="#F59E0B" />
          <circle cx="80" cy="80" r="52" fill="none" stroke="#fff" strokeWidth="6" />
          <path d="M28 80h104M80 28v104M42 46c22 18 54 18 76 0M42 114c22-18 54-18 76 0" fill="none" stroke="#fff" strokeWidth="5" />
          <ellipse cx="62" cy="62" rx="12" ry="8" fill="#FDE68A" opacity="0.7" />
        </svg>,
      );
    case "apple":
      return wrap(
        <svg viewBox="0 0 160 160" className="h-full w-full max-h-44">
          <path d="M80 46c18-28 44-8 28 10" stroke="#16A34A" strokeWidth="7" fill="none" />
          <ellipse cx="108" cy="58" rx="16" ry="8" fill="#4ADE80" transform="rotate(-20 108 58)" />
          <path d="M46 70c0-22 16-34 34-34s22 4 28 12c8-8 20-12 30-4 14 12 12 46-2 64-10 14-28 24-42 24s-36-8-46-22c-12-16-14-32-2-40z" fill="#F43F5E" />
          <ellipse cx="64" cy="78" rx="10" ry="16" fill="#FB7185" opacity="0.45" />
        </svg>,
      );
    case "bird":
      return wrap(
        <svg viewBox="0 0 160 160" className="h-full w-full max-h-44">
          <ellipse cx="86" cy="88" rx="40" ry="28" fill="#38BDF8" />
          <circle cx="118" cy="70" r="18" fill="#7DD3FC" />
          <circle cx="124" cy="68" r="4.5" fill="#0F172A" />
          <path d="M140 70l18 6-18 6z" fill="#FBBF24" />
          <path d="M58 88c-22-18-30 4-22 18 18 4 28-4 22-18z" fill="#0EA5E9" />
          <path d="M78 114l-6 18M92 114l6 18" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
        </svg>,
      );
    case "car":
      return wrap(
        <svg viewBox="0 0 180 140" className="h-full w-full max-h-40">
          <path d="M28 84 48 52c6-10 16-16 28-16h28c12 0 22 6 28 16l22 32z" fill="#A78BFA" />
          <rect x="18" y="80" width="144" height="28" rx="12" fill="#7C3AED" />
          <rect x="58" y="48" width="28" height="22" rx="6" fill="#E0F2FE" />
          <rect x="92" y="48" width="28" height="22" rx="6" fill="#E0F2FE" />
          <circle cx="52" cy="110" r="14" fill="#1E1B4B" />
          <circle cx="52" cy="110" r="6" fill="#E5E7EB" />
          <circle cx="128" cy="110" r="14" fill="#1E1B4B" />
          <circle cx="128" cy="110" r="6" fill="#E5E7EB" />
        </svg>,
      );
    case "cats":
      return wrap(
        <div className="flex items-end gap-2">
          <img src={IMAGES.cat} alt="قطة" className="h-28 w-28 object-contain anim-bob" />
          <img src={IMAGES.cat} alt="قطة أخرى" className="h-24 w-24 object-contain anim-bob" style={{ animationDelay: "0.4s" }} />
        </div>,
      );
    default:
      return null;
  }
}

export function Seal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className}>
      <circle cx="60" cy="60" r="54" fill="#FBBF24" />
      <circle cx="60" cy="60" r="44" fill="#7C3AED" />
      <circle cx="60" cy="60" r="36" fill="#FDE68A" />
      <path d="M60 28l8 18 20 2-15 13 4 20-17-10-17 10 4-20-15-13 20-2z" fill="#7C3AED" />
    </svg>
  );
}
