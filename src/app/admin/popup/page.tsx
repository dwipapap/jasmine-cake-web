"use client";

import { useState, useEffect, useTransition } from "react";
import { Loader2, Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createBrowserClient } from "@/lib/supabase/client";
import { updatePopupSettings, uploadPopupImage } from "@/lib/actions";
import type { Popup } from "@/lib/supabase/types";

export default function AdminPopupPage() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchPopup() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("popups")
        .select("*")
        .limit(1)
        .single();

      if (data) {
        const popupData = data as Popup;
        setPopup(popupData);
        setLinkUrl(popupData.link_url || "");
      }
      setIsLoading(false);
    }

    fetchPopup();
  }, []);

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await updatePopupSettings({
        is_active: checked,
        link_url: linkUrl || null,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setPopup((prev) =>
          prev ? { ...prev, is_active: checked } : prev
        );
      }
    });
  };

  const handleSaveLink = () => {
    if (!popup) return;
    startTransition(async () => {
      const result = await updatePopupSettings({
        is_active: popup.is_active,
        link_url: linkUrl || null,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setPopup((prev) =>
          prev ? { ...prev, link_url: linkUrl || null } : prev
        );
      }
    });
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadPopupImage(formData);

    if (result.error) {
      setError(result.error);
    } else if ("url" in result && result.url) {
      setPopup((prev) =>
        prev ? { ...prev, image_url: result.url } : prev
      );
    }
    setIsUploading(false);
  };

  const handleDeleteImage = async () => {
    if (!popup?.id) return;
    setError(null);
    const supabase = createBrowserClient();
    const { error: dbError } = await supabase
      .from("popups")
      .update({ image_url: null })
      .eq("id", popup.id);

    if (dbError) {
      setError(dbError.message);
    } else {
      setPopup((prev) => (prev ? { ...prev, image_url: null } : prev));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-burgundy-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-burgundy-900">
          Kelola Popup
        </h1>
        <p className="mt-1 text-sm text-burgundy-600">
          Atur banner popup yang muncul di halaman utama website.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-6">
        <div className="space-y-6">
          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium text-burgundy-900">
                Aktifkan Popup
              </Label>
              <p className="text-sm text-burgundy-500">
                Tampilkan popup di halaman utama
              </p>
            </div>
            <Switch
              checked={popup?.is_active ?? false}
              onCheckedChange={handleToggle}
              disabled={isPending}
            />
          </div>

          <hr className="border-cream-200" />

          {/* Image Upload */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-burgundy-900">
              Upload Gambar Popup
            </Label>

            {popup?.image_url ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-cream-200">
                  <Image
                    src={popup.image_url}
                    alt="Gambar popup"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="popup-image-upload">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                      className="cursor-pointer"
                      asChild
                    >
                      <span>
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        Ganti Gambar
                      </span>
                    </Button>
                  </label>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteImage}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus Gambar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-cream-300 p-8 text-center">
                <Upload className="mb-2 h-8 w-8 text-burgundy-400" />
                <p className="text-sm text-burgundy-500">
                  Belum ada gambar popup
                </p>
                <label htmlFor="popup-image-upload" className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    className="cursor-pointer"
                    asChild
                  >
                    <span>
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Upload Gambar Popup
                    </span>
                  </Button>
                </label>
              </div>
            )}
            <input
              id="popup-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <hr className="border-cream-200" />

          {/* Link URL */}
          <div className="space-y-2">
            <Label
              htmlFor="link-url"
              className="text-base font-medium text-burgundy-900"
            >
              Link Tujuan (opsional)
            </Label>
            <p className="text-sm text-burgundy-500">
              URL yang dibuka saat pengunjung mengklik gambar popup
            </p>
            <div className="flex gap-2">
              <Input
                id="link-url"
                type="url"
                placeholder="https://contoh.com/produk"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleSaveLink}
                disabled={isPending}
                size="sm"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
