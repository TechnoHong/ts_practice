import React, { useCallback, useEffect, useState } from "react";

export interface FileType {
  file: File,
  url: string,
}

// @ts-ignore
export const useDragAndDrop = (onChange, dragRef) => {
  const [isDragging, setIsDragging] = useState(false);

  const dragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const dragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false)
  }, []);

  const dragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer!.files) {
      setIsDragging(true);
    }
  }, []);

  const dragDrop = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    console.log("dropped");

    onChange(e);

    setIsDragging(false);
  }, [onChange]);

  const initDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", dragIn);
      dragRef.current.addEventListener("dragleave", dragOut);
      dragRef.current.addEventListener("dragover", dragOver);
      dragRef.current.addEventListener("drop", dragDrop);
    }
  }, [dragIn, dragOut, dragOver, dragDrop]);

  const resetDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", dragIn);
      dragRef.current.removeEventListener("dragleave", dragOut);
      dragRef.current.removeEventListener("dragover", dragOver);
      dragRef.current.removeEventListener("drop", dragDrop);
    }
  }, [dragIn, dragOut, dragOver, dragDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return isDragging;
}