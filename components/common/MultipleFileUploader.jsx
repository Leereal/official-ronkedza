"use client";

import { useCallback } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import { X } from "lucide-react";

export function MultipleFileUploader({
  imageUrls,
  onFieldChange,
  files,
  setFiles,
  disabled,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Add the new files to the existing files
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      // Convert the new files to URLs
      const fileUrls = acceptedFiles.map((file) => convertFileToUrl(file));

      // Add the new URLs to the existing image URLs
      const updatedImageUrls = [...imageUrls, ...fileUrls];
      onFieldChange(updatedImageUrls);
    },
    [files, imageUrls, setFiles, onFieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" ? generateClientDropzoneAccept(["image/*"]) : undefined,
  });

  const removeFiles = (e, idx) => {
    e.stopPropagation();

    //We need to remove files to be uploaded
    const newFiles = files.filter((file, index) => index !== idx);
    setFiles(newFiles);

    //We need to remove urls to be saved
    const updatedImageUrls = imageUrls.filter((img, index) => index !== idx);
    onFieldChange(updatedImageUrls);
  };

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed dark:border-darkmode-400 rounded-md py-2"
    >
      <input
        {...getInputProps()}
        className="cursor-pointer"
        disabled={disabled}
      />
      <div className="flex flex-wrap px-4">
        {imageUrls &&
          !!imageUrls.length &&
          imageUrls.map((image, index) => (
            <div className="w-20 h-20 relative my-2 mr-5 cursor-pointer zoom-in">
              <Image
                src={image}
                alt="image"
                layout="fill"
                className="w-full object-cover object-center rounded-xl"
              />
              <div
                title="Remove this image?"
                className="w-4 h-4 flex items-center justify-center absolute rounded-full text-white bg-danger right-0 top-0 mr-2 mt-2 bg-slate-100"
              >
                <X
                  className="w-6 h-6 text-red-500"
                  onClick={(e) => removeFiles(e, index)}
                />
              </div>
            </div>
          ))}
        <div className="w-20 h-20 my-2 text-grey-500 flex flex-col items-center border-2 rounded-xl cursor-pointer">
          <Image
            src="/icons/upload.svg"
            width={30}
            height={30}
            alt="file upload"
          />
          <p className="p-medium-12 text-center text-[8px]">SVG, PNG, JPG</p>
        </div>
      </div>
    </div>
  );
}
