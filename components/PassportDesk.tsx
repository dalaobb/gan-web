"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import FileSaver from "file-saver";
import JSZip from "jszip";
import CompressCompareStage from "@/components/CompressCompareStage";
import OutputRow from "@/components/OutputRow";
import { removeBackground } from "@/lib/utils/remover";
import { isMobileDevice } from "@/lib/utils/remover/utils";
import { smallModelKey } from "@/lib/utils/const";
import { ImageType } from "@/lib/types";
import { t, type Lang } from "@/lib/i18n";
import { detectFaceMetrics, type FaceMetrics } from "@/lib/passport/face";
import {
  defaultPassportBackground,
  findPassportSpec,
  passportSpecs,
  type PassportSpecId,
} from "@/lib/passport/specs";
import {
  renderPassport,
  SHEET_HEIGHT,
  SHEET_WIDTH,
} from "@/lib/passport/render";
import { normalizePortrait } from "@/lib/passport/normalize";
import { measureCutoutTop } from "@/lib/passport/measure";

const MODEL_CDN = "https://cdn.bgg.one/remove-bg/model/1.5.3/";

type Status = "idle" | "detect" | "remove" | "ready" | "error";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image"));
    image.src = src;
  });
}

function revoke(url: string) {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function PassportDesk({
  lang,
  initialSpecId = "us",
}: {
  lang: Lang;
  initialSpecId?: PassportSpecId;
}) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalRef = useRef("");
  const photoRef = useRef("");
  const sheetRef = useRef("");
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    scaleX: number;
    scaleY: number;
    moved: boolean;
  } | null>(null);
  const [specId, setSpecId] = useState<PassportSpecId>(initialSpecId);
  const spec = findPassportSpec(specId) ?? passportSpecs[0];
  const [background, setBackground] = useState(() =>
    defaultPassportBackground(spec),
  );
  const [customBackground, setCustomBackground] = useState("#438edb");
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [originalUrl, setOriginalUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [sheet, setSheet] = useState<Blob | null>(null);
  const [cutout, setCutout] = useState<Blob | null>(null);
  const [metrics, setMetrics] = useState<FaceMetrics | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("passport-photo");
  const [previewKind, setPreviewKind] = useState<"photo" | "sheet" | null>(
    null,
  );
  const [zipping, setZipping] = useState(false);

  useEffect(() => {
    setSpecId(initialSpecId);
  }, [initialSpecId]);

  useEffect(() => {
    setBackground(defaultPassportBackground(spec));
  }, [spec]);

  useEffect(() => {
    return () => {
      revoke(originalRef.current);
      revoke(photoRef.current);
      revoke(sheetRef.current);
    };
  }, []);

  useEffect(() => {
    if (!cutout || !metrics) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      renderPassport(cutout, metrics, spec, {
        background,
        zoom,
        offsetX,
        offsetY,
      })
        .then((result) => {
          if (cancelled) return;
          revoke(photoRef.current);
          revoke(sheetRef.current);
          photoRef.current = URL.createObjectURL(result.photo);
          sheetRef.current = URL.createObjectURL(result.sheet);
          setPhoto(result.photo);
          setSheet(result.sheet);
          setPhotoUrl(photoRef.current);
          setSheetUrl(sheetRef.current);
          setStatus("ready");
          setError("");
        })
        .catch(() => {
          if (cancelled) return;
          setStatus("error");
          setError(t(lang, "passportFailed"));
        });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [background, cutout, lang, metrics, offsetX, offsetY, spec, zoom]);

  async function processFile(file?: File | null) {
    if (!file) return;
    setStatus("detect");
    setError("");
    setMetrics(null);
    setCutout(null);
    setPhoto(null);
    setSheet(null);
    setPhotoUrl("");
    setSheetUrl("");
    setFileName(file.name.replace(/\.[^.]+$/, "") || "passport-photo");

    try {
      const input = await normalizePortrait(file);
      revoke(originalRef.current);
      originalRef.current = URL.createObjectURL(input);
      setOriginalUrl(originalRef.current);

      const image = await loadImage(originalRef.current);
      const face = await detectFaceMetrics(image);
      setMetrics(face);
      setStatus("remove");

      const smallModel = !!window.localStorage.getItem(smallModelKey);
      const result = await removeBackground(input, {
        device: "gpu",
        publicPath: MODEL_CDN,
        proxyToWorker: true,
        debug: false,
        model: smallModel || isMobileDevice() ? "isnet_quint8" : "isnet",
        output: { format: ImageType.PNG, quality: 1 },
      });

      const cutoutTop = await measureCutoutTop(result);
      if (cutoutTop != null && cutoutTop < face.crownY) {
        setMetrics({
          ...face,
          crownY: cutoutTop,
          headHeight: Math.max(1, face.chinY - cutoutTop),
        });
      }
      setCutout(result);
    } catch (err) {
      console.error("Passport processing failed", err);
      const message = err instanceof Error ? err.message : "";
      setStatus("error");
      setError(
        t(lang, message === "no-face" ? "passportNoFace" : "passportFailed"),
      );
    }
  }

  function resetAdjustments() {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setBackground(defaultPassportBackground(spec));
  }

  const photoName = `${fileName}-${spec.id}.jpg`;
  const sheetName = `${fileName}-${spec.id}-4x6.jpg`;

  async function downloadAll() {
    if (!photo || !sheet || zipping) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      zip.file(photoName, photo);
      zip.file(sheetName, sheet);
      FileSaver.saveAs(
        await zip.generateAsync({ type: "blob" }),
        `${fileName}-passport.zip`,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setZipping(false);
    }
  }

  function downloadEach() {
    if (!photo || !sheet) return;
    FileSaver.saveAs(photo, photoName);
    setTimeout(() => FileSaver.saveAs(sheet, sheetName), 300);
  }

  const busy = status === "detect" || status === "remove";
  const customSelected = !spec.backgrounds.some(
    (choice) => choice.color === background,
  );
  const preview = photoUrl || originalUrl;
  const previewItems =
    photo && sheet && photoUrl && sheetUrl
      ? [
          {
            id: "photo",
            file: new File([photo], photoName, { type: photo.type }),
            preview: photoUrl,
            width: spec.width,
            height: spec.height,
          },
          {
            id: "sheet",
            file: new File([sheet], sheetName, { type: sheet.type }),
            preview: sheetUrl,
            width: SHEET_WIDTH,
            height: SHEET_HEIGHT,
          },
        ]
      : [];

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      if (busy) return;
      const items = event.clipboardData?.items;
      for (let index = 0; items && index < items.length; index += 1) {
        const file = items[index].getAsFile();
        if (file?.type.startsWith("image/")) {
          event.preventDefault();
          void processFile(file);
          break;
        }
      }
    }
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [busy, lang]);

  useEffect(() => {
    const node = previewRef.current;
    if (!node || !photo) return;
    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const step = event.deltaY > 0 ? -0.01 : 0.01;
      setZoom((value) =>
        clamp(Math.round((value + step) * 100) / 100, 0.85, 1.15),
      );
    }
    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [photo, photoUrl]);

  function onPreviewPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!photo || busy) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX,
      offsetY,
      scaleX: spec.width / rect.width,
      scaleY: spec.height / rect.height,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function onPreviewPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (
      Math.abs(event.clientX - drag.startX) > 4 ||
      Math.abs(event.clientY - drag.startY) > 4
    ) {
      drag.moved = true;
    }
    setOffsetX(
      Math.round(
        clamp(
          drag.offsetX + (event.clientX - drag.startX) * drag.scaleX,
          -160,
          160,
        ),
      ),
    );
    setOffsetY(
      Math.round(
        clamp(
          drag.offsetY + (event.clientY - drag.startY) * drag.scaleY,
          -160,
          160,
        ),
      ),
    );
  }

  function onPreviewPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!drag.moved && !busy) {
      fileInputRef.current?.click();
    }
  }

  return (
    <div className="pt-12">
      <header className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <h1 className="text-4xl leading-tight sm:text-[2.75rem]">
          {t(lang, "passportTitle")}
        </h1>
        <p className="mt-3 text-base text-(--muted-ink)">
          {t(lang, "passportLead")}
        </p>
      </header>

      <div className="main-width-wide grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="glass-effect p-4 pt-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
              id={fileInputId}
              className="h-0 opacity-0"
              disabled={busy}
              onChange={(event) => {
                void processFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            {preview ? (
              <div
                ref={previewRef}
                className="drop-zone relative flex min-h-72 cursor-grab touch-none items-center justify-center overflow-hidden border-2 border-dashed p-4 text-center active:cursor-grabbing"
                onPointerDown={onPreviewPointerDown}
                onPointerMove={onPreviewPointerMove}
                onPointerUp={onPreviewPointerUp}
                onPointerCancel={onPreviewPointerUp}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (!busy) void processFile(event.dataTransfer.files?.[0]);
                }}
              >
                <img
                  src={preview}
                  alt=""
                  draggable={false}
                  className="max-h-[32rem] w-auto max-w-full select-none object-contain"
                />
              </div>
            ) : (
              <label
                htmlFor={fileInputId}
                className="drop-zone flex min-h-72 cursor-pointer items-center justify-center border-2 border-dashed p-4 text-center"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  void processFile(event.dataTransfer.files?.[0]);
                }}
              >
                <div className="bg-(--paper) px-8 py-6">
                  <p className="font-display text-3xl leading-tight text-(--ink)">
                    {t(lang, "passportDrop")}
                  </p>
                  <p className="mt-3 text-sm text-(--muted-ink)">
                    {t(lang, "passportDropHint")}
                  </p>
                </div>
              </label>
            )}

            {status !== "idle" ? (
              <p className="mt-3 text-sm text-(--muted-ink)">
                {status === "detect" ? t(lang, "passportDetect") : null}
                {status === "remove" ? t(lang, "passportRemove") : null}
                {status === "ready" ? t(lang, "passportReady") : null}
                {status === "error" ? error : null}
              </p>
            ) : null}
            {photo ? (
              <p className="mt-2 text-sm text-(--muted-ink)">
                {t(lang, "passportDragHint")}
              </p>
            ) : null}
            <div className="pt-4">
              <label className="block text-sm">
                <span className="flex justify-between text-(--muted-ink)">
                  <span>{t(lang, "passportHeadSize")}</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </span>
                <input
                  type="range"
                  min={0.85}
                  max={1.15}
                  step={0.01}
                  value={zoom}
                  disabled={busy || !metrics}
                  className="mt-2 w-full"
                  onChange={(event) => setZoom(Number(event.target.value))}
                />
              </label>

              <label className="block text-sm">
                <span className="flex justify-between text-(--muted-ink)">
                  <span>{t(lang, "passportMoveX")}</span>
                  <span>{offsetX}</span>
                </span>
                <input
                  type="range"
                  min={-160}
                  max={160}
                  step={1}
                  value={offsetX}
                  disabled={busy || !metrics}
                  className="mt-2 w-full"
                  onChange={(event) => setOffsetX(Number(event.target.value))}
                />
              </label>

              <label className="block text-sm">
                <span className="flex justify-between text-(--muted-ink)">
                  <span>{t(lang, "passportMoveY")}</span>
                  <span>{offsetY}</span>
                </span>
                <input
                  type="range"
                  min={-160}
                  max={160}
                  step={1}
                  value={offsetY}
                  disabled={busy || !metrics}
                  className="mt-2 w-full"
                  onChange={(event) => setOffsetY(Number(event.target.value))}
                />
              </label>

              <button
                type="button"
                className="btn btn-line"
                disabled={busy || !metrics}
                onClick={resetAdjustments}
              >
                {t(lang, "passportReset")}
              </button>
            </div>
        </div>

        <div className="glass-effect flex flex-col gap-4 p-4">
          <div>
            <p className="text-sm text-(--muted-ink)">
              {t(lang, "passportCountry")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {passportSpecs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={busy}
                  aria-pressed={item.id === specId}
                  className={
                    item.id === specId
                      ? "border border-(--ink) px-3 py-2 text-sm"
                      : "border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)"
                  }
                  onClick={() => setSpecId(item.id)}
                >
                  {item.name[lang]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-(--muted-ink)">
              {spec.sizeLabel[lang]}
            </p>
          </div>

          <div>
            <p className="text-sm text-(--muted-ink)">
              {t(lang, "passportBackground")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {spec.backgrounds.map((choice) => (
                <button
                  key={choice.color}
                  type="button"
                  disabled={busy}
                  aria-pressed={choice.color === background}
                  className={
                    choice.color === background
                      ? "border border-(--ink) px-3 py-2 text-sm"
                      : "border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)"
                  }
                  onClick={() => setBackground(choice.color)}
                >
                  <span
                    className="mr-2 inline-block h-3 w-3 border border-(--line) align-middle"
                    style={{ backgroundColor: choice.color }}
                  />
                  {choice.label[lang]}
                </button>
              ))}
              <label
                className={
                  customSelected
                    ? "border border-(--ink) px-3 py-2 text-sm"
                    : "border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)"
                }
              >
                <input
                  type="color"
                  value={customBackground}
                  aria-label={t(lang, "passportCustomColor")}
                  className="mr-2 h-4 w-4 cursor-pointer border border-(--line) bg-transparent p-0 align-middle"
                  onChange={(event) => {
                    const color = event.target.value;
                    setCustomBackground(color);
                    setBackground(color);
                  }}
                />
                {t(lang, "passportCustomColor")}
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={fileInputId}
              className="btn btn-line cursor-pointer"
              aria-disabled={busy}
            >
              {t(lang, "passportChange")}
            </label>
          </div>

          <div className="mt-auto space-y-3 border-t border-(--line) pt-4">
            <p className="text-sm text-(--muted-ink)">{spec.note[lang]}</p>
            <p className="text-sm text-(--muted-ink)">
              {t(lang, "passportNote")}
            </p>
          </div>
        </div>
      </div>

      {photo && sheet && photoUrl && sheetUrl ? (
        <div className="main-width-wide mt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl">
              {t(lang, "passportOutput")}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn btn-line"
                onClick={downloadEach}
              >
                {t(lang, "download")}
              </button>
              <button
                type="button"
                className="btn btn-line"
                disabled={zipping}
                onClick={downloadAll}
              >
                {zipping ? t(lang, "processing") : t(lang, "downloadAllZip")}
              </button>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            <OutputRow
              lang={lang}
              name={photoName}
              blob={photo}
              url={photoUrl}
              width={spec.width}
              height={spec.height}
              onPreview={() => setPreviewKind("photo")}
            />
            <OutputRow
              lang={lang}
              name={sheetName}
              blob={sheet}
              url={sheetUrl}
              width={SHEET_WIDTH}
              height={SHEET_HEIGHT}
              onPreview={() => setPreviewKind("sheet")}
            />
          </ul>
        </div>
      ) : null}

      {previewKind && previewItems.length ? (
        <CompressCompareStage
          items={previewItems}
          lang={lang}
          initialId={previewKind}
          compare={false}
          title={t(lang, "preview")}
          onClose={() => setPreviewKind(null)}
        />
      ) : null}
    </div>
  );
}
