"use client";

import { useState } from "react";

type ScopeOption = { slug: string; title: string; categories: { slug: string; title: string }[] };

export function SourcingScopeFields({ options, segment = "", category = "" }: {
  options: ScopeOption[];
  segment?: string;
  category?: string;
}) {
  const [selectedSegment, setSelectedSegment] = useState(segment);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const segments = options.filter((option) => !selectedSegment || option.slug === selectedSegment);
  const fieldClass = "field-focus mt-2 block min-h-11 w-full border bg-white px-2";

  return <>
    <label className="mt-5 block text-sm font-medium">Product line
      <select name="segment" value={selectedSegment} onChange={(event) => {
        setSelectedSegment(event.target.value);
        setSelectedCategory("");
      }} className={fieldClass}>
        <option value="">All lines</option>
        {options.map((option) => <option key={option.slug} value={option.slug}>{option.title}</option>)}
      </select>
    </label>
    <label className="mt-5 block text-sm font-medium">Category
      <select name="category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className={fieldClass}>
        <option value="">All categories</option>
        {segments.map((option) => <optgroup key={option.slug} label={option.title}>
          {option.categories.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
        </optgroup>)}
      </select>
    </label>
  </>;
}
