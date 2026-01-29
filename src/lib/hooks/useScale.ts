import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook that simulates live scale readings
 * Simple simulation: updates less frequently, stays stable most of the time
 *
 * @param truckTareLbs - Optional truck tare weight in pounds. When provided,
 *                      this will be used as the base tare weight instead of
 *                      the default simulated value. The scale will still add
 *                      small variations around this base value.
 */
export function useScale(truckTareLbs?: number | null) {
  const [grossLbs, setGrossLbs] = useState<number>(78000);
  const [tareLbs, setTareLbs] = useState<number>(32000);
  const [scaleStatus, setScaleStatus] = useState<"READING" | "STABLE">(
    "STABLE",
  );

  const stabilizationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isReadingRef = useRef<boolean>(false);
  const truckTareLbsRef = useRef<number | null | undefined>(truckTareLbs);

  // Keep truckTareLbs ref in sync
  useEffect(() => {
    truckTareLbsRef.current = truckTareLbs;
  }, [truckTareLbs]);

  // Update tare weight when truck tare changes
  useEffect(() => {
    if (
      truckTareLbs !== null &&
      truckTareLbs !== undefined &&
      truckTareLbs > 0
    ) {
      // Use truck's tare weight as the base
      setTareLbs(truckTareLbs);
    }
  }, [truckTareLbs]);

  // Function to trigger a new reading manually
  const triggerReading = useCallback(() => {
    // Prevent concurrent readings
    if (isReadingRef.current) {
      return;
    }

    isReadingRef.current = true;
    setScaleStatus("READING");

    // Use functional updates to avoid dependency issues
    setGrossLbs((prevGross) => {
      const grossVariation = (Math.random() - 0.5) * 200;
      return Math.max(50000, prevGross + grossVariation);
    });

    setTareLbs((prevTare) => {
      // If truck tare is provided, use it as base with small variations
      // Otherwise, use previous value with variations
      const baseTare =
        truckTareLbsRef.current && truckTareLbsRef.current > 0
          ? truckTareLbsRef.current
          : prevTare;
      const tareVariation = (Math.random() - 0.5) * 40;
      return Math.max(25000, baseTare + tareVariation);
    });

    // Clear any existing stabilization timeout
    if (stabilizationTimeoutRef.current) {
      clearTimeout(stabilizationTimeoutRef.current);
    }

    // Stabilize after 2-3 seconds
    stabilizationTimeoutRef.current = setTimeout(
      () => {
        setScaleStatus("STABLE");
        isReadingRef.current = false;
      },
      2000 + Math.random() * 1000,
    );
  }, []);

  useEffect(() => {
    // Update scale readings every 3-5 seconds (much less frequent)
    const updateInterval = setInterval(
      () => {
        // Occasionally simulate a reading (20% chance)
        if (Math.random() < 0.2 && !isReadingRef.current) {
          triggerReading();
        }
      },
      3000 + Math.random() * 2000,
    ); // 3-5 seconds interval

    return () => {
      clearInterval(updateInterval);
      if (stabilizationTimeoutRef.current) {
        clearTimeout(stabilizationTimeoutRef.current);
      }
    };
  }, [triggerReading]);

  return {
    grossLbs,
    tareLbs,
    scaleStatus,
    triggerReading,
  };
}
