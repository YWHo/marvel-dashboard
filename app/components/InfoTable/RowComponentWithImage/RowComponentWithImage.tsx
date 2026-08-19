"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";
import type { InfoRow, OnClickCallbackType } from "@/app/lib/type-definitions";

interface Props extends InfoRow {
  className?: string;
  onClickCallback?: OnClickCallbackType;
}

export function RowComponentWithImage({
  id,
  className,
  title,
  description,
  imageURL = "",
  onClickCallback = () => {},
}: Props) {
  return (
    <li
      className={clsx(
        "flex w-full border-b border-gray-500 p-4 bg-gray-900 rounded",
        className
      )}
      onClick={() => onClickCallback(id)}
    >
      <figure className="max-w-[130px] max-h-[130px] flex items-center justify-center w-1/3 md:w-1/6 mr-2 text-white">
        <Image
          src={imageURL}
          alt={`${title} image`}
          width={100}
          height={100}
          className="max-h-full w-auto object-contain"
        />
      </figure>
      <article className="flex-grow w-1/2 sm:w-2/3 md:w-5/6 flex flex-col text-gray-200">
        <h2 className="font-bold mb-4">{title}</h2>
        <p className="min-h-8 text-wrap text-sm">
          {description && description.length > 0
            ? description
            : "(There is no information available.)"}
        </p>
      </article>
    </li>
  );
}
