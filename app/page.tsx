"use client";

import { useState, useEffect } from "react";
import { SidebarNav, MobileNav } from "@/components/finance/sidebar-nav";
import { Dashboard } from "@/components/finance/dashboard";
import { Expenses } from "@/components/finance/expenses";
import { Goals } from "@/components/finance/goals";
import { AIAssistant } from "@/components/finance/ai-assistant";
import { SmartInsights, SpendingPatterns } from "@/components/finance/insights";
import { FinanceProvider, useFinance } from "@/lib/finance-context";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function FinanceAppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state } = useFinance();

  useEffect(() => {
    // Check for system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Show loading spinner while initial data is loading
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="h-12 w-12 rounded-full bg-primary mx-auto flex items-center justify-center">
            <span className="h-6 w-6 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar transition-transform lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarNav
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      </aside>

      {/* Mobile Bottom Nav */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="lg:ml-64 pb-20 lg:pb-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">FinanceAI</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold capitalize">
              {activeTab === "assistant" ? "AI Assistant" : activeTab}
            </h1>
            <p className="text-muted-foreground text-sm">
              {activeTab === "dashboard" &&
                "Overview of your financial health"}
              {activeTab === "expenses" && "Track and manage your expenses"}
              {activeTab === "goals" && "Monitor your savings goals"}
              {activeTab === "assistant" &&
                "Get personalized financial advice"}
            </p>
          </div>

          {/* Tab Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <Dashboard />
              <div className="grid gap-6 lg:grid-cols-2">
                <SmartInsights />
                <SpendingPatterns />
              </div>
            </div>
          )}

          {activeTab === "expenses" && <Expenses />}

          {activeTab === "goals" && <Goals />}

          {activeTab === "assistant" && <AIAssistant />}
        </div>
      </main>
    </div>
  );
}

export default function FinanceApp() {
  return (
    <FinanceProvider>
      <FinanceAppContent />
    </FinanceProvider>
  );
}
