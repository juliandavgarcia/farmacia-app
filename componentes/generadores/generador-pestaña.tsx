/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export interface TabItem {
  valor: string;
  label: string;
  icono?: string;
  contenido: ReactNode;
}

interface CustomTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function GeneradorPestaña({
  tabs,
  defaultValue,
  className,
}: CustomTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue || tabs[0]?.valor}
      className={cn("", className)}
    >
      <TabsList>
        {tabs.map((tab) => {
          const IconComponent = tab.icono
            ? (LucideIcons as any)[tab.icono]
            : null;

          return (
            <TabsTrigger
              key={tab.valor}
              value={tab.valor}
              className="flex items-center gap-1"
            >
              {IconComponent && <IconComponent className="h-4" />}
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.valor} value={tab.valor}>
          {tab.contenido}
        </TabsContent>
      ))}
    </Tabs>
  );
}
