import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, Card } from "./ui";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-dark-950 text-white">
          <Card className="max-w-md w-full p-8 text-center border-brand-rose/20 bg-brand-rose/5">
            <div className="w-16 h-16 rounded-2xl bg-brand-rose/10 flex items-center justify-center text-brand-rose mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-black mb-4 font-display">Something went wrong</h2>
            <p className="text-slate-500 mb-8 text-sm">
              An unexpected error occurred. Our team has been notified.
            </p>
            <Button 
              glow 
              className="w-full bg-brand-rose hover:bg-brand-rose/80"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={18} className="mr-2" /> Reload Application
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
