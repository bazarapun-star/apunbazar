import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props  { children: ReactNode; fallback?: ReactNode }
interface State  { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] px-4 text-center">
          <div className="text-4xl mb-4">🌿</div>
          <h2 className="font-serif text-xl font-bold mb-2">Kuch galat ho gaya</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            {this.state.error?.message ?? "Unexpected error occurred."}
          </p>
          <Button onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}>
            Reload karo
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
