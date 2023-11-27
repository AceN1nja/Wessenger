"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
/* Core */
import { Provider } from "react-redux";
import { Next13ProgressBar } from "next13-progressbar";
/* Instruments */
import { reduxStore } from "@/lib/redux";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <Provider store={reduxStore}>
        <Next13ProgressBar
          height="4px"
          color="white"
          options={{ showSpinner: true }}
          showOnShallow
        />
        {children}
      </Provider>
    </NextThemesProvider>
  );
}
