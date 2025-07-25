"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, FormEvent, HTMLInputTypeAttribute, useRef } from "react";
import { ProductSortKeys } from "@/lib/shopify/getProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { FilterIcon, Search } from "lucide-react";

export function FilterSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchBarRef = useRef<HTMLInputElement | null>(null);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 1000,
  ]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // const newParams = new URLSearchParams(searchParams.toString());
    //
    // newParams.set("q", formData.get("q") as string || "");
    // newParams.set("sort", formData.get("sort") as string);
    // newParams.set("order", formData.get("order") as string);
    // newParams.set("minPrice", priceRange[0].toString());
    // newParams.set("maxPrice", priceRange[1].toString());
    //
    // // Clean up empty params
    // if (!formData.get("q")) newParams.delete("q");
    //
    // router.push(`/products?${newParams.toString()}`);
    handleSearch(formData.get('q') || "", formData.get('sort'), formData.get('order'), priceRange[0].toString(), priceRange[1].toString())
  };
  function handleSearch(q: string | null = null, sort: string | null = null, order: string | null = null, minPrice: string | null = null, maxPrice: string | null = null) {
    const newParams = new URLSearchParams(searchParams.toString())
    if (!q) {
      newParams.delete('q')
    } else {
      newParams.set("q", q)
    }
    if (!sort) {
      newParams.delete('sort')
    } else {

      newParams.set("sort", sort)
    }
    if (!order) {
      newParams.delete('order')
    } else {
      newParams.set("order", order)
    }
    if (!minPrice) {
      newParams.delete('minPrice')
    } else {
      newParams.set("minPrice", minPrice)
    }
    if (!maxPrice) {
      newParams.delete('maxPrice')
    } else {
      newParams.set("maxPrice", maxPrice)
    }
    console.log(newParams, q)
    router.push(`/products?${newParams.toString()}`)
  }

  return (
    <div className="w-full justify-between flex">
      <div className="relative space-y-3 hidden sm:block">
        <Input
          id="q"
          name="q"
          placeholder="Search"
          defaultValue={searchParams.get("q") || ""}
          ref={searchBarRef}
          className="pr-12 "
        />
        <Search className="absolute right-2 top-1/8 cursor-pointer" onClick={() => handleSearch(searchBarRef.current.value)} />
      </div>
      <Sheet >
        <SheetTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 cursor-pointer">
            <FilterIcon className="h-4 w-4" />
            Filter & Sort
          </Button>
        </SheetTrigger>
        <SheetContent className="px-4 py-2">
          <form onSubmit={handleSubmit}>
            <SheetHeader className="mb-6">
              <SheetTitle>Refine Your Search</SheetTitle>
              <SheetDescription>
                Use the controls below to find exactly what you're looking for.
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-8">
              <div className="space-y-3 sm:hidden">
                <Label htmlFor="q">Search</Label>
                <Input
                  id="q"
                  name="q"
                  placeholder="Product name..."
                  defaultValue={searchParams.get("q") || ""}
                />
              </div>

              <div className="space-y-4">
                <Label>Price Range</Label>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}{priceRange[1] === 1000 ? '+' : ''}</span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={1000}
                  step={10}
                  minStepsBetweenThumbs={1}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="sort">Sort By</Label>
                  <Select name="sort" defaultValue={searchParams.get("sort") ?? ProductSortKeys.CREATED_AT}>
                    <SelectTrigger id="sort"><SelectValue /></SelectTrigger>
                    <SelectContent >
                      <SelectItem className="hover:text-white" value={ProductSortKeys.CREATED_AT}>Newest</SelectItem>
                      <SelectItem className="hover:text-white" value={ProductSortKeys.PRICE}>Price</SelectItem>
                      <SelectItem className="hover:text-white" value={ProductSortKeys.TITLE}>Title</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="order">Order</Label>
                  <Select name="order" defaultValue={searchParams.get("order") ?? "desc"}>
                    <SelectTrigger id="order"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-8">
              <SheetClose asChild>
                <Button type="submit" size="lg" className="w-full">
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

    </div>
  );
}
