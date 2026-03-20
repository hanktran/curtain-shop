"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { createProduct, updateProduct } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import {
  categoriesByType,
  catNames,
  colorOptions,
  materialOptions,
  originNames,
  typeNames,
  types,
} from "@/lib/product-config";
import { generateSlug } from "@/lib/utils";
import type { Product } from "@/types";

import { ImageUploader } from "./ImageUploader";

interface Props {
  product?: Product;
}

type FieldErrors = Record<string, string[] | undefined>;

export function ProductForm({ product }: Readonly<Props>) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(
    product?.images ?? [],
  );
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isImagesDirty, setIsImagesDirty] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(
    product?.type ?? types[0],
  );
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>(
    product?.origin
      ? product.origin
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    product?.color ?? [],
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    product?.material ?? [],
  );
  const [slug, setSlug] = useState<string>(product?.slug ?? '');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  let submitLabel = '';
  if (isPending) {
    submitLabel = product ? 'Đang cập nhật…' : 'Đang thêm…';
  } else {
    submitLabel = product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm';
  }

  useUnsavedChanges(isFormDirty || isImagesDirty);

  function markFormDirty() {
    setIsFormDirty(true);
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    markFormDirty();
    if (!product) setSlug(generateSlug(e.target.value));
  }

  const cats =
    categoriesByType[selectedType as keyof typeof categoriesByType] ?? [];

  function toggleOrigin(key: string) {
    markFormDirty();
    setSelectedOrigins((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function toggleColor(key: string) {
    markFormDirty();
    setSelectedColors((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function toggleMaterial(key: string) {
    markFormDirty();
    setSelectedMaterials((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function handleSubmit(formData: FormData) {
    setErrors({});
    uploadedUrls.forEach((url) => formData.append("images", url));

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if ("success" in result) {
        setIsFormDirty(false);
        setIsImagesDirty(false);
        toast.success(
          product ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công",
        );
        router.push("/admin/products");
      } else if ("errors" in result) {
        setErrors(result.errors as FieldErrors);
        toast.error("Vui lòng kiểm tra lại thông tin");
      }
    });
  }

  function fieldError(name: string) {
    const msgs = errors[name];
    if (!msgs?.length) return null;
    return <p className="text-xs text-destructive mt-1">{msgs[0]}</p>;
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      noValidate
      autoComplete="off"
      onChangeCapture={markFormDirty}
    >
      {/* ── Sticky header: title + actions ── */}
      <div className="sticky top-0 z-10 py-4 mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {product ? `Chỉnh sửa: ${product.title}` : 'Thêm sản phẩm'}
        </h1>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/products')}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {submitLabel}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Left column: all fields ── */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Tên sản phẩm</Label>
            <Input
              id="title"
              name="title"
              defaultValue={product?.title}
              onChange={handleTitleChange}
            />
            {fieldError("title")}
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug (URL)</Label>
              <button
                type="button"
                className="text-xs text-brand hover:underline"
                onClick={() => {
                  markFormDirty();
                  const titleEl = formRef.current?.elements.namedItem('title') as HTMLInputElement | null
                  if (titleEl) setSlug(generateSlug(titleEl.value))
                }}
              >
                Tự tạo từ tên
              </button>
            </div>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                markFormDirty();
                setSlug(e.target.value);
              }}
            />
            {fieldError("slug")}
          </div>

          {/* Type */}
          <div className="space-y-1">
            <Label htmlFor="type">Loại sản phẩm</Label>
            <Select
              name="type"
              defaultValue={product?.type ?? types[0]}
              onValueChange={(value) => {
                markFormDirty();
                setSelectedType(value);
              }}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {typeNames[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError("type")}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label htmlFor="category">Danh mục</Label>
            <Select name="category" defaultValue={product?.category ?? cats[0]}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cats.map((c) => (
                  <SelectItem key={c} value={c}>
                    {catNames[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError("category")}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <Label htmlFor="price">Giá</Label>
            <Input
              id="price"
              name="price"
              placeholder="VD: 500000 hoặc Liên hệ"
              defaultValue={product?.price}
            />
            {fieldError("price")}
          </div>

          {/* Origin — multi-select checkboxes */}
          <div className="space-y-2">
            <Label>Xuất xứ</Label>
            <input
              type="hidden"
              name="origin"
              value={selectedOrigins.join(",")}
            />
            <div className="grid grid-cols-2 gap-2 rounded-md border p-3">
              {Object.entries(originNames).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={`origin-${key}`}
                    checked={selectedOrigins.includes(key)}
                    onCheckedChange={() => toggleOrigin(key)}
                  />
                  <label
                    htmlFor={`origin-${key}`}
                    className="text-sm cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
            {fieldError("origin")}
          </div>

          {/* Color — multi-select checkboxes */}
          <div className="space-y-2">
            <Label>Màu sắc</Label>
            <input
              type="hidden"
              name="color"
              value={selectedColors.join(",")}
            />
            <div className="flex flex-wrap gap-3 rounded-md border p-3">
              {Object.entries(colorOptions).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={`color-${key}`}
                    checked={selectedColors.includes(key)}
                    onCheckedChange={() => toggleColor(key)}
                  />
                  <label
                    htmlFor={`color-${key}`}
                    className="text-sm cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
            {fieldError("color")}
          </div>

          {/* Material — multi-select checkboxes */}
          <div className="space-y-2">
            <Label>Chất liệu</Label>
            <input
              type="hidden"
              name="material"
              value={selectedMaterials.join(",")}
            />
            <div className="flex flex-wrap gap-3 rounded-md border p-3">
              {Object.entries(materialOptions).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={`material-${key}`}
                    checked={selectedMaterials.includes(key)}
                    onCheckedChange={() => toggleMaterial(key)}
                  />
                  <label
                    htmlFor={`material-${key}`}
                    className="text-sm cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
            {fieldError("material")}
          </div>

          {/* Optional fields — compact 3-column row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="wood">Loại gỗ</Label>
              <Input id="wood" name="wood" defaultValue={product?.wood ?? ""} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="brand">Thương hiệu</Label>
              <Input
                id="brand"
                name="brand"
                defaultValue={product?.brand ?? ""}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="windowBlinds">Màn sáo</Label>
              <Input
                id="windowBlinds"
                name="windowBlinds"
                defaultValue={product?.windowBlinds ?? ""}
              />
            </div>
          </div>

          {/* Show on homepage */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="showOnHomePage"
              name="showOnHomePage"
              defaultChecked={product?.showOnHomePage ?? false}
              onCheckedChange={markFormDirty}
            />
            <Label htmlFor="showOnHomePage">Hiển thị trên trang chủ</Label>
          </div>
        </div>
        {/* end left column */}

        {/* ── Right column: images ── */}
        <div className="lg:sticky lg:top-8 lg:self-start space-y-1">
          <Label>Hình ảnh</Label>
          <ImageUploader
            onUploadComplete={(urls) => {
              if (urls.length > 0) setIsImagesDirty(true);
              setUploadedUrls((prev) => [...prev, ...urls]);
            }}
            onRemoveImage={(url) => {
              setIsImagesDirty(true);
              setUploadedUrls((prev) => prev.filter((u) => u !== url));
            }}
            existingImages={uploadedUrls}
          />
          {fieldError("images")}
        </div>
      </div>
      {/* end grid */}
    </form>
  );
}
